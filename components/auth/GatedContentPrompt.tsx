
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
    <div className="text-center p-8 md:p-12 rounded-2xl bg-neutral-dark border border-neutral-light">
      <div className="w-16 h-16 mx-auto mb-6 text-electric-purple opacity-50">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-16 h-16' })}
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-4">{title}</h3>
      <p className="text-text-secondary max-w-xl mx-auto mb-6">
        {message}
      </p>
      <div className="flex items-center justify-center space-x-4">
        <button onClick={onLoginClick} className="text-text-secondary hover:text-text-primary transition-colors px-4 py-2 rounded-lg font-medium">
          Login
        </button>
        <button onClick={onSignUpClick} className="bg-electric-purple hover:opacity-90 transition-opacity text-white font-semibold py-2 px-5 rounded-lg">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default GatedContentPrompt;