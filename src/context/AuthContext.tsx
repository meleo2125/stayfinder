'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token expiration time (24 hours)
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkTokenExpiration = (timestamp: number) => {
    return Date.now() - timestamp < TOKEN_EXPIRATION;
  };

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user');
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    if (storedUser && loginTimestamp) {
      try {
        const userData = JSON.parse(storedUser);
        const timestamp = parseInt(loginTimestamp);

        if (checkTokenExpiration(timestamp)) {
          setUser(userData);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('loginTimestamp');
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        setError('Session expired. Please login again.');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data and timestamp in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('loginTimestamp', Date.now().toString());
      setUser(data.user);
      router.push('/');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  const logout = () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('loginTimestamp');
      setUser(null);
      setError(null);
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Error during logout. Please try again.');
    }
  };

  // Prevent flash of unauthenticated content
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 