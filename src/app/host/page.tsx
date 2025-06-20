'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHostAuth } from '@/context/HostAuthContext';
import { useAlert } from '@/context/AlertContext';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import HostNavigation from '@/components/HostNavigation';
import Image from 'next/image';

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
  isArchived?: boolean;
  archivedAt?: string;
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

interface Booking {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

interface ArchiveListingModalProps {
  open: boolean;
  onClose: () => void;
  bookings: Booking[];
  onArchive: (choice: 'allow' | 'cancel', reason?: string) => Promise<void>;
}

function ArchiveListingModal({ open, onClose, bookings, onArchive }: ArchiveListingModalProps) {
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState<'allow' | 'cancel'>('allow');
  const [reason, setReason] = useState('');
  if (!open) return null;
  const futureBookings = bookings.filter((b: Booking) => new Date(b.checkInDate) > new Date() && b.status === 'confirmed');
  const pastBookings = bookings.filter((b: Booking) => new Date(b.checkInDate) <= new Date());
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-lg" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl shadow-xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Archive Listing</h2>
        <p className="mb-4 text-gray-700">This listing has {futureBookings.length} future and {pastBookings.length} past bookings.</p>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Future Bookings</h3>
          {futureBookings.length === 0 ? <p className="text-gray-500 text-sm">None</p> : (
            <ul className="max-h-32 overflow-y-auto text-sm">
              {futureBookings.map((b: Booking) => (
                <li key={b._id} className="mb-1">
                  <span className="font-medium">{typeof b.userId === 'object' ? `${b.userId.firstName} ${b.userId.lastName}` : b.userId}</span>:
                  {` ${new Date(b.checkInDate).toLocaleDateString()} - ${new Date(b.checkOutDate).toLocaleDateString()} `}
                  <span className="text-xs text-gray-500">({b.status})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Past Bookings</h3>
          {pastBookings.length === 0 ? <p className="text-gray-500 text-sm">None</p> : (
            <ul className="max-h-32 overflow-y-auto text-sm">
              {pastBookings.map((b: Booking) => (
                <li key={b._id} className="mb-1">
                  <span className="font-medium">{typeof b.userId === 'object' ? `${b.userId.firstName} ${b.userId.lastName}` : b.userId}</span>:
                  {` ${new Date(b.checkInDate).toLocaleDateString()} - ${new Date(b.checkOutDate).toLocaleDateString()} `}
                  <span className="text-xs text-gray-500">({b.status})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-6">
          <label className="block font-medium mb-2">What do you want to do with future bookings?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" checked={choice === 'allow'} onChange={() => setChoice('allow')} />
              Allow guests to stay (no new bookings allowed)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={choice === 'cancel'} onChange={() => setChoice('cancel')} />
              Cancel all future bookings
            </label>
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-medium mb-2">Reason for archiving (optional, shown to guests if bookings are cancelled):</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 min-h-[60px] focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="E.g. Renovation, personal emergency, etc."
          />
        </div>
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" isLoading={loading} onClick={async () => {
            setLoading(true);
            await onArchive(choice, reason);
            setLoading(false);
          }}>Archive Listing</Button>
        </div>
      </div>
    </div>
  );
}

function HostDashboard() {
  const { host, isAuthenticated, loading } = useHostAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  
  const [listingForm, setListingForm] = useState<ListingForm>({
    title: '',
    description: '',
    location: '',
    pricePerNight: 0,
    bedrooms: 0,
    bathrooms: 0,
    maxGuests: 0,
    amenities: [],
    images: []
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newImage, setNewImage] = useState('');

  const { showAlert } = useAlert();

  const [archiveModal, setArchiveModal] = useState<{ open: boolean, listing: Listing | null, bookings: Booking[] }>({ open: false, listing: null, bookings: [] });

  const fetchListings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings?includeArchived=true`);
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchListings();
    }
  }, [isAuthenticated]);

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listingForm.title || !listingForm.description || !listingForm.location || listingForm.pricePerNight <= 0) {
      showAlert('Please fill in all required fields', 'warning');
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
            _id: host?.id || 'admin',
            name: host?.username || 'Admin',
            profileImage: ''
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to save listing');

      showAlert(editingListing ? 'Listing updated successfully!' : 'Listing created successfully!', 'success');
      setShowCreateForm(false);
      setEditingListing(null);
      resetForm();
      fetchListings();
    } catch {
      showAlert('Failed to save listing. Please try again.', 'error');
    }
  };

  const handleEditListing = (editListing: Listing) => {
    if (editListing.isArchived) {
      showAlert('Cannot edit archived listings. Please unarchive first.', 'warning');
      return;
    }
    setEditingListing(editListing);
    setListingForm({
      title: editListing.title,
      description: editListing.description,
      location: editListing.location,
      pricePerNight: editListing.pricePerNight,
      bedrooms: editListing.bedrooms,
      bathrooms: editListing.bathrooms,
      maxGuests: editListing.maxGuests,
      amenities: editListing.amenities,
      images: editListing.images
    });
    setShowCreateForm(true);
  };

  const handleDeleteListing = async (id: string) => {
    // Fetch bookings for this listing
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/bookings/listing/${id}`);
      const data = await res.json();
      setArchiveModal({ open: true, listing: listings.find(l => l._id === id) || null, bookings: data.bookings || [] });
    } catch {
      showAlert('Failed to fetch bookings for this listing.', 'error');
    }
  };

  const handleArchive = async (choice: 'allow' | 'cancel', reason?: string) => {
    if (!archiveModal.listing) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings/${archiveModal.listing._id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowStays: choice === 'allow', reason }),
      });
      if (!res.ok) throw new Error('Failed to archive listing');
      showAlert('Listing archived successfully!', 'success');
      setArchiveModal({ open: false, listing: null, bookings: [] });
      fetchListings();
    } catch {
      showAlert('Failed to archive listing. Please try again.', 'error');
    }
  };

  const handleUnarchiveListing = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings/${id}/unarchive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to unarchive listing');
      showAlert('Listing unarchived successfully!', 'success');
      fetchListings();
    } catch {
      showAlert('Failed to unarchive listing. Please try again.', 'error');
    }
  };

