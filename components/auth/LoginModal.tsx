
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity" aria-modal="true" role="dialog">
      <div className="bg-neutral-dark border border-neutral-light rounded-2xl shadow-card p-8 w-full max-w-md m-4 transform transition-transform scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Welcome Back</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <XCircleIcon className="h-7 w-7" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-warm-amber bg-warm-amber/10 p-3 rounded-lg text-sm">{error}</p>}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-charcoal-black border border-neutral-light rounded-lg focus:ring-2 focus:ring-electric-purple focus:border-electric-purple focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-charcoal-black border border-neutral-light rounded-lg focus:ring-2 focus:ring-electric-purple focus:border-electric-purple focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-electric-purple hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="font-semibold text-electric-purple hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;