
import React, { useState } from 'react';
import { RECOVERY_RESOURCES } from '../constants';
import { ResourceCategory, ContactMethod } from '../types';
import { 
  PhoneIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  CreditCardIcon,
  UserCircleIcon,
  BuildingLibraryIcon,
  FlagIcon,
  LifebuoyIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  MailIcon
} from './icons/Icons';

type Region = 'US' | 'UK' | 'IN' | 'International';

const iconMap: Record<ResourceCategory['icon'], React.ReactNode> = {
  CreditCard: <CreditCardIcon className="h-6 w-6 text-status-red" />,
  UserCircle: <UserCircleIcon className="h-6 w-6 text-status-blue" />,
  BuildingLibrary: <BuildingLibraryIcon className="h-6 w-6 text-status-yellow" />,
  Flag: <FlagIcon className="h-6 w-6 text-purple-400" />,
  Lifebuoy: <LifebuoyIcon className="h-6 w-6 text-status-green" />,
};

const AccordionItem: React.FC<{ category: ResourceCategory }> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-light-bg dark:bg-dark-bg rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center space-x-4">
          {iconMap[category.icon]}
          <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">{category.categoryName}</span>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pb-4 space-y-4">
          {category.resources.map(resource => (
            <div key={resource.organization} className="pt-3 border-t border-light-border dark:border-dark-border">
              <h5 className="font-bold text-light-text-primary dark:text-dark-text-primary">{resource.organization}</h5>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1 mb-2">{resource.description}</p>
              <div className="flex flex-wrap gap-2">
                {resource.contacts.map(contact => (
                   <a
                    key={contact.label}
                    href={contact.type === 'phone' ? `tel:${contact.value}` : contact.value}
                    target={contact.type === 'website' ? '_blank' : undefined}
                    rel={contact.type === 'website' ? 'noopener noreferrer' : undefined}
                    className="text-xs bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:text-dark-text-primary font-semibold py-1 px-3 rounded-full transition-colors inline-block"
                  >
                    {contact.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecoveryToolkit: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('US');

  const firstSteps = [
    { icon: <CreditCardIcon className="h-5 w-5 text-status-red" />, text: "Contact your bank/financial institutions to report fraud and freeze accounts." },
    { icon: <LockClosedIcon className="h-5 w-5 text-status-yellow" />, text: "Change passwords for any compromised accounts (email, social media, etc.)." },
    { icon: <ShieldCheckIcon className="h-5 w-5 text-status-green" />, text: "Enable Multi-Factor Authentication (MFA) on all important accounts." },
    { icon: <MailIcon className="h-5 w-5 text-status-blue" />, text: "Report the incident using the official channels listed below for your region." },
  ];

  return (
    <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20">
      <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">Scam Recovery Toolkit</h3>
      <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">If you've been targeted, act fast. Here are verified resources to help you recover based on your region.</p>

      <div className="mb-6">
        <label htmlFor="region-select" className="flex items-center space-x-2 text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2">
          <GlobeAltIcon className="h-5 w-5" />
          <span>Select Your Region:</span>
        </label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value as Region)}
          className="w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
        >
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="IN">India</option>
          <option value="International">International</option>
        </select>
      </div>

      <div className="mb-8 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
        <h4 className="font-bold text-light-text-primary dark:text-dark-text-primary mb-3">Immediate First Steps</h4>
        <ul className="space-y-3">
          {firstSteps.map((step, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">{step.icon}</div>
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{step.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {RECOVERY_RESOURCES[selectedRegion].map(category => (
          <AccordionItem key={category.categoryName} category={category} />
        ))}
      </div>
    </div>
  );
};

export default RecoveryToolkit;