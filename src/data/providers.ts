import { AIProvider } from '../types';

export const defaultProviders: AIProvider[] = [
  {
    id: 'tavily',
    name: 'Tavily',
    description: 'Specialized search engine API for retrieving accurate and relevant information.',
    apiKeyRequired: true,
    enabled: true
  },
  {
    id: 'exa',
    name: 'Exa',
    description: 'Semantic search API with improved understanding of queries and context.',
    apiKeyRequired: true,
    enabled: false
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    description: 'Advanced web crawler for finding specialized information across the web.',
    apiKeyRequired: true,
    enabled: false
  },
  {
    id: 'googlecse',
    name: 'Google Custom Search',
    description: 'Programmable search engine by Google that provides targeted results.',
    apiKeyRequired: true,
    enabled: false
  },
  {
    id: 'serpapi',
    name: 'SerpAPI',
    description: 'Real-time API to access search engine results for comprehensive data retrieval.',
    apiKeyRequired: true,
    enabled: false
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'AI models that can help process and understand complex geographic data.',
    apiKeyRequired: true,
    enabled: false
  }
];

export const statesList = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];