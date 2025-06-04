import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, AlertTriangle } from 'lucide-react';
import { SearchParams, SearchStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { statesList } from '../../data/providers';

const SearchForm: React.FC = () => {
  const { startSearch, searchStatus, clearResults, hasConfiguredProviders } = useAppContext();
  const [state, setState] = useState<string>('');
  const [county, setCounty] = useState<string>('');
  const [stateError, setStateError] = useState<string>('');
  const [countyError, setCountyError] = useState<string>('');
  const [filteredStates, setFilteredStates] = useState<string[]>([]);
  const [showStateDropdown, setShowStateDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (state.trim() === '') {
      setFilteredStates([]);
    } else {
      const filtered = statesList.filter(s => 
        s.toLowerCase().includes(state.toLowerCase())
      );
      setFilteredStates(filtered);
    }
  }, [state]);

  const handleStateSelect = (selectedState: string) => {
    setState(selectedState);
    setShowStateDropdown(false);
    setStateError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    
    if (!state.trim()) {
      setStateError('State is required');
      hasError = true;
    } else {
      setStateError('');
    }
    
    if (!county.trim()) {
      setCountyError('County is required');
      hasError = true;
    } else {
      setCountyError('');
    }
    
    if (hasError) return;
    
    const params: SearchParams = {
      state: state.trim(),
      county: county.trim()
    };
    
    startSearch(params);
  };

  const handleClear = () => {
    setState('');
    setCounty('');
    setStateError('');
    setCountyError('');
    clearResults();
  };

  const isSearching = searchStatus === SearchStatus.SEARCHING;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Zoning District URLs</h2>
      
      {!hasConfiguredProviders && (
        <div className="mb-6 bg-warning-50 border-l-4 border-warning-500 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-warning-500 mr-3" />
            <div>
              <h3 className="text-warning-700 font-medium">No AI Providers Configured</h3>
              <p className="text-warning-600 mt-1">
                You are currently viewing demo data. To see real results, please configure at least one AI provider in the Settings page.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <div className="relative">
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setShowStateDropdown(true);
              }}
              onFocus={() => setShowStateDropdown(true)}
              disabled={isSearching}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                stateError ? 'border-error-500' : 'border-gray-300'
              }`}
              placeholder="Enter state name"
            />
            {state && (
              <button
                type="button"
                onClick={() => setState('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                aria-label="Clear state"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {stateError && <p className="mt-1 text-sm text-error-500">{stateError}</p>}
          
          {showStateDropdown && filteredStates.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <ul>
                {filteredStates.map((stateName) => (
                  <li
                    key={stateName}
                    className="px-4 py-2 hover:bg-primary-50 cursor-pointer"
                    onClick={() => handleStateSelect(stateName)}
                  >
                    {stateName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
            County
          </label>
          <input
            type="text"
            id="county"
            value={county}
            onChange={(e) => {
              setCounty(e.target.value);
              setCountyError('');
            }}
            disabled={isSearching}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
              countyError ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="Enter county name"
          />
          {countyError && <p className="mt-1 text-sm text-error-500">{countyError}</p>}
        </div>
        
        <div className="flex space-x-4 pt-2">
          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200 disabled:bg-primary-300 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Search
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={isSearching}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-6 rounded-md font-medium transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;