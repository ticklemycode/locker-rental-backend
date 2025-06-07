# Locker Rental Backend

A comprehensive backend API for a locker rental platform built with NestJS, MongoDB, and TypeScript. This application allows users to find and rent lockers at various businesses across Atlanta.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Role-based access control (user, business, admin)
- Secure password hashing with bcrypt

### 🏢 Business Management
- Business owner registration and profile management
- Location-based business search using MongoDB geospatial queries
- Business categorization (restaurants, cafes, offices, etc.)
- Operating hours and amenities management
- Rating and review system

### 📅 Booking System
- Real-time locker availability checking
- Time-based booking conflicts prevention
- Flexible booking duration (max 10 hours)
- Booking status management (pending, confirmed, active, completed, cancelled)
- Automatic booking expiration and cleanup

### 🗺️ Location Services
- Geographic location indexing with 2dsphere indexes
- Find nearby businesses within specified radius
- Address and zip code-based searching
- Coordinate-based distance calculations

### 👥 User Management
- User profile management
- Booking history and statistics
- Account status management
- Phone number and email verification

## Technology Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport
- **Validation**: Class Validator & Class Transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Language**: TypeScript

## Environment Setup

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd locker-rental-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/locker-rental

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Application
PORT=3002
NODE_ENV=development

# Optional: Google Maps API for enhanced location services
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. **Database Setup**
- Install and start MongoDB locally, or use MongoDB Atlas
- The application will automatically create the necessary collections
- Run the seed script to populate with sample data:
```bash
npm run seed
```

## Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The application will start on `http://localhost:3002`

## API Documentation

Once the application is running, access the Swagger API documentation at:
`http://localhost:3002/api/docs`

## Database Schema

### Users
- Personal information (firstName, lastName, email, phone)
- Authentication credentials (password hash)
- Role-based permissions
- Account status tracking

### Businesses
- Business details (name, description, type)
- Location data with geospatial indexing
- Operating hours and contact information
- Locker inventory (total and available counts)
- Pricing and amenities
- Owner relationship and verification status

### Bookings
- User and business relationships
- Time slot management (start/end times)
- Locker assignment and duration tracking
- Status workflow (pending → confirmed → active → completed)
- Payment integration readiness
- Access code generation for lockers

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Users (`/users`)
- `GET /users/profile` - Get current user profile
- `PATCH /users/profile` - Update user profile
- `GET /users/stats` - Get user booking statistics

### Businesses (`/businesses`)
- `GET /businesses` - List all businesses with filters
- `POST /businesses` - Create new business (business owners)
- `GET /businesses/:id` - Get business details
- `PATCH /businesses/:id` - Update business details
- `DELETE /businesses/:id` - Soft delete business
- `GET /businesses/search` - Search businesses by criteria
- `GET /businesses/nearby` - Find businesses by location
- `GET /businesses/owner/:ownerId` - Get businesses by owner

### Bookings (`/bookings`)
- `GET /bookings` - List bookings with filters
- `POST /bookings` - Create new booking
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id` - Update booking
- `DELETE /bookings/:id/cancel` - Cancel booking
- `GET /bookings/my-bookings` - Get current user's bookings
- `GET /bookings/business/:businessId` - Get business bookings
- `GET /bookings/available-lockers/:businessId` - Check locker availability

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## Sample Data

The application includes a seed script that creates sample data for testing:

- **Test Users**: Regular user, business owner, and admin accounts
- **Sample Businesses**: Atlanta locations including:
  - Ponce City Market (restaurant/food hall)
  - Krog Street Market (restaurant/food hall)
  - The Battery Atlanta (entertainment complex)
  - ADP Alpharetta Office (corporate office)
- **Sample Bookings**: Active and completed bookings for demonstration

Run with: `npm run seed`

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── users/               # User management module
├── businesses/          # Business management module
├── bookings/           # Booking system module
├── schemas/            # MongoDB schemas
│   ├── user.schema.ts
│   ├── business.schema.ts
│   └── booking.schema.ts
├── dto/                # Data Transfer Objects
│   ├── auth.dto.ts
│   ├── business.dto.ts
│   └── booking.dto.ts
└── main.ts             # Application entry point
```

## Key Features Deep Dive

### 🔍 Intelligent Location Search
- **Geospatial Queries**: Uses MongoDB's 2dsphere indexes for efficient location-based searches
- **Radius Search**: Find businesses within customizable distance ranges
- **Address Lookup**: Search by street address, city, or zip code
- **Business Categorization**: Filter by restaurant, cafe, office, or other business types

### ⏰ Advanced Booking Management
- **Real-time Availability**: Prevents double-booking with conflict detection
- **Flexible Duration**: Support for 1-10 hour rental periods
- **Automatic Cleanup**: Expired booking management and status updates
- **Cancellation Policy**: 1-hour advance cancellation requirement
- **Access Codes**: Secure locker access with generated codes

### 🛡️ Security & Validation
- **Input Validation**: Comprehensive DTO validation with class-validator
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for users, business owners, and admins
- **Data Sanitization**: Protected against common security vulnerabilities

### 📊 Business Analytics Ready
- **Booking Statistics**: Track user booking patterns and business performance
- **Revenue Tracking**: Built-in total amount calculation for financial reporting
- **Rating System**: User feedback and business rating infrastructure
- **Usage Metrics**: Detailed logging for business intelligence

## Deployment

### Docker Deployment (Recommended)
```bash
# Build the application
npm run build

# Create Docker image
docker build -t locker-rental-backend .

# Run with Docker Compose (include MongoDB)
docker-compose up -d
```

### Traditional Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/locker-rental
JWT_SECRET=your-production-jwt-secret-256-bit
JWT_EXPIRES_IN=24h
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- 💳 **Payment Integration**: Stripe/PayPal integration for booking payments
- 📱 **Push Notifications**: Real-time booking updates and reminders
- 🔐 **QR Code Access**: QR code generation for locker access
- 📈 **Analytics Dashboard**: Business owner analytics and reporting
- 🌐 **Multi-language Support**: Internationalization for global markets
- 🔄 **Real-time Updates**: WebSocket integration for live availability

## License

This project is private and unlicensed. All rights reserved.

## Support

For support and questions, please contact the development team or create an issue in the repository.
