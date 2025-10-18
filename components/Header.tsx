import React from 'react';
import { WrenchScrewdriverIcon } from './icons';
import { Role } from '../App';

type View = 'list' | 'form' | 'reports';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  role: Role;
  setRole: (role: Role) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, role, setRole }) => {
  const navButtonClasses = (view: View) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      currentView === view 
      ? 'bg-brand-blue text-white shadow-md' 
      : 'text-brand-text hover:bg-brand-light-blue'
    }`;
  
  const roleSwitcherClasses = (selectedRole: Role) => 
    `px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
      role === selectedRole 
      ? 'bg-brand-blue text-white' 
      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-brand-blue" />
            <h1 className="text-xl font-bold ml-2 text-gray-800">ResiFix</h1>
          </div>

          <div className="flex-grow flex justify-center items-center px-4">
             <div className="bg-gray-100 p-1 rounded-lg flex items-center space-x-1">
              <button onClick={() => setRole('requester')} className={roleSwitcherClasses('requester')}>
                Requester
              </button>
              <button onClick={() => setRole('admin')} className={roleSwitcherClasses('admin')}>
                Admin
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {role === 'requester' && (
              <>
                <button onClick={() => setView('form')} className={navButtonClasses('form')}>
                  New Request
                </button>
                <button onClick={() => setView('list')} className={navButtonClasses('list')}>
                  View Requests
                </button>
              </>
            )}
            {role === 'admin' && (
              <>
                <button onClick={() => setView('list')} className={navButtonClasses('list')}>
                  All Requests
                </button>
                <button onClick={() => setView('reports')} className={navButtonClasses('reports')}>
                  Reports
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;