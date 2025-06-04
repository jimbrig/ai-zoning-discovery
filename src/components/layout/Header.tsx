import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Settings, Search, History, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-primary-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Map className="h-8 w-8 mr-2 text-accent-400" />
            <h1 className="text-xl font-bold">ArcGIS URL Finder</h1>
          </div>
          
          <nav className="flex space-x-1 sm:space-x-2">
            <NavLink to="/" active={isActive('/')}>
              <Search className="h-4 w-4 mr-1" />
              <span>Search</span>
            </NavLink>
            
            <NavLink to="/history" active={isActive('/history')}>
              <History className="h-4 w-4 mr-1" />
              <span>History</span>
            </NavLink>
            
            <NavLink to="/settings" active={isActive('/settings')}>
              <Settings className="h-4 w-4 mr-1" />
              <span>Settings</span>
            </NavLink>
            
            <NavLink to="/help" active={isActive('/help')}>
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>Help</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center px-3 py-2 rounded-md text-sm font-medium
        transition-colors duration-200
        ${active 
          ? 'bg-primary-700 text-white' 
          : 'text-primary-100 hover:bg-primary-700 hover:text-white'}
      `}
    >
      {children}
    </Link>
  );
};

export default Header;