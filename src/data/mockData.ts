import { SearchResult } from '../types';

export const mockResults: SearchResult[] = [
  {
    id: '1',
    url: 'https://gis.example.gov/arcgis/rest/services/Planning/ZoningDistricts/FeatureServer',
    title: 'Example County Zoning Districts',
    description: 'Official zoning district boundaries and classifications for Example County. This is demo data for preview purposes.',
    provider: 'demo',
    confidence: 0.95,
    timestamp: new Date().toISOString(),
    validated: true,
    notes: 'This is a mock result for demonstration purposes.'
  },
  {
    id: '2',
    url: 'https://maps.example.com/arcgis/rest/services/Zoning/MapServer',
    title: 'Example City Planning Zones',
    description: 'Comprehensive zoning information including district boundaries, land use, and development regulations. This is demo data.',
    provider: 'demo',
    confidence: 0.85,
    timestamp: new Date().toISOString(),
    validated: true,
    notes: 'This is a mock result for demonstration purposes.'
  }
];