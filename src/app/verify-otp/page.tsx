'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/register');
    } else {
      setUserId(storedUserId);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      localStorage.removeItem('userId');
      router.push('/login');
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
      <div className="max-w-md w-full space-y-8 z-10 relative">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-400 shadow-lg rounded-3xl flex items-center justify-center mb-6 border-4 border-white/60">
            <span className="text-white font-bold text-4xl drop-shadow-lg tracking-wide">S</span>
          </div>
          <h2 className="text-3xl font-extrabold text-primary-700 font-heading drop-shadow-sm">
            Verify your email
          </h2>
          <p className="mt-2 text-gray-600">
            Please enter the 6-digit code sent to your email
          </p>
        </div>

        {/* OTP Verification Form */}
        <Card padding="lg" className="shadow-xl border-0 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
              <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
            
            <div className="space-y-4">
              <Input
                label="Verification Code"
              name="otp"
              type="text"
              required
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                helperText="Check your email for the verification code"
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
                Verify Email
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 space-y-4">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-primary-800">
                  <p className="font-medium">Didn&apos;t receive the code?</p>
                  <p className="mt-1">Check your spam folder or contact support if you continue to have issues.</p>
                </div>
              </div>
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