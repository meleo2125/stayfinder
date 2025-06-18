'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';

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
  rating: number;
  reviews: number;
  host: {
    _id: string;
    name: string;
    profileImage: string;
  };
  createdAt: string;
}

interface ListingForm {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
}

export default function HostPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [listingForm, setListingForm] = useState<ListingForm>({
    title: '',
    description: '',
    location: '',
    pricePerNight: 0,
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    amenities: [],
    images: []
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin') {
      setIsAuthenticated(true);
      fetchListings();
    } else {
      alert('Invalid credentials. Use admin/admin');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowCreateForm(false);
    setEditingListing(null);
    setLoginForm({ username: '', password: '' });
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings`);
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listingForm.title || !listingForm.description || !listingForm.location || listingForm.pricePerNight <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const method = editingListing ? 'PUT' : 'POST';
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const url = editingListing ? `${baseUrl}/api/listings/${editingListing._id}` : `${baseUrl}/api/listings`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...listingForm,
          host: {
            _id: 'admin',
            name: 'Admin',
            profileImage: ''
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to save listing');

      alert(editingListing ? 'Listing updated successfully!' : 'Listing created successfully!');
      setShowCreateForm(false);
      setEditingListing(null);
      resetForm();
      fetchListings();
    } catch (error) {
      alert('Failed to save listing. Please try again.');
    }
  };

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setListingForm({
      title: listing.title,
      description: listing.description,
      location: listing.location,
      pricePerNight: listing.pricePerNight,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      maxGuests: listing.maxGuests,
      amenities: listing.amenities,
      images: listing.images
    });
    setShowCreateForm(true);
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete listing');

      alert('Listing deleted successfully!');
      fetchListings();
    } catch (error) {
      alert('Failed to delete listing. Please try again.');
    }
  };

  const resetForm = () => {
    setListingForm({
      title: '',
      description: '',
      location: '',
      pricePerNight: 0,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      amenities: [],
      images: []
    });
    setNewAmenity('');
    setNewImage('');
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !listingForm.amenities.includes(newAmenity.trim())) {
      setListingForm(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setListingForm(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !listingForm.images.includes(newImage.trim())) {
      setListingForm(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setListingForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple header without Navigation component */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 font-heading">StayFinder Host</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Host Dashboard</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/')}
                >
                  Back to Site
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto py-12 px-4">
          <Card>
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center font-heading">Host Login</h1>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Access the host dashboard to manage property listings
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <Input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Login to Host Dashboard
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Use admin/admin to login
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header without Navigation component */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 font-heading">StayFinder Host</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Logged in as Admin</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
              >
                View Site
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading">Host Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your property listings</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setShowCreateForm(true);
              setEditingListing(null);
              resetForm();
            }}
          >
            Add New Listing
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-heading">
              {editingListing ? 'Edit Listing' : 'Create New Listing'}
            </h2>
            <form onSubmit={handleSubmitListing} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <Input
                    value={listingForm.title}
                    onChange={(e) => setListingForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Property title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <Input
                    value={listingForm.location}
                    onChange={(e) => setListingForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night *</label>
                  <Input
                    type="number"
                    value={listingForm.pricePerNight}
                    onChange={(e) => setListingForm(prev => ({ ...prev, pricePerNight: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <Input
                    type="number"
                    value={listingForm.bedrooms}
                    onChange={(e) => setListingForm(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 1 }))}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <Input
                    type="number"
                    value={listingForm.bathrooms}
                    onChange={(e) => setListingForm(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 1 }))}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
                  <Input
                    type="number"
                    value={listingForm.maxGuests}
                    onChange={(e) => setListingForm(prev => ({ ...prev, maxGuests: parseInt(e.target.value) || 1 }))}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={listingForm.description}
                  onChange={(e) => setListingForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your property..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={4}
                  required
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" variant="outline" onClick={addAmenity}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {listingForm.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Add image URL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  />
                  <Button type="button" variant="outline" onClick={addImage}>
                    Add
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listingForm.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUMxMDkuNDU2IDgxIDExOCA4OS41NDQgMTE4IDEwMEMxMTggMTEwLjQ1NiAxMDkuNDU2IDExOSA5OSAxMTlDOC41NDQgMTE5IDgwIDExMC40NTYgODAgMTAwWiIgZmlsbD0iI0QxRDVEM0EiLz4KPHBhdGggZD0iTTE2MCAxMjBIMTQwVjEwMEgxNjBWMTIwWiIgZmlsbD0iI0QxRDVEM0EiLz4KPHBhdGggZD0iTTQwIDEyMEg2MFYxMDBINDBWMTIwWiIgZmlsbD0iI0QxRDVEM0EiLz4KPC9zdmc+';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary">
                  {editingListing ? 'Update Listing' : 'Create Listing'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingListing(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Listings Table */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-heading">Your Listings</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No listings found. Create your first listing!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                            <div className="text-sm text-gray-500">{listing.bedrooms} bed, {listing.bathrooms} bath</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {listing.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${listing.pricePerNight}/night
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-secondary-500">★</span>
                          <span className="ml-1 text-sm text-gray-900">{listing.rating || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditListing(listing)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/listings/${listing._id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteListing(listing._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
} 