
import React, { useContext } from 'react';
import { LogoIcon } from './icons/Icons';
import { AuthContext } from '../contexts/AuthContext';
import UserMenu from './auth/UserMenu';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  setView: (view: 'main' | 'dashboard') => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, onLoginClick, onSignUpClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-40 w-full bg-light-glass dark:bg-dark-glass backdrop-blur-xl border-b border-white/20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button onClick={() => setView('main')} className="flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-light-accent dark:focus-visible:ring-dark-accent rounded-md">
          <LogoIcon className="h-8 w-8 text-light-accent dark:text-dark-accent" />
          <span className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary hidden sm:inline">ScamShield AI</span>
        </button>
        <div className="flex items-center space-x-2 md:space-x-4">
          <ThemeSwitcher />
          {user ? (
            <UserMenu user={user} setView={setView} />
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={onLoginClick} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors px-3 py-2 rounded-lg text-sm font-medium hidden sm:block">
                Login
              </button>
              <button onClick={onSignUpClick} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity text-white font-semibold py-2 px-4 rounded-lg text-sm">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;