
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { XCircleIcon } from '../icons/Icons';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity" aria-modal="true" role="dialog">
      <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 w-full max-w-md m-4 transform transition-transform scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Welcome Back</h2>
          <button onClick={onClose} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary">
            <XCircleIcon className="h-7 w-7" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-700 dark:text-red-300 bg-red-500/10 p-3 rounded-lg text-sm">{error}</p>}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="font-semibold text-light-accent dark:text-dark-accent hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;