'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function ChangePassword({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const { token } = use(params);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    // Verify token validity
    const verifyToken = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/auth/verify-reset-token/${token}`);
        if (!response.ok) {
          setIsTokenValid(false);
        }
      } catch {
        setIsTokenValid(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess('Password has been reset successfully');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
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
        <div className="max-w-md w-full space-y-8 z-10 relative">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-400 shadow-lg rounded-3xl flex items-center justify-center mb-6 border-4 border-white/60">
              <span className="text-white font-bold text-4xl drop-shadow-lg tracking-wide">S</span>
            </div>
            <h2 className="text-3xl font-extrabold text-error-700 font-heading drop-shadow-sm">
              Invalid or Expired Link
            </h2>
            <p className="mt-2 text-gray-600">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>

          <Card padding="lg" className="shadow-xl border-0 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <Link href="/forgot-password">
                <Button variant="primary" size="lg" className="w-full">
              Request new reset link
                </Button>
            </Link>
          </div>
          </Card>
        </div>
      </div>
    );
  }

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
      <div className="max-w-md w-full space-y-8 z-10 relative">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-400 shadow-lg rounded-3xl flex items-center justify-center mb-6 border-4 border-white/60">
            <span className="text-white font-bold text-4xl drop-shadow-lg tracking-wide">S</span>
          </div>
          <h2 className="text-3xl font-extrabold text-primary-700 font-heading drop-shadow-sm">
            Set new password
          </h2>
          <p className="mt-2 text-gray-600">
            Please enter your new password
          </p>
        </div>

        {/* Change Password Form */}
        <Card padding="lg" className="shadow-xl border-0 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
              <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
              <div className="bg-success-50 border border-success-200 text-success-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}
            
            <div className="space-y-4">
              <Input
                label="New Password"
                name="password"
                type="password"
                required
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                helperText="Must be at least 8 characters"
                leftIcon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                Reset Password
              </Button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Remember your password?</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">support team</a>
          </p>
        </div>
      </div>
    </div>
  );
} 