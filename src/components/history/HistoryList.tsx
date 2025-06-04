import React from 'react';
import { Clock, MapPin, Trash2, ExternalLink, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const HistoryList: React.FC = () => {
  const { searchHistory, startSearch } = useAppContext();
  const navigate = useNavigate();
  
  if (searchHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center py-12">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Search History</h3>
        <p className="text-gray-600">
          Your past searches will appear here once you start looking up zoning districts.
        </p>
      </div>
    );
  }
  
  const handleSearchAgain = (state: string, county: string) => {
    startSearch({ state, county });
    navigate('/');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Search History</h2>
      
      <div className="space-y-4">
        {searchHistory.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">
                  {entry.county}, {entry.state}
                </h3>
              </div>
              
              <span className="text-sm text-gray-500">
                {new Date(entry.timestamp).toLocaleDateString()} 
                <span className="mx-1">•</span>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            {entry.results.length > 0 && (
              <div className="ml-7 mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Found URLs:</h4>
                <ul className="space-y-2">
                  {entry.results.map((result) => (
                    <li key={result.id} className="text-sm">
                      <div className="flex items-start">
                        <span className="font-medium mr-2">{result.title}:</span>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 hover:underline truncate flex-1"
                        >
                          {result.url}
                        </a>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-gray-500 hover:text-primary-600"
                          aria-label="Open URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-3">
              <button
                type="button"
                onClick={() => handleSearchAgain(entry.state, entry.county)}
                className="flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors"
              >
                <Search className="h-4 w-4 mr-1" />
                Search Again
              </button>
              
              <button
                type="button"
                className="flex items-center text-sm text-gray-500 hover:text-error-600 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;