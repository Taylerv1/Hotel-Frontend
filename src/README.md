# Hotel Frontend — Project Architecture

A React-based admin panel for managing hotel bookings and users.

---

## 📁 Folder Structure

```
src/
├── api/                    ← API layer (Axios calls to the backend)
│   ├── api.js              ← Axios instance with base URL and auth token
│   ├── authApi.js           ← Login & Register endpoints
│   ├── bookingsApi.js       ← Bookings CRUD endpoints
│   └── usersApi.js          ← Users CRUD endpoints
│
├── components/             ← Shared components (used by multiple features)
│   ├── ConfirmDialog.jsx    ← Reusable delete confirmation modal
│   ├── EmptyState.jsx       ← "No data found" placeholder
│   ├── LoadingSpinner.jsx   ← Loading indicator
│   ├── Modal.jsx            ← Generic modal wrapper
│   ├── Pagination.jsx       ← Page navigation controls
│   └── StatusBadge.jsx      ← Colored status / role badge
│
├── context/                ← React Context providers
│   └── AuthContext.jsx      ← Authentication state (login, logout, token)
│
├── features/               ← Feature folders (one folder per business feature)
│   ├── auth/               ← Authentication feature
│   │   ├── LoginPage.jsx    ← Login screen
│   │   └── RegisterPage.jsx ← Registration screen
│   │
│   ├── dashboard/          ← Dashboard feature
│   │   └── DashboardPage.jsx← Stats overview page
│   │
│   ├── bookings/           ← Bookings feature
│   │   ├── BookingsPage.jsx ← Page orchestrator
│   │   ├── hooks/
│   │   │   └── useBookings.js ← All bookings state & logic
│   │   └── components/
│   │       ├── BookingFilters.jsx ← Filter controls
│   │       ├── BookingsTable.jsx  ← Data table with sorting
│   │       └── BookingForm.jsx    ← Create / edit form
│   │
│   └── users/              ← Users feature
│       ├── UsersPage.jsx    ← Page orchestrator
│       ├── hooks/
│       │   └── useUsers.js  ← All users state & logic
│       └── components/
│           ├── UserFilters.jsx ← Filter controls
│           ├── UsersTable.jsx  ← Data table with sorting
│           └── UserForm.jsx    ← Create / edit form
│
├── layouts/                ← Layout wrappers
│   └── DashboardLayout.jsx  ← Sidebar + content area for authenticated pages
│
├── routes/                 ← Routing configuration
│   ├── AppRouter.jsx        ← All route definitions
│   └── ProtectedRoute.jsx   ← Redirects unauthenticated users to /login
│
├── styles/                 ← SCSS stylesheets
├── App.jsx                 ← Root component
└── main.jsx                ← Entry point
```

---

## 🔄 Data Flow

```
User action (click, type, submit)
       │
       ▼
  Page Component  ── calls ──▶  Custom Hook (useBookings / useUsers)
       │                              │
       │                              ▼
       │                        API Layer (bookingsApi / usersApi)
       │                              │
       │                              ▼
       │                        Backend Server (Express)
       │                              │
       ▼                              ▼
  Sub-components              Hook updates state
  re-render with              (bookings, users, pagination, etc.)
  new props
```

**Key idea:** Pages are "orchestrators" — they call a hook and pass data down to sub-components via props. Pages contain no business logic.

---

## 🪝 Hook Responsibilities

| Hook | What It Controls |
|---|---|
| `useBookings` | Fetching bookings, CRUD operations, pagination, filters, sort, modal state, delete state |
| `useUsers` | Fetching users, CRUD operations, pagination, filters, sort, modal state, delete state |

Each hook returns an object with **all** the state and handler functions the page needs.

---

## 🧩 Component Hierarchy

### Bookings Feature
```
BookingsPage (orchestrator)
├── BookingFilters    ← status, room type, price filters
├── BookingsTable     ← sortable data table + loading/empty + pagination
├── Modal             ← shared modal wrapper
│   └── BookingForm   ← create/edit form
└── ConfirmDialog     ← shared delete confirmation
```

### Users Feature
```
UsersPage (orchestrator)
├── UserFilters       ← name search, email search, role filter
├── UsersTable        ← sortable data table + loading/empty + pagination
├── Modal             ← shared modal wrapper
│   └── UserForm      ← create/edit form
└── ConfirmDialog     ← shared delete confirmation
```

---

## 📌 Key Concepts for Beginners

1. **Feature folders** group everything related to one screen together (page, hook, components).
2. **Shared components** (`components/`) are reused across multiple features.
3. **Custom hooks** encapsulate all logic — the page never has `useState` or API calls directly.
4. **Props flow downward** — the page passes data to sub-components; sub-components never fetch their own data.
5. **The router** (`AppRouter.jsx`) is the single source of truth for which URL shows which page.
