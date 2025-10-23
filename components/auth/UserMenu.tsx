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
        className="flex items-center space-x-2 bg-neutral-dark px-3 py-2 rounded-lg hover:bg-neutral-light"
      >
        <span className="text-sm font-medium text-text-primary">{user.email}</span>
        <ChevronDownIcon className={`w-4 h-4 text-text-secondary transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-dark border border-neutral-light rounded-lg shadow-lg z-20 py-1">
          {user.role === 'admin' && (
            <button onClick={handleDashboardClick} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-neutral-light">
              Admin Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-neutral-light"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;