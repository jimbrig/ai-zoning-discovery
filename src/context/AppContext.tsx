import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AIProvider, SearchHistory, SearchResult, SearchParams, SearchStatus } from '../types';
import { defaultProviders } from '../data/providers';
import { searchWithProviders } from '../utils/search';
import { mockResults } from '../data/mockData';

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
  hasConfiguredProviders: boolean;
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
  // Load providers with environment variables if available
  const [providers, setProviders] = useState<AIProvider[]>(() => {
    const savedProviders = localStorage.getItem('aiProviders');
    const initialProviders = savedProviders ? JSON.parse(savedProviders) : defaultProviders;
    
    // Load API keys from environment variables
    return initialProviders.map(provider => ({
      ...provider,
      apiKey: import.meta.env[`VITE_${provider.id.toUpperCase()}_API_KEY`] || provider.apiKey,
      enabled: Boolean(import.meta.env[`VITE_${provider.id.toUpperCase()}_API_KEY`]) || provider.enabled
    }));
  });
  
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [currentSearch, setCurrentSearch] = useState<SearchParams | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(SearchStatus.IDLE);
  
  const hasConfiguredProviders = providers.some(p => p.enabled && p.apiKey);

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
      const enabledProviders = providers.filter(p => p.enabled && p.apiKey);
      
      if (enabledProviders.length === 0) {
        // Use mock data when no providers are configured
        setSearchResults(mockResults);
        
        const historyEntry: SearchHistory = {
          id: crypto.randomUUID(),
          state: params.state,
          county: params.county,
          timestamp: new Date().toISOString(),
          results: mockResults
        };
        setSearchHistory(prev => [historyEntry, ...prev]);
        setSearchStatus(SearchStatus.SUCCESS);
        return;
      }

      const results = await searchWithProviders(enabledProviders, params.state, params.county);
      
      if (results.length > 0) {
        setSearchResults(results);
        
        const historyEntry: SearchHistory = {
          id: crypto.randomUUID(),
          state: params.state,
          county: params.county,
          timestamp: new Date().toISOString(),
          results: results
        };
        setSearchHistory(prev => [historyEntry, ...prev]);
      } else {
        setSearchResults([]);
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
        clearResults,
        hasConfiguredProviders
      }}
    >
      {children}
    </AppContext.Provider>
  );
};