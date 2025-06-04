import React from 'react';
import SearchForm from '../components/search/SearchForm';
import SearchResults from '../components/search/SearchResults';

const SearchPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Zoning District Feature Servers</h1>
          <p className="text-gray-600">
            Enter a state and county to find the official ArcGIS ESRI feature server URL for zoning district layers.
          </p>
        </div>
        
        <SearchForm />
        <SearchResults />
      </div>
    </div>
  );
};

export default SearchPage;