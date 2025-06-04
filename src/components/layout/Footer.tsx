import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ArcGIS URL Finder
            <span className="mx-2">•</span>
            <span>Find zoning district layers with AI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/yourusername/arcgis-url-finder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
            
            <span className="text-gray-600 text-sm flex items-center">
              Built with <Heart className="h-4 w-4 mx-1 text-error-500" /> and AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;