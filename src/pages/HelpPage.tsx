import React from 'react';
import { HelpCircle, Search, Key, Map, Settings, History } from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Help & Documentation</h1>
          <p className="text-gray-600">
            Learn how to use the ArcGIS URL Finder to locate zoning district feature servers.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-primary-500" />
            Getting Started
          </h2>
          
          <div className="prose max-w-none">
            <p>
              ArcGIS URL Finder helps you locate the correct feature server URLs for zoning district layers by state and county. 
              These URLs are essential for developers, planners, and GIS professionals who need to integrate zoning data into their applications.
            </p>
            
            <h3 className="flex items-center mt-6 mb-3 text-lg font-medium text-gray-800">
              <Search className="h-5 w-5 mr-2 text-primary-500" />
              How to Search
            </h3>
            
            <ol className="space-y-3 list-decimal pl-5">
              <li>Enter the state name in the "State" field (autocomplete will help you select valid states)</li>
              <li>Enter the county name in the "County" field</li>
              <li>Click the "Search" button to begin the search process</li>
              <li>Our AI agent will search multiple sources to find the most accurate URL for your specified location</li>
              <li>Results will display with confidence scores and validated indicators for the most reliable sources</li>
            </ol>
            
            <h3 className="flex items-center mt-6 mb-3 text-lg font-medium text-gray-800">
              <Key className="h-5 w-5 mr-2 text-primary-500" />
              API Provider Configuration
            </h3>
            
            <p>
              To improve search results, you can configure various AI providers with your own API keys:
            </p>
            
            <ul className="space-y-2 list-disc pl-5">
              <li>Navigate to the Settings page</li>
              <li>Enter your API keys for supported providers</li>
              <li>Enable or disable providers based on your preference</li>
              <li>All API keys are stored locally and never sent to our servers</li>
            </ul>
            
            <h3 className="flex items-center mt-6 mb-3 text-lg font-medium text-gray-800">
              <Map className="h-5 w-5 mr-2 text-primary-500" />
              Understanding URLs
            </h3>
            
            <p>
              ArcGIS feature server URLs typically follow this pattern:
            </p>
            
            <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm my-3">
              https://[domain]/[rest/services]/[folder]/[service-name]/FeatureServer
            </div>
            
            <p>
              For example:
            </p>
            
            <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm my-3">
              https://geo.forsythco.com/gisworkflow/rest/services/Public/Zoning_Districts/FeatureServer
            </div>
            
            <h3 className="flex items-center mt-6 mb-3 text-lg font-medium text-gray-800">
              <History className="h-5 w-5 mr-2 text-primary-500" />
              Search History
            </h3>
            
            <p>
              Your search history is saved locally in your browser. You can:
            </p>
            
            <ul className="space-y-2 list-disc pl-5">
              <li>View past searches on the History page</li>
              <li>Quickly access previously found URLs</li>
              <li>Remove individual search entries as needed</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-primary-500" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">What is a feature server URL?</h3>
              <p className="text-gray-600">
                A feature server URL is a web address that provides access to geographic data through ESRI's ArcGIS REST API. 
                For zoning districts, these URLs allow you to access official zoning boundaries and related information.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Why can't I find a URL for my county?</h3>
              <p className="text-gray-600">
                Not all counties publish their zoning data through ArcGIS feature servers, or they may use different naming conventions. 
                Try searching for broader terms like "planning" or "land use" if zoning-specific searches don't yield results.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">How accurate are the search results?</h3>
              <p className="text-gray-600">
                Our AI agent combines results from multiple sources and assigns confidence scores based on factors like source reliability, 
                URL structure, and metadata. "Validated" URLs have been confirmed to be working and contain zoning information.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Do I need to create an account?</h3>
              <p className="text-gray-600">
                No, this tool works without requiring user accounts. Your search history and settings are stored locally in your browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;