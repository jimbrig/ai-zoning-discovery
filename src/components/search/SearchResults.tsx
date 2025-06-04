import React from 'react';
import { ExternalLink, MapPin, Share2, Save, CheckCircle, Clock, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { SearchStatus } from '../../types';
import MapPreview from '../map/MapView';

const SearchResults: React.FC = () => {
  const { searchResults, searchStatus, currentSearch, saveResult } = useAppContext();
  
  if (searchStatus === SearchStatus.IDLE) {
    return null;
  }
  
  if (searchStatus === SearchStatus.SEARCHING) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col items-center justify-center text-center py-12">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-primary-200 rounded-full animate-ping opacity-75"></div>
          <div className="relative flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
            <MapPin className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Searching for Zoning Districts</h3>
        <p className="text-gray-600 mb-2">Looking for ArcGIS URLs in {currentSearch?.county}, {currentSearch?.state}</p>
        <p className="text-sm text-gray-500">This may take a moment as we search multiple sources...</p>
      </div>
    );
  }
  
  if (searchStatus === SearchStatus.ERROR) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="bg-error-50 text-error-700 p-4 rounded-md mb-4">
          <h3 className="font-semibold">Error Occurred</h3>
          <p>There was a problem completing your search. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  if (searchResults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any zoning district URLs for {currentSearch?.county}, {currentSearch?.state}.
          </p>
          <p className="text-sm text-gray-500">
            Try checking the spelling or searching for a different county.
          </p>
        </div>
      </div>
    );
  }
  
  const handleShare = async (result: SearchResult) => {
    try {
      await navigator.share({
        title: `Zoning Districts - ${currentSearch?.county}, ${currentSearch?.state}`,
        text: `ArcGIS Feature Server URL for ${result.title}`,
        url: result.url
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(result.url);
      alert('URL copied to clipboard!');
    }
  };

  const handleSave = (result: SearchResult) => {
    const updatedResult = { ...result, saved: true };
    saveResult(updatedResult);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Results for {currentSearch?.county}, {currentSearch?.state}
          </h3>
          <span className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(searchResults[0].timestamp).toLocaleString()}
          </span>
        </div>
        
        {searchResults.map((result) => (
          <div 
            key={result.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-primary-700 mb-2 md:mb-0">
                {result.title}
              </h4>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${result.confidence > 0.8 
                    ? 'bg-success-50 text-success-700' 
                    : result.confidence > 0.5 
                      ? 'bg-warning-50 text-warning-700' 
                      : 'bg-error-50 text-error-700'
                  }`}
                >
                  {Math.round(result.confidence * 100)}% Match
                </span>
                
                {result.validated && (
                  <span className="flex items-center text-xs text-success-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Validated
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{result.description}</p>
            
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-3 break-all">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 hover:underline font-mono text-sm"
              >
                {result.url}
              </a>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 text-sm rounded-md bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open URL
              </a>
              
              <button
                type="button"
                onClick={() => handleShare(result)}
                className="flex items-center px-3 py-1.5 text-sm rounded-md bg-secondary-100 text-secondary-700 hover:bg-secondary-200 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
              
              <button
                type="button"
                onClick={() => handleSave(result)}
                disabled={result.saved}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                  result.saved
                    ? 'bg-success-50 text-success-700 cursor-not-allowed'
                    : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                }`}
              >
                <Save className="h-4 w-4 mr-1" />
                {result.saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Preview Map
          </h3>
          <MapPreview url={searchResults[0].url} />
          <p className="text-sm text-gray-500 mt-3">
            Click "Open URL" above to view the full feature server and explore all available layers.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;