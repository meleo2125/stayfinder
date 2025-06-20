"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Button from "@/components/Button";

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("");

  // Get all unique amenities from listings
  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    listings.forEach(l => l.amenities?.forEach(a => set.add(a)));
    return Array.from(set).sort();
  }, [listings]);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/listings`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch listings");
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
  }, []);

  // Filter listings by query and filters
  const filtered = useMemo(() => {
    let result = listings;
    // Query filter
    if (query.trim()) {
      result = result.filter(l =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.location.toLowerCase().includes(query.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    // Price filter
    if (priceMin) {
      result = result.filter(l => l.pricePerNight >= Number(priceMin));
    }
    if (priceMax) {
      result = result.filter(l => l.pricePerNight <= Number(priceMax));
    }
    // Bedrooms filter
    if (minBedrooms) {
      result = result.filter(l => l.bedrooms >= Number(minBedrooms));
    }
    // Amenities filter
    if (selectedAmenities.length > 0) {
      result = result.filter(l =>
        selectedAmenities.every(a => l.amenities && l.amenities.includes(a))
      );
    }
    // Sorting
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "rating-desc") {
      result = [...result].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (sortBy === "rating-asc") {
      result = [...result].sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
    }
    return result;
  }, [listings, query, priceMin, priceMax, minBedrooms, selectedAmenities, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 font-heading mb-2">Search Results</h2>
          <p className="text-gray-600 text-lg">Showing results for: <span className="font-semibold text-primary-600">{query}</span></p>
        </div>
        {/* Filtering and Sorting UI */}
        <div className="mb-6 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-gray-200">
          {/* Price Range */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm">Price:</label>
            <input type="number" min="0" placeholder="Min" className="w-20 px-2 py-1 border rounded" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
            <span className="text-gray-400">-</span>
            <input type="number" min="0" placeholder="Max" className="w-20 px-2 py-1 border rounded" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
          </div>
          {/* Bedrooms */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm">Bedrooms:</label>
            <input type="number" min="0" placeholder="Min" className="w-16 px-2 py-1 border rounded" value={minBedrooms} onChange={e => setMinBedrooms(e.target.value)} />
          </div>
          {/* Amenities */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm">Amenities:</label>
            <div className="flex flex-wrap gap-2 max-w-xs overflow-auto">
              {allAmenities.map(a => (
                <label key={a} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={e => {
                      setSelectedAmenities(prev =>
                        e.target.checked ? [...prev, a] : prev.filter(x => x !== a)
                      );
                    }}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm">Sort by:</label>
            <select className="px-2 py-1 border rounded" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading properties...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No properties found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(listing => (
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
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
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
                    onClick={e => {
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
      </main>
    </div>
  );
} 