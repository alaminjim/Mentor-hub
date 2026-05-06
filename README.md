# 🎓 Mentor Hub

A comprehensive online platform connecting students with experienced tutors for personalized learning experiences.

## 🔗 Live Demo

**Frontend:** https://mentor-hub-1.onrender.com

**Backend API:** https://mentor-hub-1.onrender.com

### 🔑 Demo Credentials

**Admin Access:**
- Email: `admin@gmail.com`
- Password: `12345678`
- 
> ⚠️ **Note:** These are demo credentials for testing purposes only.

## 🔗 Live Demo

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Mentor Hub is a modern tutoring platform that bridges the gap between students seeking knowledge and tutors offering expertise. The platform provides a seamless experience for booking tutoring sessions, managing profiles, and sharing reviews.

### Key Highlights

- 🔐 Secure authentication with Better Auth
- 👨‍🎓 Role-based access (Students, Tutors, Admins)
- 📅 Session booking and management
- ⭐ Review and rating system
- 📊 Comprehensive dashboard for all user types
- 📱 Fully responsive design

## ✨ Features

### For Students
- Browse and search tutors by subject and expertise
- View detailed tutor profiles with ratings and reviews
- Book tutoring sessions
- Leave reviews and ratings
- Manage personal profile and bookings

### For Tutors
- Create comprehensive tutor profiles
- Showcase expertise and qualifications
- Manage booking requests
- View and respond to student reviews
- Track session history

### For Admins
- User management (approve/ban users)
- Monitor platform activity
- Manage tutors and students
- View platform statistics

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with shadcn/ui
- **State Management:** React Hooks
- **Notifications:** React Hot Toast

### Backend
- **API:** Next.js API Routes (Proxy to separate backend)
- **Authentication:** Better Auth
- **Database:** PostgreSQL with Prisma ORM
- **Session Management:** Cookie-based authentication

### Deployment
- **Frontend:** Vercel
- **Backend:** Vercel (separate deployment)
- **Database:** PostgreSQL (Vercel Postgres / Neon / Supabase)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/alaminjim/Mentor-hub.git
cd Mentor-hub
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mentor_hub"

# Backend API
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"

# Better Auth (optional - if using separate auth server)
BETTER_AUTH_SECRET="your-secret-key"
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_FRONTEND_URL` | Frontend URL | Yes |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth | Yes |

## 📁 Project Structure

```
Mentor-hub/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── @student/          # Student routes (parallel route)
│   │   │   └── dashboard/
│   │   ├── @tutor/            # Tutor routes (parallel route)
│   │   │   └── dashboard/
│   │   ├── @admin/            # Admin routes (parallel route)
│   │   │   └── dashboard/
│   │   └── api/               # API proxy routes
│   │       └── [...path]/
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── service/           # API service functions
│   │   └── features/          # Feature-specific components
│   ├── lib/
│   │   ├── auth-client.ts     # Better Auth client
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-up` - User registration
- `GET /api/auth/authMe` - Get current user
- `POST /api/auth/sign-out` - User logout

### Tutors
- `GET /api/tutor` - Get all tutors
- `GET /api/tutor/:id` - Get tutor by ID
- `POST /api/tutor/create` - Create tutor profile
- `PUT /api/tutor/:id` - Update tutor profile

### Reviews
- `GET /api/review` - Get all reviews
- `GET /api/review?tutorId=:id` - Get reviews for a tutor
- `GET /api/review/own` - Get user's own reviews
- `POST /api/review/create` - Create a review

### Bookings
- `GET /api/booking` - Get all bookings
- `GET /api/booking/own` - Get user's bookings
- `POST /api/booking/create` - Create a booking
- `PUT /api/booking/:id` - Update booking status

### Students
- `GET /api/student/:id` - Get student profile
- `DELETE /api/student/:id` - Delete student profile

## 🔐 Authentication

The platform uses **Better Auth** for secure authentication with the following features:

- Cookie-based sessions
- Role-based access control (RBAC)
- Secure password hashing
- Session management
- CSRF protection

### User Roles

1. **STUDENT** - Can browse tutors, book sessions, and leave reviews
2. **TUTOR** - Can create profiles, manage bookings, and view reviews
3. **ADMIN** - Full platform access with user management capabilities

### Authentication Flow

```
1. User signs up/signs in
2. Better Auth creates session cookie
3. Cookie sent with each request (credentials: "include")
4. Backend validates session
5. User data attached to request
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow the existing code structure
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 👥 Authors

- **Alamin Jim** - *Initial work* - [@alaminjim](https://github.com/alaminjim)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Better Auth for authentication solution
- Vercel for hosting platform
- All contributors and users of Mentor Hub

## 📧 Contact

For questions or support, please contact:
- GitHub: [@alaminjim](https://github.com/alaminjim)
- Project Link: [https://github.com/alaminjim/Mentor-hub](https://github.com/alaminjim/Mentor-hub)

---
