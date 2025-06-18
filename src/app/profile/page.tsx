'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface Booking {
  _id: string;
  listingId: string | {
    _id: string;
    title: string;
    location: string;
    images: string[];
  };
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchBookings();
  }, [isAuthenticated, router]);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/bookings/user/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatus = (checkInDate: string, status: string) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    
    if (status === 'cancelled') return 'Cancelled';
    if (checkIn < today) return 'Completed';
    return 'Upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'text-blue-600 bg-blue-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const upcomingBookings = bookings.filter(booking => 
    getBookingStatus(booking.checkInDate, booking.status) === 'Upcoming'
  );

  const pastBookings = bookings.filter(booking => 
    getBookingStatus(booking.checkInDate, booking.status) === 'Completed'
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-heading">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and view your bookings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">{new Date().getFullYear()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total bookings:</span>
                    <span className="font-medium">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upcoming stays:</span>
                    <span className="font-medium text-blue-600">{upcomingBookings.length}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">Upcoming Stays</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">No upcoming bookings</p>
                  <Button 
                    variant="primary" 
                    className="mt-4"
                    onClick={() => router.push('/')}
                  >
                    Browse Properties
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {typeof booking.listingId === 'object' && booking.listingId?.title 
                              ? booking.listingId.title 
                              : `Booking #${booking._id.slice(-6)}`}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {typeof booking.listingId === 'object' && booking.listingId?.location 
                              ? booking.listingId.location 
                              : 'Location not available'}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Check-in: {formatDate(booking.checkInDate)}</span>
                            <span>Check-out: {formatDate(booking.checkOutDate)}</span>
                            <span>{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getBookingStatus(booking.checkInDate, booking.status))}`}>
                            {getBookingStatus(booking.checkInDate, booking.status)}
                          </span>
                          <p className="text-lg font-bold text-primary-600 mt-1">${booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Past Bookings */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">Past Stays</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading bookings...</p>
                </div>
              ) : pastBookings.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">No past bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {typeof booking.listingId === 'object' && booking.listingId?.title 
                              ? booking.listingId.title 
                              : `Booking #${booking._id.slice(-6)}`}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {typeof booking.listingId === 'object' && booking.listingId?.location 
                              ? booking.listingId.location 
                              : 'Location not available'}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Check-in: {formatDate(booking.checkInDate)}</span>
                            <span>Check-out: {formatDate(booking.checkOutDate)}</span>
                            <span>{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getBookingStatus(booking.checkInDate, booking.status))}`}>
                            {getBookingStatus(booking.checkInDate, booking.status)}
                          </span>
                          <p className="text-lg font-bold text-primary-600 mt-1">${booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 