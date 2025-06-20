'use client';

import { useAuth } from '@/context/AuthContext';
import { useNotification, useNotificationFeed } from '@/context/NotificationContext';
import Link from 'next/link';
import NotificationTile from './NotificationTile';
import React from 'react';

interface NavigationProps {
  showUserInfo?: boolean;
  showLogout?: boolean;
}

export default function Navigation({ showUserInfo = true, showLogout = true }: NavigationProps) {
  const { user, logout } = useAuth();
  const { blinkProfile } = useNotification();
  const { unseenCount, open, setOpen } = useNotificationFeed();

  return (
    <div className="relative z-50">
      <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-lg tracking-wide">S</span>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 font-heading tracking-tight group-hover:text-primary-600 transition-colors">StayFinder</span>
            </Link>
            
            {showUserInfo && user && (
              <div className="flex items-center gap-6">
                <span className="hidden md:inline text-gray-500 text-base font-medium">
                  Welcome back, <span className="text-gray-900 font-semibold">{user.firstName}</span>
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-11 h-11 flex items-center justify-center relative cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    aria-label="Notifications"
                    onClick={() => setOpen(!open)}
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unseenCount > 0 && (
                      <span className="absolute top-2 right-3 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                    )}
                  </div>
                  <div className="relative">
                    <Link
                      href="/profile"
                      className={`w-28 h-11 flex items-center justify-center text-center px-4 py-2 rounded-lg border border-primary-500 font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-200 shadow-sm ${blinkProfile ? 'animate-blink border-2 border-primary-400' : ''}`}
                    >
                      Profile
                    </Link>
                    {blinkProfile && (
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-10">
                        View your booking here!
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary-600"></div>
                      </div>
                    )}
                  </div>
                  {showLogout && (
                    <button
                      onClick={logout}
                      className="w-28 h-11 flex items-center justify-center text-center px-4 py-2 rounded-lg border border-gray-300 font-semibold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200 shadow-sm"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="absolute left-0 right-0">
        <NotificationTile />
      </div>
    </div>
  );
} 