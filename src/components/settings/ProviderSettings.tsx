import React, { useState } from 'react';
import { Save, Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AIProvider } from '../../types';
import { useAppContext } from '../../context/AppContext';

const ProviderSettings: React.FC = () => {
  const { providers, updateProvider } = useAppContext();
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  const toggleShowApiKey = (id: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleApiKeyChange = (id: string, value: string) => {
    updateProvider(id, { apiKey: value });
  };

  const handleToggleProvider = (id: string, enabled: boolean) => {
    updateProvider(id, { enabled });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">AI Providers Configuration</h2>
      
      <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-primary-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-primary-700">
              Configure the AI providers below by adding your API keys. Enable the providers you want to use for searching zoning district URLs.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            showApiKey={showApiKey[provider.id] || false}
            onToggleShowApiKey={() => toggleShowApiKey(provider.id)}
            onApiKeyChange={(value) => handleApiKeyChange(provider.id, value)}
            onToggleProvider={(enabled) => handleToggleProvider(provider.id, enabled)}
          />
        ))}
      </div>
    </div>
  );
};

interface ProviderCardProps {
  provider: AIProvider;
  showApiKey: boolean;
  onToggleShowApiKey: () => void;
  onApiKeyChange: (value: string) => void;
  onToggleProvider: (enabled: boolean) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  showApiKey,
  onToggleShowApiKey,
  onApiKeyChange,
  onToggleProvider
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2 sm:mb-0">{provider.name}</h3>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-3">Enabled</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={provider.enabled}
              onChange={(e) => onToggleProvider(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{provider.description}</p>
      
      {provider.apiKeyRequired && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showApiKey ? "text" : "password"}
              value={provider.apiKey || ''}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter API key"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                onClick={onToggleShowApiKey}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProviderSettings;