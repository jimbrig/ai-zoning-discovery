import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
      // In a real implementation, this would call out to the AI services
      // For now, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result based on the example from the prompt
      if (params.state.toLowerCase() === 'georgia' && params.county.toLowerCase() === 'forsyth') {
        const mockResult: SearchResult = {
          id: Date.now().toString(),
          url: 'https://geo.forsythco.com/gisworkflow/rest/services/Public/Zoning_Districts/FeatureServer',
          title: 'Forsyth County GIS - Zoning Districts',
          description: 'Official zoning districts feature server for Forsyth County, Georgia',
          provider: 'mock',
          confidence: 0.95,
          timestamp: new Date().toISOString(),
          validated: true
        };
        setSearchResults([mockResult]);
        
        // Add to search history
        const historyEntry: SearchHistory = {
          id: Date.now().toString(),
          state: params.state,
          county: params.county,
          timestamp: new Date().toISOString(),
          results: [mockResult]
        };
        setSearchHistory(prev => [historyEntry, ...prev]);
        
        setSearchStatus(SearchStatus.SUCCESS);
      } else {
        // Simulate no results found
        setSearchResults([]);
        setSearchStatus(SearchStatus.SUCCESS);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchStatus(SearchStatus.ERROR);
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