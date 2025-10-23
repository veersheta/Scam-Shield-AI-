
import React, { useContext } from 'react';
import { LogoIcon } from './icons/Icons';
import { AuthContext } from '../contexts/AuthContext';
import UserMenu from './auth/UserMenu';

interface HeaderProps {
  setView: (view: 'main' | 'dashboard') => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, onLoginClick, onSignUpClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-40 w-full bg-charcoal-black/80 backdrop-blur-lg border-b border-neutral-light transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button onClick={() => setView('main')} className="flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-purple rounded-md">
          <LogoIcon className="h-8 w-8 text-electric-purple" />
          <span className="text-2xl font-bold text-text-primary hidden sm:inline">ScamShield AI</span>
        </button>
        <div className="flex items-center space-x-2 md:space-x-4">
          {user ? (
            <UserMenu user={user} setView={setView} />
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={onLoginClick} className="text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-lg text-sm font-medium hidden sm:block">
                Login
              </button>
              <button onClick={onSignUpClick} className="bg-electric-purple hover:opacity-90 transition-opacity text-white font-semibold py-2 px-4 rounded-lg text-sm">
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