  const resetForm = () => {
    setListingForm({
      title: '',
      description: '',
      location: '',
      pricePerNight: 0,
      bedrooms: 0,
      bathrooms: 0,
      maxGuests: 0,
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

  if (loading) return null;
  if (!isAuthenticated) {
    router.push('/host');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HostNavigation />
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
            <h2 className="text-xl font-semibold mb-4">
              {editingListing ? 'Edit Listing' : 'Create New Listing'}
            </h2>
            <form onSubmit={handleSubmitListing} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Title"
                  value={listingForm.title}
                  onChange={(e) => setListingForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter listing title"
                  required
                />
                <Input
                  label="Location"
                  value={listingForm.location}
                  onChange={(e) => setListingForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                  required
                />
                <Input
                  label="Price per Night"
                  type="number"
                  value={listingForm.pricePerNight || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setListingForm(prev => ({ 
                      ...prev, 
                      pricePerNight: value === '' ? 0 : Number(value) 
                    }));
                  }}
                  placeholder="Enter price"
                  required
                />
                <Input
                  label="Bedrooms"
                  type="number"
                  value={listingForm.bedrooms || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setListingForm(prev => ({ 
                      ...prev, 
                      bedrooms: value === '' ? 0 : Number(value) 
                    }));
                  }}
                  placeholder="Number of bedrooms"
                  required
                />
                <Input
                  label="Bathrooms"
                  type="number"
                  value={listingForm.bathrooms || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setListingForm(prev => ({ 
                      ...prev, 
                      bathrooms: value === '' ? 0 : Number(value) 
                    }));
                  }}
                  placeholder="Number of bathrooms"
                  required
                />
                <Input
                  label="Max Guests"
                  type="number"
                  value={listingForm.maxGuests || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setListingForm(prev => ({ 
                      ...prev, 
                      maxGuests: value === '' ? 0 : Number(value) 
                    }));
                  }}
                  placeholder="Maximum guests"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={listingForm.description}
                  onChange={(e) => setListingForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Enter detailed description"
                  required
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity} variant="outline">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Images (URLs)</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Add image URL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  />
                  <Button type="button" onClick={addImage} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {listingForm.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Listing ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        width={96}
                        height={160}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
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
          <h2 className="text-xl font-semibold mb-6">Your Listings</h2>
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
                {listings.map((row) => (
                  <tr key={row._id} className={`hover:bg-gray-50 ${row.isArchived ? 'bg-gray-100' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {row.title}
                            {row.isArchived && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Archived
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{row.bedrooms} bed, {row.bathrooms} bath</div>
                          {row.isArchived && row.archivedAt && (
                            <div className="text-xs text-gray-400">
                              Archived on {new Date(row.archivedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${row.pricePerNight}/night
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-secondary-500">★</span>
                        <span className="ml-1 text-sm text-gray-900">{row.averageRating ? row.averageRating.toFixed(1) : '0.0'}</span>
                        <span className="ml-1 text-xs text-gray-500">({row.reviewCount} review{row.reviewCount === 1 ? '' : 's'})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/host/listings/${row._id}`)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </button>
                        {!row.isArchived ? (
                          <>
                            <button
                              onClick={() => handleEditListing(row)}
                              className="text-secondary-600 hover:text-secondary-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteListing(row._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUnarchiveListing(row._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Unarchive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {listings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No listings found. Create your first listing to get started!</p>
              </div>
            )}
          </div>
        </Card>

        <ArchiveListingModal
          open={archiveModal.open}
          onClose={() => setArchiveModal({ open: false, listing: null, bookings: [] })}
          bookings={archiveModal.bookings}
          onArchive={handleArchive}
        />
      </main>
    </div>
  );
}

function HostLogin() {
  const { login: hostLogin, register: hostRegister, error: hostError } = useHostAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    secret: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await hostLogin(formData.username, formData.password);
      } else {
        await hostRegister(formData.username, formData.password, formData.secret);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background effects similar to user login but with host colors */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-100 via-accent-100 to-primary-100 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-200/30 via-accent-200/30 to-primary-200/30 animate-pulse" />
      </div>
      
      <div className="max-w-md w-full space-y-8 z-10 relative">
        {/* Mode Switcher */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l-lg font-medium border ${mode === 'login' ? 'bg-secondary-600 text-white' : 'bg-white text-secondary-700 border-secondary-200'}`}
            onClick={() => setMode('login')}
            type="button"
          >
            Host Login
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg font-medium border-l-0 border ${mode === 'register' ? 'bg-secondary-600 text-white' : 'bg-white text-secondary-700 border-secondary-200'}`}
            onClick={() => setMode('register')}
            type="button"
          >
            Host Register
          </button>
        </div>

        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary-500 via-secondary-400 to-accent-400 shadow-lg rounded-3xl flex items-center justify-center mb-6 border-4 border-white/60">
            <span className="text-white font-bold text-4xl drop-shadow-lg tracking-wide">H</span>
          </div>
          <h2 className="text-3xl font-extrabold text-secondary-700 font-heading drop-shadow-sm">
            {mode === 'login' ? 'Welcome back, Host' : 'Join as Host'}
          </h2>
          <p className="mt-2 text-gray-600">
            {mode === 'login' ? 'Sign in to your host dashboard' : 'Register to start managing properties'}
          </p>
        </div>

        {/* Form */}
        <Card padding="lg" className="shadow-xl border-0 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(error || hostError) && (
              <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-lg text-sm">
                {error || hostError}
              </div>
            )}
            
            <div className="space-y-4">
              <Input
                label="Host Username"
                name="username"
                type="text"
                required
                placeholder="Enter your host username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              {mode === 'register' && (
                <Input
                  label="Host Secret Key"
                  name="secret"
                  type="password"
                  required
                  placeholder="Enter the host secret key"
                  value={formData.secret}
                  onChange={handleChange}
                  disabled={isLoading}
                  helperText="Ask the StayFinder team for the host registration key."
                />
              )}
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {mode === 'login' ? 'Sign in as Host' : 'Register as Host'}
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
                <span className="px-2 bg-white text-gray-500">Back to user area</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  Go to StayFinder
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Host access is restricted. Contact StayFinder for registration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HostPageWrapper() {
  const { isAuthenticated, loading } = useHostAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <HostDashboard /> : <HostLogin />;
} 