const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        required: false,
      },
    ],
    host: {
      _id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      profileImage: {
        type: String,
        default: "",
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add virtuals for averageRating and reviewCount
listingSchema.virtual("averageRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});
listingSchema.virtual("reviewCount").get(function () {
  return this.reviews ? this.reviews.length : 0;
});
listingSchema.set("toObject", { virtuals: true });
listingSchema.set("toJSON", { virtuals: true });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
