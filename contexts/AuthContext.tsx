import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, pass: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AUTH_STORAGE_KEY = 'scamshield-auth-user';
// In a real app, this would be an API call, not a mutable constant.
let usersDB: User[] = [...MOCK_USERS]; 

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (foundUser && foundUser.password === pass) {
          // Exclude password from the user object that is stored in state and localStorage
          const { password, ...userToStore } = foundUser;
          setUser(userToStore);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToStore));
          setLoading(false);
          resolve();
        } else {
          setError('Invalid email or password.');
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000); // Simulate network delay
    });
  };

  const signup = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (usersDB.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          setError('An account with this email already exists.');
          setLoading(false);
          reject(new Error('Email already in use'));
          return;
        }

        const newUser: User = {
          id: Date.now(),
          email,
          role: 'user',
          password: pass, // Store the password
        };
        usersDB.push(newUser); // Add to our mock DB
        
        // Exclude password from the user object that is stored in state and localStorage
        const { password, ...userToStore } = newUser;
        setUser(userToStore);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToStore));
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = { user, loading, error, login, logout, signup };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};