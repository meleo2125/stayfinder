'use client';

import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useAlert } from '@/context/AlertContext';
import { FaEdit } from 'react-icons/fa';

interface Review {
  _id?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | string;
  rating: number;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  reviews: Review[];
  host: {
    _id: string;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  isArchived: boolean;
}

export default function ListingDetail() {
  const { user, isAuthenticated } = useAuth();
  const { triggerProfileBlink } = useNotification();
  const { showAlert } = useAlert();
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDates, setSelectedDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewStars, setReviewStars] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!listingId) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings/${listingId}?includeArchived=true`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listing');
        return res.json();
      })
      .then(data => {
        setListing(data.listing);
        setAverageRating(data.listing.averageRating || 0);
        setReviewCount(data.listing.reviewCount || 0);
        setReviews(data.listing.reviews || []);
        if (user && data.listing.reviews) {
          const found = data.listing.reviews.find((r: Review) => (typeof r.user === 'object' ? r.user._id : r.user) === user.id);
          if (found) {
            setUserReview(found);
            setReviewStars(found.rating);
            setReviewText(found.review || '');
            setEditingReview(false);
          } else {
            setUserReview(null);
            setReviewStars(0);
            setReviewText('');
            setEditingReview(true);
          }
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      });
  }, [isAuthenticated, router, listingId, user]);

  const handleBooking = async () => {
    if (!listing || !selectedDates.checkIn || !selectedDates.checkOut) {
      showAlert('Please select check-in and check-out dates', 'warning');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          listingId,
          checkInDate: selectedDates.checkIn,
          checkOutDate: selectedDates.checkOut,
          numberOfGuests: selectedDates.guests,
          totalPrice: listing.pricePerNight * 
            Math.ceil((new Date(selectedDates.checkOut).getTime() - new Date(selectedDates.checkIn).getTime()) / (1000 * 60 * 60 * 24))
        }),
      });

      if (!response.ok) throw new Error('Failed to create booking');

      triggerProfileBlink();
      showAlert(
        'Booking created successfully! You can view your booking in your profile.', 
        'success', 
        0,
        () => router.push('/profile')
      );
    } catch {
      showAlert('Failed to create booking. Please try again.', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!listing || !selectedDates.checkIn || !selectedDates.checkOut) return 0;
    const nights = Math.ceil(
      (new Date(selectedDates.checkOut).getTime() - new Date(selectedDates.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    return listing.pricePerNight * nights;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewStars) {
      showAlert('Please select a star rating.', 'warning');
      return;
    }
    setReviewLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, rating: reviewStars, review: reviewText })
      });
      if (!response.ok) throw new Error('Failed to submit review');
      const data = await response.json();
      const patchedReviews = data.reviews.map((r: Review) => {
        if ((typeof r.user === 'string' ? r.user : r.user._id) === user?.id) {
          return { ...r, user: { _id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } };
        }
        return r;
      });
      setReviews(patchedReviews);
      setAverageRating(data.averageRating);
      setReviewCount(data.reviewCount);
      setUserReview({ user: { _id: user!.id, firstName: user!.firstName, lastName: user!.lastName, email: user!.email }, rating: reviewStars, review: reviewText });
      setEditingReview(false);
      showAlert('Review submitted!', 'success');
    } catch {
      showAlert('Failed to submit review. Please try again.', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
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
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error || 'Property not found'}</p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show archived message if listing is archived
  if (listing.isArchived) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">This listing has been archived</h2>
            <p className="text-gray-600 mb-6">This property is no longer available for booking. Please browse other properties.</p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => router.push('/')}
            >
              Browse Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button 
                onClick={() => router.push('/')}
                className="hover:text-primary-600 transition-colors"
              >
                Home
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
                      onError={() => {
                        // Fallback handled by CSS
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center">
                      <div className="text-center">
                        <svg className="w-24 h-24 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-primary-600 font-medium">Image not available</p>
                      </div>
                    </div>
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
                              onError={() => {
                                // Fallback handled by CSS
                              }}
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 font-heading">{listing.title}</h1>
                  <p className="text-gray-600">{listing.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span className="text-secondary-500">★</span>
                    <span className="ml-1">{averageRating ? averageRating.toFixed(1) : '0.0'}</span>
                    <span className="ml-1">({reviewCount} review{reviewCount === 1 ? '' : 's'})</span>
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

            {/* Reviews */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">Guest Reviews</h3>
              {isAuthenticated && editingReview && (
                <form onSubmit={handleReviewSubmit} className="mb-6">
                  <div className="flex items-center mb-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        type="button"
                        key={star}
                        className={`text-2xl ${reviewStars >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setReviewStars(star)}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >★</button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{reviewStars ? `${reviewStars} star${reviewStars > 1 ? 's' : ''}` : 'No rating yet'}</span>
                  </div>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                    rows={3}
                    placeholder="Write a review (optional)"
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                  <Button type="submit" variant="primary" disabled={reviewLoading}>
                    {userReview ? 'Update Review' : 'Submit Review'}
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="ml-2" onClick={() => setEditingReview(false)}>
                    Cancel
                  </Button>
                </form>
              )}
              {reviews.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this stay!</div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r, idx) => {
                    const isCurrentUser = isAuthenticated && typeof r.user === 'object' && r.user._id === user?.id;
                    if (isCurrentUser && !editingReview) {
                      // Show highlighted card with edit icon
                      return (
                        <div key={idx} className="border border-primary-200 rounded-lg p-4 bg-primary-50 relative">
                          <div className="flex items-center mb-1">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={`text-lg ${r.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                            ))}
                            <span className="ml-2 font-medium text-gray-900">{typeof r.user === 'object' ? `${r.user.firstName} ${r.user.lastName}` : 'User'}</span>
                            <span className="ml-2 text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</span>
                            <button
                              type="button"
                              className="ml-2 text-primary-600 hover:text-primary-800 p-1 rounded"
                              title="Edit your review"
                              onClick={() => {
                                setEditingReview(true);
                                setReviewStars(r.rating);
                                setReviewText(r.review || '');
                              }}
                            >
                              <FaEdit size={16} />
                            </button>
                          </div>
                          {r.review && <div className="text-gray-700 mt-1">{r.review}</div>}
                        </div>
                      );
                    }
                    if (isCurrentUser && editingReview) {
                      // Don't show the static card while editing
                      return null;
                    }
                    // Other users' reviews
                    return (
                      <div key={idx} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center mb-1">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className={`text-lg ${r.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                          <span className="ml-2 font-medium text-gray-900">{typeof r.user === 'object' ? `${r.user.firstName} ${r.user.lastName}` : 'User'}</span>
                          <span className="ml-2 text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                        {r.review && <div className="text-gray-700 mt-1">{r.review}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">Book your stay</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <Input
                    type="date"
                    value={selectedDates.checkIn}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, checkIn: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <Input
                    type="date"
                    value={selectedDates.checkOut}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, checkOut: e.target.value }))}
                    min={selectedDates.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select
                    value={selectedDates.guests}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {selectedDates.checkIn && selectedDates.checkOut && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>${listing.pricePerNight} × {Math.ceil((new Date(selectedDates.checkOut).getTime() - new Date(selectedDates.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                      <span>${calculateTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${calculateTotalPrice()}</span>
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleBooking}
                  disabled={bookingLoading || !selectedDates.checkIn || !selectedDates.checkOut}
                >
                  {bookingLoading ? 'Booking...' : 'Book Now'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 