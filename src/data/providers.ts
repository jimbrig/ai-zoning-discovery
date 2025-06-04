import { AIProvider } from '../types';

export const defaultProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Advanced AI models for various tasks, including text generation and understanding.',
    apiKeyRequired: true,
    enabled: true
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'AI models focused on helpful, harmless, and honest responses.',
    apiKeyRequired: true,
    enabled: false
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    description: 'Google\'s multimodal AI model for understanding and generating content across text, images, and code.',
    apiKeyRequired: true,
    enabled: false
  },
  {
    id: 'jina-ai',
    name: 'Jina AI',
    description: 'Suite of AI products for search, prompt optimization, and content generation.',
    apiKeyRequired: true,
    enabled: false
  },
  {
    id: 'serper-api',
    name: 'Serper API',
    description: 'Real-time API to access search engine results from Google.',
    apiKeyRequired: true,
    enabled: false
  },
  {
    id: 'custom-search',
    name: 'Custom Search Engine',
    description: 'A custom-built search engine for specialized data retrieval.',
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