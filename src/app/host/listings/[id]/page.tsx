"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Card from '@/components/Card';
import { HostAuthProvider, useHostAuth } from '@/context/HostAuthContext';
import HostNavigation from '@/components/HostNavigation';

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
  averageRating: number;
  reviewCount: number;
  reviews?: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    rating: number;
    review?: string;
    createdAt: string;
  }>;
  host: {
    _id: string;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  isArchived?: boolean;
  archivedAt?: string;
}

function HostListingDetailPage() {
  const { isAuthenticated, loading: authLoading } = useHostAuth();
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!listingId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings/${listingId}?includeArchived=true`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listing');
        return res.json();
      })
      .then(data => {
        setListing(data.listing);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [listingId]);

  if (authLoading) return null;
  if (!isAuthenticated) {
    router.push('/host');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HostNavigation />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HostNavigation />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error || 'Property not found'}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded"
              onClick={() => router.push('/host')}
            >
              Back to Host Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HostNavigation />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button 
                onClick={() => router.push('/host')}
                className="hover:text-primary-600 transition-colors"
              >
                Host Dashboard
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">{listing.title}</li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              {listing.images && listing.images.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div className="h-96 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      width={800}
                      height={384}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Additional Images Grid */}
                  {listing.images.length > 1 && (
                    <div className="p-4 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">More photos</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {listing.images.slice(1).map((image, index) => (
                          <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`${listing.title} ${index + 2}`}
                              width={150}
                              height={150}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-primary-600 font-medium">No images available</p>
                    <p className="text-primary-500 text-sm">Images will be displayed here when added</p>
                  </div>
                </div>
              )}
            </Card>
            {/* Property Details */}
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 font-heading">{listing.title}</h1>
                    {listing.isArchived && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{listing.location}</p>
                  {listing.isArchived && listing.archivedAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Archived on {new Date(listing.archivedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span className="text-secondary-500">★</span>
                    <span className="ml-1">{listing.averageRating ? listing.averageRating.toFixed(1) : '0.0'}</span>
                    <span className="ml-1">({listing.reviewCount} review{listing.reviewCount === 1 ? '' : 's'})</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-600">${listing.pricePerNight}/night</p>
                </div>
              </div>
              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{listing.bedrooms}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{listing.bathrooms}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{listing.maxGuests}</p>
                  <p className="text-sm text-gray-600">Max Guests</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">${listing.pricePerNight}</p>
                  <p className="text-sm text-gray-600">Per Night</p>
                </div>
              </div>
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">About this place</h3>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>
              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Host Information */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">Hosted by {listing.host?.name || 'Anonymous'}</h3>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{listing.host?.name || 'Anonymous'}</p>
                  <p className="text-gray-600 text-sm">Member since {new Date(listing.createdAt).getFullYear()}</p>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 font-heading">Guest Reviews</h3>
                <div className="flex items-center">
                  <span className="text-secondary-500 text-lg">★</span>
                  <span className="ml-1 text-lg font-semibold text-gray-900">
                    {listing.averageRating ? listing.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="ml-1 text-gray-600">
                    ({listing.reviewCount} review{listing.reviewCount === 1 ? '' : 's'})
                  </span>
                </div>
              </div>

              {listing.reviews && listing.reviews.length > 0 ? (
                <div className="space-y-6">
                  {listing.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-semibold text-sm">
                              {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.user.firstName} {review.user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-secondary-500">★</span>
                          <span className="ml-1 font-semibold text-gray-900">{review.rating}</span>
                        </div>
                      </div>
                      {review.review && (
                        <p className="text-gray-700 leading-relaxed">{review.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500 font-medium">No reviews yet</p>
                  <p className="text-gray-400 text-sm">Reviews from guests will appear here</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <HostAuthProvider>
      <HostListingDetailPage />
    </HostAuthProvider>
  );
} 