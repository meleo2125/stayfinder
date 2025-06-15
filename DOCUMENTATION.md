# StayFinder Documentation

## Overview

StayFinder is a modern web application built with Next.js and Node.js, featuring a robust authentication system and user management.

## Tech Stack

### Frontend

- **Framework**: Next.js 15.3.3 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Custom authentication with JWT and session management

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer with Gmail SMTP
- **Password Hashing**: bcryptjs
- **Email Validation**: Abstract API

## Core Features

### Authentication System

1. **User Registration**

   - Email validation using Abstract API
   - Password hashing with bcryptjs
   - Email verification with OTP
   - OTP expiration after 10 minutes

2. **User Login**

   - Session-based authentication
   - JWT token management
   - 24-hour session expiration
   - Secure password comparison

3. **Password Reset Flow**
   - Secure token generation using crypto
   - 15-minute token expiration
   - Email-based reset link
   - Password confirmation
   - Automatic redirect to login

### Security Features

- Password hashing with bcryptjs (12 rounds)
- Secure session management
- Email verification
- Token-based password reset
- CORS protection
- Environment variable configuration

### Email System

- Gmail SMTP integration
- HTML email templates
- OTP delivery
- Password reset link delivery
- Error handling and logging

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/auth/verify-reset-token/:token` - Token validation
- `POST /api/auth/reset-password` - Password reset

## Frontend Pages

### Public Routes

- `/login` - User login
- `/register` - User registration
- `/verify-otp` - Email verification
- `/forgot-password` - Password reset request
- `/change-password/[token]` - Password reset form

### Protected Routes

- `/` - Home page (requires authentication)

## Database Schema

### User Model

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  dob: Date,
  isVerified: Boolean,
  otp: {
    code: String,
    expiresAt: Date
  },
  resetPasswordToken: {
    token: String,
    expiresAt: Date
  }
}
```

## Environment Variables

Required environment variables:

- `SMTP_USER` - Gmail SMTP username
- `SMTP_PASS` - Gmail SMTP password
- `ABSTRACT_KEY` - Abstract API key for email validation
- MongoDB connection string
- JWT secret key

## Security Considerations

1. **Password Security**

   - Passwords are hashed using bcryptjs
   - Password confirmation required for registration and reset
   - Password reset tokens expire after 15 minutes

2. **Email Security**

   - Email verification required for account activation
   - OTP expiration after 10 minutes
   - Secure email delivery using Gmail SMTP

3. **Session Security**
   - 24-hour session expiration
   - Secure session storage
   - Protected routes implementation

## Error Handling

- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Proper HTTP status codes
- Error logging for debugging

## Future Improvements

1. Add rate limiting for API endpoints
2. Implement refresh token mechanism
3. Add social authentication
4. Enhance email templates
5. Add user profile management
6. Implement password strength requirements
7. Add two-factor authentication
