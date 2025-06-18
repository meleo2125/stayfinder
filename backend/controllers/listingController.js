const Listing = require("../models/Listing");

// GET /listings - get all listings (with optional filters)
exports.getAllListings = async (req, res) => {
  try {
    // Fetch all listings from database
    const listings = await Listing.find({});
    return res.json({ listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// GET /listings/:id - get single listing by id
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.json({ listing });
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

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

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
