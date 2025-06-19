# StayFinder Documentation

## Overview

StayFinder is a modern, travel-focused property rental platform inspired by Airbnb. It features a beautiful, minimal UI, robust authentication, property listings, booking, and a full-featured host dashboard. Built with Next.js, Tailwind CSS, Node.js/Express, and MongoDB.

- **Frontend:** Next.js (TypeScript), Tailwind CSS, React Context API
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Design:** Modern, minimal, travel-inspired (see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md))
- **Features:** Authentication, property search, listing details, booking, reviews, host dashboard, dynamic mesh-gradient backgrounds

---

## Table of Contents

- [Project Setup](#project-setup)
- [Design System](#design-system)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)

---

## Project Setup

### Prerequisites

- Node.js (Latest LTS recommended)
- MongoDB
- Gmail account for SMTP

### Environment Setup

1. Create `.env.local` in the root directory:
   ```
   SMTP_USER=your_gmail@gmail.com
   SMTP_PASS=your_gmail_app_password
   ABSTRACT_KEY=your_abstract_api_key
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

#### Development

- Start frontend:
  ```bash
  npm run dev
  ```
  (http://localhost:3000)
- Start backend:
  ```bash
  cd backend
  nodemon server.js
  ```
  (http://localhost:5000)

#### Production

- Build frontend:
  ```bash
  npm run build
  ```
- Start production server:
  ```bash
  npm start
  ```

---

## Design System

StayFinder uses a modern, minimal, travel-inspired design system with a custom color palette (teal, sand, coral, grays), Inter and Poppins fonts, and a clean, responsive layout. All core pages feature:

- **Animated mesh-gradient backgrounds** with blobs, grid, particles, and light rays
- **Reusable components:** Button, Input, Card, Navigation, etc.
- **Consistent spacing, border radius, and shadows**
- **Accessible, mobile-first design**

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for full details, color codes, and component usage.

---

## Tech Stack

### Frontend

- **Next.js 15+ (TypeScript)**
- **Tailwind CSS**
- **React Context API**
- **Custom UI components**

### Backend

- **Node.js + Express.js**
- **MongoDB (Mongoose)**
- **Nodemailer (Gmail SMTP)**
- **bcryptjs**
- **Abstract API (email validation)**

---

## Core Features

### Authentication & User Management

- Email validation, OTP verification, password hashing
- Password reset with secure token
- JWT/session management
- User profile with image, bio, bookings, and listings

### Property Listings & Search

- Dynamic property grid on homepage
- Listing detail page with images, amenities, reviews, and booking calendar
- Search/filter (planned)

### Booking System

- Book properties with date/guest selection
- View bookings in user profile
- Booking status: upcoming, completed, cancelled, listing deleted

### Reviews

- Leave/edit reviews on listings (1-5 stars, text)
- Average rating and review count per listing

### Host Dashboard

- Host login/register (separate from user)
- Create, edit, archive, and manage property listings
- View bookings per listing
- Archive listings (optionally cancel future bookings)
- Host listing detail page with reviews and stats

### UI/UX Enhancements

- Animated mesh-gradient backgrounds on all auth and core pages
- Responsive, mobile-first layouts
- Accessible forms and navigation
- Modern, minimal, travel-focused look

---

## API Endpoints

### Authentication

- `POST /api/auth/register` — User registration
- `POST /api/auth/verify-otp` — Email verification
- `POST /api/auth/login` — User login
- `POST /api/auth/forgot-password` — Password reset request
- `GET /api/auth/verify-reset-token/:token` — Token validation
- `POST /api/auth/reset-password` — Password reset

### Listings

- `GET /api/listings` — Get all listings
- `POST /api/listings` — Create new listing (host)
- `GET /api/listings/:id` — Get listing by ID
- `PUT /api/listings/:id` — Update listing (host)
- `DELETE /api/listings/:id` — Delete listing (host)
- `PATCH /api/listings/:id/archive` — Archive listing (host)
- `PATCH /api/listings/:id/unarchive` — Unarchive listing (host)
- `GET /api/listings/:id/reviews` — Get reviews for listing
- `POST /api/listings/:id/reviews` — Create/update review

### Bookings

- `POST /api/bookings` — Create booking
- `GET /api/bookings/user/:id` — Get bookings for user
- `GET /api/bookings/listing/:id` — Get bookings for listing

---

## Frontend Pages

### Public

- `/login` — User login (animated background)
- `/register` — User registration (animated background)
- `/verify-otp` — Email verification (animated background)
- `/forgot-password` — Password reset request (animated background)
- `/change-password/[token]` — Password reset form (animated background)

### Protected

- `/` — Home (property grid, search, stats)
- `/listings/[id]` — Listing detail (images, amenities, booking, reviews)
- `/profile` — User profile (bookings, stats)
- `/host` — Host dashboard (manage listings)
- `/host/listings/[id]` — Host listing detail (stats, reviews)

---

## Database Schema

### User

```js
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  dob: Date,
  isVerified: Boolean,
  otp: { code: String, expiresAt: Date },
  resetPasswordToken: { token: String, expiresAt: Date },
  bookings: [ObjectId],
  listings: [ObjectId],
  profileImage: String,
  bio: String
}
```

### Listing

```js
{
  title: String,
  description: String,
  location: String,
  pricePerNight: Number,
  bedrooms: Number,
  bathrooms: Number,
  maxGuests: Number,
  amenities: [String],
  images: [String],
  host: { _id: String, name: String, profileImage: String },
  reviews: [{ user: ObjectId, rating: Number, review: String, createdAt, updatedAt }],
  isArchived: Boolean,
  archivedAt: Date
}
```

### Booking

```js
{
  userId: ObjectId,
  listingId: ObjectId,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  totalPrice: Number,
  status: 'pending' | 'confirmed' | 'cancelled' | 'listing_deleted',
  cancelReason: String
}
```

---

## Environment Variables

- `SMTP_USER` — Gmail SMTP username
- `SMTP_PASS` — Gmail SMTP password
- `ABSTRACT_KEY` — Abstract API key for email validation
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT secret key

---

## Security Considerations

- Passwords hashed with bcryptjs (12 rounds)
- Email verification and OTP expiration
- Secure session and token management
- CORS protection
- Environment variable configuration

---

## Future Improvements

- Rate limiting for API endpoints
- Refresh token mechanism
- Social authentication
- Enhanced email templates
- User profile management (edit profile, upload image)
- Password strength requirements
- Two-factor authentication
- Advanced search/filter for listings
- Calendar availability and pricing
- Host analytics dashboard

---

## Contributing

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for UI guidelines. PRs and issues welcome!
