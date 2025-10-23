
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { BookOpenIcon, LifebuoyIcon, UsersIcon, MagnifyingGlassIcon, LockClosedIcon } from './icons/Icons';
import RecoveryToolkit from './RecoveryToolkit';
import LiteracyHub from './LiteracyHub';
import CommunityHub from './CommunityHub';
import LinkSandbox from './LinkSandbox';
import PasswordVault from './PasswordVault';
import GatedContentPrompt from './auth/GatedContentPrompt';

type ToolTabId = 'recovery' | 'literacy' | 'community' | 'sandbox' | 'vault';

interface ToolTab {
  id: ToolTabId;
  label: string;
  icon: React.ReactNode;
  isProtected: boolean;
  prompt: {
    title: string;
    message: string;
  };
}

const TABS: ToolTab[] = [
  { 
    id: 'recovery', 
    label: 'Fraud Recovery Center', 
    icon: <LifebuoyIcon className="h-6 w-6 mb-1 sm:mb-0" />,
    isProtected: true,
    prompt: {
      title: 'Access the Fraud Recovery Center',
      message: 'Log in or sign up to access verified helplines and one-tap actions to report fraud, freeze accounts, and alert contacts.'
    }
  },
  { 
    id: 'literacy', 
    label: 'Threat Awareness Training', 
    icon: <BookOpenIcon className="h-6 w-6 mb-1 sm:mb-0" />,
    isProtected: false,
    prompt: { title: '', message: '' }
  },
  { 
    id: 'community', 
    label: 'Crowdsourced Threat-Intel', 
    icon: <UsersIcon className="h-6 w-6 mb-1 sm:mb-0" />,
    isProtected: false,
    prompt: { title: '', message: '' }
  },
  { 
    id: 'sandbox', 
    label: 'Zero-Trust Sandbox', 
    icon: <MagnifyingGlassIcon className="h-6 w-6 mb-1 sm:mb-0" />,
    isProtected: true,
    prompt: {
        title: 'Unlock the Zero-Trust Link Sandbox',
        message: 'Log in or sign up to safely preview suspicious links in our secure, isolated sandbox environment.'
    }
  },
  { 
    id: 'vault', 
    label: 'Encrypted Vault', 
    icon: <LockClosedIcon className="h-6 w-6 mb-1 sm:mb-0" />,
    isProtected: true,
    prompt: {
        title: 'Unlock Your Encrypted Password Vault',
        message: 'Log in or sign up to use the secure password vault and enhance your digital security.'
    }
  },
];

interface ToolSuiteProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const ToolSuite: React.FC<ToolSuiteProps> = ({ onLoginClick, onSignUpClick }) => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<ToolTabId>('recovery');

  const renderContent = () => {
    const tab = TABS.find(t => t.id === activeTab)!;
    
    if (tab.isProtected && !user) {
      return (
        <GatedContentPrompt 
          icon={tab.icon} 
          title={tab.prompt.title} 
          message={tab.prompt.message} 
          onLoginClick={onLoginClick} 
          onSignUpClick={onSignUpClick} 
        />
      );
    }

    switch(activeTab) {
      case 'recovery': return <RecoveryToolkit />;
      case 'literacy': return <LiteracyHub />;
      case 'community': return <CommunityHub />;
      case 'sandbox': return <LinkSandbox />;
      case 'vault': return <PasswordVault />;
      default: return null;
    }
  };

  const TabButton: React.FC<{ tab: ToolTab }> = ({ tab }) => (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={`flex-1 flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-3 p-4 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-light-bg-secondary dark:focus-visible:ring-offset-dark-bg-secondary focus-visible:ring-light-accent dark:focus-visible:ring-dark-accent ${
        activeTab === tab.id
          ? 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-accent dark:text-dark-accent shadow-sm'
          : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary/50 dark:hover:bg-dark-bg-secondary/50'
      }`}
    >
      {tab.icon}
      <span className="text-sm sm:text-base">{tab.label}</span>
    </button>
  );

  return (
    <section className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-2 sm:p-4 rounded-2xl border border-white/20">
      <div className="flex flex-wrap sm:flex-nowrap gap-2 bg-light-bg dark:bg-dark-bg p-2 rounded-xl">
        {TABS.map(tab => <TabButton key={tab.id} tab={tab} />)}
      </div>
      <div className="mt-4">
        {renderContent()}
      </div>
    </section>
  );
};

export default ToolSuite;