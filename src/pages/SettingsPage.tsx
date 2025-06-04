import React from 'react';
import ProviderSettings from '../components/settings/ProviderSettings';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Configure AI providers and customize your search experience.
          </p>
        </div>
        
        <ProviderSettings />
      </div>
    </div>
  );
};

export default SettingsPage;