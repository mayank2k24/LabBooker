# LABBOOKER

## Overview
This advanced booking system is designed to efficiently manage resource reservations with features like conflict resolution, user approval, and high-performance data handling using Redis.

## Recent Updates
- Integrated Redis for improved performance and conflict reduction
- Added user approval system for enhanced security
- Implemented basic conflict resolution mechanism
- Planning to add a visual booking component for better user experience

## Features
- User registration and authentication
- Admin panel for user management and system oversight
- Resource booking with conflict detection
- Redis integration for high-speed data operations
- User approval system for new registrations

## TODO

### Redis Implementation
- [ ] Set up Redis connection and error handling
- [ ] Implement temporary locking mechanism for time slots using Redis
- [ ] Use Redis for quick availability checks
- [ ] Update booking creation process to use Redis for conflict prevention
- [ ] Add Redis data synchronization with the main database
- [ ] Implement Redis data expiration for efficient memory usage
- [ ] Add error handling and fallback mechanisms for Redis operations
- [ ] Create unit and integration tests for Redis functionality

### Visual Booking Component

- [ ] Research and decide between Konva.js and Lucide React for the visual component
- [ ] Design the layout for the visual booking interface
- [ ] Implement a calendar view showing available and booked time slots
- [ ] Add drag-and-drop functionality for creating and modifying bookings
- [ ] add a whiteboard.js so that when can do something he want to like system design or architecture
- [ ] Implement real-time updates for the visual component
- [ ] Ensure the visual component is responsive and works on different screen sizes
- [ ] Add accessibility features to the visual booking component
- [ ] Create unit and integration tests for the visual booking component

## Technology Stack

- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB
- Caching: Redis
- Authentication: JSON Web Tokens (JWT)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/advanced-booking-system.git
   ```

2. Navigate to the project directory:

   ```
   cd advanced-booking-system
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables (see Configuration section)

5. Start the application:
   ```
   npm start
   ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

PORT=your_port
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
REDIS_TLS=true_or_false
MAILGUN CREDENTIALS
CORS_ORIGIN=your_cors_origin
HELP_MAIL=your_help_mail

Ensure to replace the placeholder values with your actual configuration details.

## Usage

1. Register a new user account
2. Log in to the system
3. Browse available resources
4. Make a booking for a specific resource and time slot
5. View and manage your bookings

For administrators:

1. Log in with admin credentials
2. Access the admin panel
3. Manage users, resources, and bookings
4. Approve new user registrations
5. Resolve booking conflicts

## API Documentation

### User Routes

- POST /api/users/register - Register a new user
- POST /api/users/login - User login
- GET /api/users/profile - Get user profile

### Booking Routes

- POST /api/bookings - Create a new booking
- GET /api/bookings - Get all bookings for the logged-in user
- GET /api/bookings/:id - Get a specific booking
- PUT /api/bookings/:id - Update a booking
- DELETE /api/bookings/:id - Cancel a booking

### Admin Routes

- GET /api/admin/users - Get all users
- POST /api/admin/approve-user/:userId - Approve a user
- GET /api/admin/bookings - Get all bookings
- POST /api/admin/resolve-conflict/:conflictId - Resolve a booking conflict

## Contributing

- Not open for contribution

