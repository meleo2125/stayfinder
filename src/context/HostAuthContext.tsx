"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Host {
  id: string;
  username: string;
}

interface HostAuthContextType {
  host: Host | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string, secret: string) => Promise<void>;
  isAuthenticated: boolean;
  error: string | null;
}

const HostAuthContext = createContext<HostAuthContextType | undefined>(undefined);

export function HostAuthProvider({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if host is logged in on initial load
    const storedHost = localStorage.getItem('host');
    if (storedHost) {
      try {
        setHost(JSON.parse(storedHost));
      } catch {
        setHost(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/host/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Host login failed');
      throw new Error(data.message || 'Host login failed');
    }
    localStorage.setItem('host', JSON.stringify(data.host));
    setHost(data.host);
    router.push('/host');
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/host/logout`, { 
      method: 'POST', 
      credentials: 'include' 
    });
    localStorage.removeItem('host');
    setHost(null);
    setError(null);
    router.push('/host');
  };

  const register = async (username: string, password: string, secret: string) => {
    setError(null);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/host/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, secret }),
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Host registration failed');
      throw new Error(data.message || 'Host registration failed');
    }
    localStorage.setItem('host', JSON.stringify(data.host));
    setHost(data.host);
    router.push('/host');
  };

  return (
    <HostAuthContext.Provider value={{ host, loading, login, logout, register, isAuthenticated: !!host, error }}>
      {children}
    </HostAuthContext.Provider>
  );
}

export function useHostAuth() {
  const context = useContext(HostAuthContext);
  if (context === undefined) {
    throw new Error('useHostAuth must be used within a HostAuthProvider');
  }
  return context;
} 