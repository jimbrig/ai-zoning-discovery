import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@tavily/js';
import { AIProvider, SearchHistory, SearchResult, SearchParams, SearchStatus } from '../types';
import { defaultProviders } from '../data/providers';

interface AppContextType {
  providers: AIProvider[];
  updateProvider: (id: string, updates: Partial<AIProvider>) => void;
  searchHistory: SearchHistory[];
  currentSearch: SearchParams | null;
  searchResults: SearchResult[];
  searchStatus: SearchStatus;
  startSearch: (params: SearchParams) => Promise<void>;
  saveResult: (result: SearchResult) => void;
  clearResults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [providers, setProviders] = useState<AIProvider[]>(() => {
    const savedProviders = localStorage.getItem('aiProviders');
    return savedProviders ? JSON.parse(savedProviders) : defaultProviders;
  });
  
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [currentSearch, setCurrentSearch] = useState<SearchParams | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(SearchStatus.IDLE);

  useEffect(() => {
    localStorage.setItem('aiProviders', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const updateProvider = (id: string, updates: Partial<AIProvider>) => {
    setProviders(prevProviders => 
      prevProviders.map(provider => 
        provider.id === id ? { ...provider, ...updates } : provider
      )
    );
  };

  const startSearch = async (params: SearchParams) => {
    setCurrentSearch(params);
    setSearchStatus(SearchStatus.SEARCHING);
    
    try {
      const tavilyProvider = providers.find(p => p.id === 'tavily');
      
      if (!tavilyProvider?.enabled || !tavilyProvider?.apiKey) {
        throw new Error('Tavily API key not configured. Please add your API key in Settings.');
      }

      const client = createClient(tavilyProvider.apiKey);
      
      // Construct a search query that targets ArcGIS zoning district URLs
      const searchQuery = `${params.county} County, ${params.state} ArcGIS zoning districts feature server URL site:*.gov OR site:*.com`;
      
      const response = await client.search({
        query: searchQuery,
        search_depth: 'advanced',
        include_domains: ['arcgis.com', 'gis.com'],
        include_answer: true,
        max_results: 5
      });

      if (!response || !Array.isArray(response.results)) {
        throw new Error('Invalid response from Tavily API');
      }

      // Transform Tavily results into our SearchResult format
      const transformedResults: SearchResult[] = response.results
        .filter(result => {
          // Filter for URLs that look like feature servers
          const url = result.url.toLowerCase();
          return url.includes('featureserver') || url.includes('mapserver');
        })
        .map(result => ({
          id: crypto.randomUUID(),
          url: result.url,
          title: result.title,
          description: result.content,
          provider: 'tavily',
          confidence: result.score || 0.7,
          timestamp: new Date().toISOString(),
          validated: result.score > 0.8,
          notes: response.answer
        }));

      setSearchResults(transformedResults);
      
      // Add to search history if we found results
      if (transformedResults.length > 0) {
        const historyEntry: SearchHistory = {
          id: crypto.randomUUID(),
          state: params.state,
          county: params.county,
          timestamp: new Date().toISOString(),
          results: transformedResults
        };
        setSearchHistory(prev => [historyEntry, ...prev]);
      }
      
      setSearchStatus(SearchStatus.SUCCESS);
    } catch (error) {
      console.error('Search error:', error);
      setSearchStatus(SearchStatus.ERROR);
      setSearchResults([]);
    }
  };

  const saveResult = (result: SearchResult) => {
    const existingIndex = searchResults.findIndex(r => r.id === result.id);
    
    if (existingIndex >= 0) {
      setSearchResults(prev => 
        prev.map(r => r.id === result.id ? result : r)
      );
      
      // Update in history as well
      setSearchHistory(prev => 
        prev.map(h => {
          const resultIndex = h.results.findIndex(r => r.id === result.id);
          if (resultIndex >= 0) {
            const updatedResults = [...h.results];
            updatedResults[resultIndex] = result;
            return { ...h, results: updatedResults };
          }
          return h;
        })
      );
    } else {
      setSearchResults(prev => [...prev, result]);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setSearchStatus(SearchStatus.IDLE);
    setCurrentSearch(null);
  };

  return (
    <AppContext.Provider
      value={{
        providers,
        updateProvider,
        searchHistory,
        currentSearch,
        searchResults,
        searchStatus,
        startSearch,
        saveResult,
        clearResults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};