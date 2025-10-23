
import React, { useState, useEffect } from 'react';
import { PasswordEntry } from '../types';
import { LockClosedIcon, EyeIcon, EyeOffIcon, TrashIcon, SparklesIcon, ClipboardIcon, ClipboardCheckIcon } from './icons/Icons';

const STORAGE_KEY = 'scamshield-vault';

// Basic encoding/decoding for demonstration (not true encryption)
const encode = (str: string) => btoa(str);
const decode = (hash: string) => atob(hash);

const calculatePasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (password.length === 0) {
      return { score: 0, label: '', color: 'bg-transparent', width: 'w-0' };
  }
  
  if (password.length < 8) {
      return { score: 1, label: 'Weak', color: 'bg-status-red', width: 'w-1/4' };
  }

  switch (score) {
    case 2:
      return { score, label: 'Fair', color: 'bg-status-yellow', width: 'w-1/2' };
    case 3:
      return { score, label: 'Good', color: 'bg-status-blue', width: 'w-3/4' };
    case 4:
      return { score, label: 'Strong', color: 'bg-status-green', width: 'w-full' };
    default:
      return { score: 1, label: 'Weak', color: 'bg-status-red', width: 'w-1/4' };
  }
};


const PasswordVault: React.FC = () => {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [newService, setNewService] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [generatedPasswordCopied, setGeneratedPasswordCopied] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''));
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(STORAGE_KEY);
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error("Failed to load vault entries from localStorage", error);
      setError("Could not load vault data. It might be corrupted or your browser's storage is inaccessible.");
    }
  }, []);

  useEffect(() => {
    try {
      setError(null); // Clear previous errors on successful update
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error("Failed to save vault entries to localStorage", error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          setError("Error: Could not save to vault because your browser's storage is full.");
      } else {
          setError("An unexpected error occurred while saving to your vault.");
      }
    }
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.trim() || !newUsername.trim() || !newPassword.trim()) return;

    const newEntry: PasswordEntry = {
      id: Date.now(),
      service: newService.trim(),
      username: newUsername.trim(),
      passwordHash: encode(newPassword.trim()),
    };

    setEntries([...entries, newEntry]);
    setNewService('');
    setNewUsername('');
    setNewPassword('');
    setPasswordStrength(calculatePasswordStrength(''));
    setGeneratedPassword(null);
  };
  
  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleCopyPassword = (id: number) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      navigator.clipboard.writeText(decode(entry.passwordHash));
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }
  };
  
  const generateAndDisplayPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setGeneratedPasswordCopied(false);
  };

  const handleCopyGeneratedPassword = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setGeneratedPasswordCopied(true);
    setTimeout(() => {
      setGeneratedPasswordCopied(false);
    }, 2000);
  };

  const handleUseGeneratedPassword = () => {
    if (!generatedPassword) return;
    setNewPassword(generatedPassword);
    setPasswordStrength(calculatePasswordStrength(generatedPassword));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  return (
    <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20">
      <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6 flex items-center">
        <LockClosedIcon className="h-6 w-6 mr-3 text-light-accent dark:text-dark-accent" />
        Encrypted Password Vault
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="mb-8 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
          <h4 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-light-accent dark:text-dark-accent" />
            Password Generator
          </h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Create a strong password, copy it to update an account, then save it to your vault below.
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex-grow p-3 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md font-mono text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
              {generatedPassword || <span className="opacity-50">Click 'Generate' to start</span>}
            </div>
            <button
              type="button"
              onClick={handleCopyGeneratedPassword}
              disabled={!generatedPassword}
              className="p-3 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Copy Generated Password"
            >
              {generatedPasswordCopied ? <ClipboardCheckIcon className="h-5 w-5 text-status-green" /> : <ClipboardIcon className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={generateAndDisplayPassword}
              className="w-full text-center p-2 border border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent font-semibold rounded-lg hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition-colors"
            >
              Generate New
            </button>
            <button
              type="button"
              onClick={handleUseGeneratedPassword}
              disabled={!generatedPassword}
              className="w-full text-center p-2 border border-transparent bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use This Password
            </button>
          </div>
        </div>


      <form onSubmit={handleAddEntry} className="space-y-4 mb-8">
        <h4 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Add New Vault Entry</h4>
        <input
          type="text"
          value={newService}
          onChange={e => setNewService(e.target.value)}
          placeholder="Service (e.g., Google)"
          className="w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
          required
        />
        <input
          type="text"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
          placeholder="Username / Email"
          className="w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
          required
        />
        <div>
            <input
                type="text"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
                required
            />
            {newPassword.length > 0 && (
                <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-light-text-secondary dark:text-dark-text-secondary">Strength</span>
                        <span className={`font-bold ${
                            passwordStrength.score === 1 ? 'text-status-red' :
                            passwordStrength.score === 2 ? 'text-status-yellow' :
                            passwordStrength.score === 3 ? 'text-status-blue' :
                            passwordStrength.score === 4 ? 'text-status-green' : 'text-light-text-secondary dark:text-dark-text-secondary'
                        }`}>{passwordStrength.label}</span>
                    </div>
                    <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-2 ring-1 ring-inset ring-light-border dark:ring-dark-border">
                        <div className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}></div>
                    </div>
                </div>
            )}
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity text-white font-bold py-3 px-4 rounded-lg">
          Add Entry
        </button>
      </form>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {entries.length === 0 ? (
          <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">Your vault is empty.</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="flex items-center space-x-2 p-3 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
              <div className="flex-grow">
                <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{entry.service}</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{entry.username}</p>
                <p className="text-sm font-mono tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
                  {visiblePasswords[entry.id] ? decode(entry.passwordHash) : '••••••••••••'}
                </p>
              </div>
              <button onClick={() => handleCopyPassword(entry.id)} className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors" title="Copy Password">
                {copiedId === entry.id ? <ClipboardCheckIcon className="h-5 w-5 text-status-green" /> : <ClipboardIcon className="h-5 w-5" />}
              </button>
              <button onClick={() => togglePasswordVisibility(entry.id)} className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors" title="Toggle Visibility">
                {visiblePasswords[entry.id] ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              <button onClick={() => handleDeleteEntry(entry.id)} className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-status-red transition-colors" title="Delete Entry">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PasswordVault;