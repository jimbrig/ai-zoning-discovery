import React from 'react';
import HistoryList from '../components/history/HistoryList';

const HistoryPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search History</h1>
          <p className="text-gray-600">
            View your past searches and quickly access previously found zoning district URLs.
          </p>
        </div>
        
        <HistoryList />
      </div>
    </div>
  );
};

export default HistoryPage;