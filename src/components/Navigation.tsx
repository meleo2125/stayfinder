'use client';

import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import Link from 'next/link';

interface NavigationProps {
  showUserInfo?: boolean;
  showLogout?: boolean;
}

export default function Navigation({ showUserInfo = true, showLogout = true }: NavigationProps) {
  const { user, logout } = useAuth();
  const { blinkProfile } = useNotification();

  return (
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
  );
} 