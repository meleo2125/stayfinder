'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface Listing {
  _id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  averageRating?: number;
  reviewCount?: number;
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Filter listings by title, location, or description
  const filteredListings = useMemo(() => search.trim()
    ? listings.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.location.toLowerCase().includes(search.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(search.toLowerCase()))
      ).slice(0, 6)
    : [], [search, listings]);

  // Hide results on click outside
  useEffect(() => {
    if (!showResults) return;
    function handleClick() { setShowResults(false); }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showResults]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listings');
        return res.json();
      })
      .then(data => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation listings={listings} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
            Welcome to StayFinder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing properties and find your perfect stay for your next adventure
          </p>
        </div>
        {/* Live Search Bar Below Welcome Message */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="w-full h-11 pl-4 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 shadow-sm text-base"
              placeholder="Search by name, location, etc..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true); }}
              onFocus={() => search && setShowResults(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' && search.trim()) {
                  setShowResults(false);
                  router.push(`/search?query=${encodeURIComponent(search.trim())}`);
                  setSearch('');
                }
              }}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                if (search.trim()) {
                  setShowResults(false);
                  router.push(`/search?query=${encodeURIComponent(search.trim())}`);
                  setSearch('');
                }
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </span>
            {/* Floating Results Tile */}
            {showResults && filteredListings.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto animate-fade-in">
                {filteredListings.map(listing => (
                  <div
                    key={listing._id}
                    className="px-4 py-3 cursor-pointer hover:bg-primary-50 border-b last:border-b-0 border-gray-100 flex flex-col"
                    onClick={e => {
                      e.stopPropagation();
                      setShowResults(false);
                      setSearch('');
                      router.push(`/listings/${listing._id}`);
                    }}
                  >
                    <span className="font-semibold text-gray-900">{listing.title}</span>
                    <span className="text-sm text-gray-500">{listing.location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <Card className="slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Now</p>
                <p className="text-2xl font-bold text-gray-900">892</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Rated</p>
                <p className="text-2xl font-bold text-gray-900">4.8★</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Featured Section */}
        <Card padding="lg" className="mb-8 slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 font-heading">Featured Properties</h3>
            <Button variant="primary">
              View All
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading properties...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-2">No properties available</p>
                <p className="text-gray-600">Properties will appear here once they are added through the host dashboard.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div 
                  key={listing._id} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
                  onClick={() => router.push(`/listings/${listing._id}`)}
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover"
                        onError={() => {
                          // Fallback handled by CSS
                        }}
                      />
                    ) : null}
                    <div className={`flex items-center justify-center ${listing.images && listing.images.length > 0 ? 'hidden' : 'flex'}`}>
                      <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{listing.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{listing.location} • {listing.maxGuests} guests • {listing.bedrooms} bedrooms</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary-600">${listing.pricePerNight}/night</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="text-secondary-500">★</span>
                        <span className="ml-1">{listing.averageRating ? listing.averageRating.toFixed(1) : '0.0'}</span>
                        <span className="ml-1">({listing.reviewCount} review{listing.reviewCount === 1 ? '' : 's'})</span>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/listings/${listing._id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}