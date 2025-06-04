export interface SearchParams {
  state: string;
  county: string;
}

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  apiKeyRequired: boolean;
  apiKey?: string;
  enabled: boolean;
}

export interface SearchResult {
  id: string;
  url: string;
  title: string;
  description: string;
  provider: string;
  confidence: number;
  timestamp: string;
  validated: boolean;
  notes?: string;
  saved?: boolean;
}

export interface SearchHistory {
  id: string;
  state: string;
  county: string;
  timestamp: string;
  results: SearchResult[];
}

export enum SearchStatus {
  IDLE = 'idle',
  SEARCHING = 'searching',
  SUCCESS = 'success',
  ERROR = 'error'
}