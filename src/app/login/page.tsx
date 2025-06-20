'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Login() {
  const { login, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-200/30 via-secondary-200/30 to-accent-200/30 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-200/30 via-transparent to-transparent" />
      </div>
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#0f766e_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid-move" />
      </div>
      {/* Floating Blobs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-primary-300/30 to-secondary-400/30 rounded-full blur-xl animate-float" />
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-accent-300/30 to-accent-500/30 rounded-full blur-xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-lg animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-gradient-to-br from-accent-200/30 to-primary-400/30 rounded-full blur-lg animate-float" />
      {/* Glowing Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-accent-400/20 to-primary-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-gradient-to-r from-secondary-400/20 to-accent-400/20 rounded-full blur-3xl animate-pulse" />
      {/* Dynamic Light Rays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary-400/50 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent-400/50 to-transparent animate-pulse delay-1000" />
        <div className="absolute top-1/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent animate-pulse delay-2000" />
      </div>
      {/* Particle Effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
      {/* Main Content */}
      <div className="max-w-md w-full space-y-8 z-10 relative">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-400 shadow-lg rounded-3xl flex items-center justify-center mb-6 border-4 border-white/60">
            <span className="text-white font-bold text-4xl drop-shadow-lg tracking-wide">S</span>
          </div>
          <h2 className="text-3xl font-extrabold text-primary-700 font-heading drop-shadow-sm">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your <span className="text-primary-600 font-semibold">StayFinder</span> account
          </p>
        </div>

        {/* Login Form */}
        <Card padding="lg" className="shadow-xl border-0 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
          {(error || authError) && (
              <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-lg text-sm">
              {error || authError}
            </div>
          )}
            
            <div className="space-y-4">
              <Input
                label="Email address"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
          </div>

          <div>
              <Button
              type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                Sign in
              </Button>
          </div>
        </form>

          {/* Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
            Forgot your password?
          </Link>
        </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to StayFinder?</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full">
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
          </p>
          <div className="mt-4">
            <Link 
              href="/host" 
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Login as Host
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 