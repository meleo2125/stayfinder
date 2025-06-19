const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

// GET /listings - get all listings (with optional filters)
exports.getAllListings = async (req, res) => {
  try {
    const { includeArchived } = req.query;

    // Build query - exclude archived listings by default unless specifically requested
    const query =
      includeArchived === "true" ? {} : { isArchived: { $ne: true } };

    // Fetch listings from database
    const listings = await Listing.find(query);
    const listingsWithRatings = listings.map((l) => ({
      ...l.toObject(),
      averageRating: l.averageRating,
      reviewCount: l.reviewCount,
    }));
    return res.json({ listings: listingsWithRatings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// GET /listings/:id - get single listing by id
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeArchived } = req.query;

    const listing = await Listing.findById(id).populate(
      "reviews.user",
      "firstName lastName email"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Prevent access to archived listings unless specifically requested
    if (listing.isArchived && includeArchived !== "true") {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.json({
      listing: {
        ...listing.toObject(),
        averageRating: listing.averageRating,
        reviewCount: listing.reviewCount,
      },
    });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return res.status(500).json({ message: "Failed to fetch listing" });
  }
};

// POST /listings - create a new listing
exports.createListing = async (req, res) => {
  try {
    const listingData = req.body;

    // Basic validation
    if (
      !listingData.title ||
      !listingData.description ||
      !listingData.location ||
      !listingData.pricePerNight
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new listing in database
    const newListing = new Listing(listingData);
    await newListing.save();

    return res.status(201).json({
      message: "Listing created successfully",
      listing: newListing,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.status(500).json({ message: "Failed to create listing" });
  }
};

// PUT /listings/:id - update a listing
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.isArchived) {
      return res.status(400).json({
        message: "Cannot update archived listings. Please unarchive first.",
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    return res.status(500).json({ message: "Failed to update listing" });
  }
};

// DELETE /listings/:id - delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return res.status(500).json({ message: "Failed to delete listing" });
  }
};

// POST /listings/:id/reviews - create or update a review for a listing
exports.createOrUpdateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, review } = req.body;
    if (!userId || !rating) {
      return res.status(400).json({ message: "User and rating are required" });
    }
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (!Array.isArray(listing.reviews)) {
      listing.reviews = [];
    }
    // Check if user already reviewed
    const existing = listing.reviews.find(
      (r) => r.user && r.user.toString() === userId
    );
    if (existing) {
      existing.rating = rating;
      existing.review = review;
      existing.updatedAt = new Date();
    } else {
      listing.reviews.push({ user: userId, rating, review });
    }
    await listing.save();
    return res.json({
      message: "Review submitted",
      reviews: listing.reviews,
      averageRating: listing.averageRating,
      reviewCount: listing.reviewCount,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({ message: "Failed to submit review" });
  }
};

// GET /listings/:id/reviews - get all reviews for a listing
exports.getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate(
      "reviews.user",
      "firstName lastName email"
    );
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    return res.json({
      reviews: listing.reviews,
      averageRating: listing.averageRating,
      reviewCount: listing.reviewCount,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// PATCH /listings/:id/archive - archive a listing (instead of delete)
exports.archiveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { allowStays, reason } = req.body; // accept reason from frontend
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.isArchived) {
      return res.status(400).json({ message: "Listing is already archived" });
    }
    // Archive the listing
    listing.isArchived = true;
    listing.archivedAt = new Date();
    await listing.save();

    // Find all bookings for this listing
    const now = new Date();
    const bookings = await Booking.find({ listingId: id });
    if (!allowStays) {
      // Cancel all future bookings
      const futureBookings = bookings.filter(
        (b) => new Date(b.checkInDate) > now && b.status === "confirmed"
      );
      for (const booking of futureBookings) {
        booking.status = "listing_deleted";
        booking.cancelReason =
          reason && reason.trim() ? reason : "Listing was deleted by the host.";
        await booking.save();
        // Create notification for user
        await Notification.create({
          userId: booking.userId,
          type: "booking_cancelled",
          message:
            `Your booking for '${listing.title}' was cancelled because the listing was archived by the host.` +
            (reason && reason.trim() ? ` Reason: ${reason}` : ""),
          data: {
            bookingId: booking._id,
            listingId: listing._id,
            reason: booking.cancelReason,
          },
        });
      }
    }
    return res.json({
      message: "Listing archived successfully",
      listing,
      affectedBookings: !allowStays
        ? bookings.filter(
            (b) =>
              new Date(b.checkInDate) > now && b.status === "listing_deleted"
          )
        : [],
    });
  } catch (error) {
    console.error("Error archiving listing:", error);
    return res.status(500).json({ message: "Failed to archive listing" });
  }
};

// PATCH /listings/:id/unarchive - unarchive a listing
exports.unarchiveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (!listing.isArchived) {
      return res.status(400).json({ message: "Listing is not archived" });
    }

    // Unarchive the listing
    listing.isArchived = false;
    listing.archivedAt = undefined;
    await listing.save();

    return res.json({
      message: "Listing unarchived successfully",
      listing,
    });
  } catch (error) {
    console.error("Error unarchiving listing:", error);
    return res.status(500).json({ message: "Failed to unarchive listing" });
  }
};
