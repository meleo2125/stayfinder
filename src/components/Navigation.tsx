'use client';

import { useAuth } from '@/context/AuthContext';
import { useNotification, useNotificationFeed } from '@/context/NotificationContext';
import Link from 'next/link';
import NotificationTile from './NotificationTile';

interface NavigationProps {
  showUserInfo?: boolean;
  showLogout?: boolean;
}

export default function Navigation({ showUserInfo = true, showLogout = true }: NavigationProps) {
  const { user, logout } = useAuth();
  const { blinkProfile } = useNotification();
  const { unseenCount, open, setOpen } = useNotificationFeed();

  function NotificationBell() {
    return (
      <button className="relative ml-4" aria-label="Notifications" onClick={() => setOpen(!open)}>
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unseenCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        )}
      </button>
    );
  }

  return (
    <div className="relative z-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 font-heading">StayFinder</h1>
              </Link>
            </div>
            
            {showUserInfo && user && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-gray-600 text-sm">
                    Welcome back, <span className="font-medium text-gray-900">{user.firstName}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Link 
                      href="/profile" 
                      className={`btn btn-outline transition-all duration-300 ${
                        blinkProfile ? 'animate-blink bg-primary-100 border-primary-300 text-primary-700' : ''
                      }`}
                    >
                      Profile
                    </Link>
                    {blinkProfile && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        View your booking here!
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary-600"></div>
                      </div>
                    )}
                  </div>
                  <NotificationBell />
                  {showLogout && (
                    <button
                      onClick={logout}
                      className="btn btn-outline"
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