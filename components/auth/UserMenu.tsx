import React, { useState, useEffect, useRef, useContext } from 'react';
import { User } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { ChevronDownIcon } from '../icons/Icons';

interface UserMenuProps {
  user: User;
  setView: (view: 'main' | 'dashboard') => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, setView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleLogout = () => {
    logout();
    setView('main'); // Reset view on logout
  };
  
  const handleDashboardClick = () => {
    setView('dashboard');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-light-bg-secondary dark:bg-dark-bg-secondary px-3 py-2 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50"
      >
        <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{user.email}</span>
        <ChevronDownIcon className={`w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg shadow-lg z-20 py-1">
          {user.role === 'admin' && (
            <button onClick={handleDashboardClick} className="block w-full text-left px-4 py-2 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-border/50 dark:hover:bg-dark-border/50">
              Admin Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-border/50 dark:hover:bg-dark-border/50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
