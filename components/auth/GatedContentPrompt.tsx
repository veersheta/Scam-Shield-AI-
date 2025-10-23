
import React from 'react';

interface GatedContentPromptProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const GatedContentPrompt: React.FC<GatedContentPromptProps> = ({ icon, title, message, onLoginClick, onSignUpClick }) => {
  return (
    <div className="text-center p-8 md:p-12 rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border">
      <div className="w-16 h-16 mx-auto mb-6 text-light-accent dark:text-dark-accent opacity-50">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-16 h-16" }) : icon}
      </div>
      <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">{title}</h3>
      <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-xl mx-auto mb-6">
        {message}
      </p>
      <div className="flex items-center justify-center space-x-4">
        <button onClick={onLoginClick} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors px-4 py-2 rounded-lg font-medium">
          Login
        </button>
        <button onClick={onSignUpClick} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity text-white font-semibold py-2 px-5 rounded-lg">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default GatedContentPrompt;