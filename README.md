# HotelAdmin - Frontend Dashboard

A modern React admin dashboard for the Hotel Booking System API. Built with Vite, TailwindCSS, and React Router.

## Features

- 🔐 JWT Authentication (Login, Register, Auto-logout)
- 📊 Dashboard with stats overview
- 👥 Users Management (CRUD, search, filter by role, sort, pagination)
- 📅 Bookings Management (CRUD, filter by status/room type/price, sort, pagination)
- 🎨 Modern UI with TailwindCSS
- 📱 Fully responsive design

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite | Build tool |
| TailwindCSS v4 | Styling |
| React Router v7 | Routing |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| React Icons | Icon library |
| Context API | State management |

## Project Structure

```
src/
├── api/            # Axios instance & API modules
│   ├── api.js          # Centralized axios with JWT interceptor
│   ├── authApi.js      # Auth endpoints
│   ├── usersApi.js     # Users CRUD
│   └── bookingsApi.js  # Bookings CRUD
├── components/     # Reusable UI components
│   ├── ConfirmDialog.jsx
│   ├── EmptyState.jsx
│   ├── LoadingSpinner.jsx
│   ├── Modal.jsx
│   ├── Pagination.jsx
│   └── StatusBadge.jsx
├── context/        # React Context providers
│   └── AuthContext.jsx
├── layouts/        # Page layouts
│   └── DashboardLayout.jsx
├── pages/          # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── UsersPage.jsx
│   └── BookingsPage.jsx
├── routes/         # Routing config
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Required Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Setup Instructions

1. **Install dependencies:**
```bash
npm install
```

2. **Start the backend** (in `/testbackend`):
```bash
cd ../testbackend
npm run dev
```

3. **Start the frontend:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:5173
```

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/users | Get all users (with filters) |
| POST | /api/users | Create user |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
| GET | /api/bookings | Get all bookings (with filters) |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/:id | Get booking by ID |
| PUT | /api/bookings/:id | Update booking |
| DELETE | /api/bookings/:id | Delete booking |

## Screenshots

> Screenshots will be added after deployment

## License

ISC
