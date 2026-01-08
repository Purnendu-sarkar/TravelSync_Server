# TravelSync – Backend Server (Travel Buddy & Meetup Platform)

**Backend Repository:** https://github.com/Purnendu-sarkar/TravelSync_Server  
**Live API Base URL:** https://travelsync-server.onrender.com/api/v1  
**Frontend Repository:** https://github.com/Purnendu-sarkar/TravelSync_Frontend  
**Live Website:** https://travel-sync-frontend-sandy.vercel.app  
**Video Demonstration:**

---

### 🚀 Project Overview

This repository contains the **complete backend** for **TravelSync** — a subscription-based travel buddy finding platform. Users can create travel plans, search for compatible companions using advanced filters (destination, dates, budget, travel type, interests), send join requests, leave reviews after trips, and unlock premium features through Stripe subscriptions.

The backend is built with **Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL**, featuring robust authentication, role-based access, payment integration, cron jobs, and comprehensive error handling.

---

### ✨ Core Backend Features

| Feature                      | Status | Description                                                       |
| ---------------------------- | ------ | ----------------------------------------------------------------- |
| User Registration & Login    | ✅     | Email + Password with JWT + Refresh Token                         |
| Role-Based Authorization     | ✅     | Traveler & Admin roles with middleware                            |
| Profile Management           | ✅     | Full CRUD + Cloudinary image upload                               |
| Travel Plan Management       | ✅     | Create, update, delete, status transitions                        |
| Advanced Matching Engine     | ✅     | Destination, dates overlap, budget, type, interests + match score |
| Buddy Request System         | ✅     | Send, accept, reject requests                                     |
| Review & Rating System       | ✅     | Post-trip reviews with unique constraint                          |
| Subscription & Payment       | ✅     | Stripe monthly/yearly plans + webhook                             |
| Verified Badge               | ✅     | Auto-granted on successful subscription                           |
| Admin Dashboard & Management | ✅     | User blocking, plan deletion, analytics                           |
| Cron Jobs                    | ✅     | Auto plan status update & subscription expiry                     |
| Global Error Handling        | ✅     | Friendly messages + Prisma error parsing                          |

---

### 🛠 Technology Stack

| Category       | Technology                                 |
| -------------- | ------------------------------------------ |
| Runtime        | Node.js + TypeScript                       |
| Framework      | Express.js                                 |
| ORM            | Prisma + PostgreSQL                        |
| Authentication | JWT (Access + Refresh) + HTTP-only cookies |
| File Upload    | Multer + Cloudinary                        |
| Payment        | Stripe (Subscriptions + Webhook)           |
| Email          | Nodemailer (Gmail SMTP)                    |
| Validation     | Zod                                        |
| Error Handling | Custom ApiError + Global handler           |
| Utilities      | node-cron, bcryptjs, http-status           |

---

## 📂 Project Structure

````text
src/
├── app/
│   ├── modules/
│   │   ├── user/           # User CRUD, public profiles
│   │   ├── auth/           # Login, register, password reset
│   │   ├── travelPlan/     # Plans, matching, requests
│   │   ├── review/         # Reviews & ratings
│   │   ├── subscription/   # Stripe integration
│   │   └── meta/           # Dashboard analytics
│   ├── middlewares/        # auth, globalErrorHandler
│   └── routes/             # All API routes
├── config/                 # Environment config
├── helper/                 # JWT, pagination, file upload
├── lib/prisma/             # Prisma client
└── shared/                 # catchAsync, sendResponse



---

### 🌐 Key API Endpoints

```bash
# Authentication
POST   /api/v1/auth/login
POST   /api/v1/auth/create-traveler          # Register
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/change-password
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

# Travel Plans
GET    /api/v1/travel-plans/public           # Latest public plans
GET    /api/v1/travel-plans/match            # Advanced search & match
POST   /api/v1/travel-plans                  # Create plan
GET    /api/v1/travel-plans/my-plans         # Authenticated user's plans
POST   /api/v1/travel-plans/:planId/request  # Send buddy request

# Reviews
POST   /api/v1/reviews                       # Create review
GET    /api/v1/reviews/me                    # My received reviews
GET    /api/v1/reviews/public                # Latest public reviews

# Subscriptions
GET    /api/v1/subscriptions/plans
POST   /api/v1/subscriptions/create-checkout
GET    /api/v1/subscriptions/my-status

# Dashboard Meta
GET    /api/v1/meta                          # Admin & Traveler stats
````

---

### 🧑‍💻 Admin Credentials (Required for Evaluation)

Important: Use these to test admin features
Admin Email: admin@travelbuddy.com
Password: SuperSecure123
(The admin is automatically created on server startup via `seedAdmin.ts`)

---

### 🚀 Setup & Run Locally

# Clone repository

```bash

git clone https://github.com/Purnendu-sarkar/TravelSync_Server
cd travel-sync-server
```

# Install dependencies

npm install

# Copy environment variables

cp .env.example .env

# Configure .env (required)

```bash
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_SENDER_EMAIL=...
EMAIL_SENDER_APP_PASS=...
ADMIN_EMAIL=admin@travelbuddy.com
ADMIN_PASSWORD=SuperSecure123
CLIENT_URL=http://localhost:3000
```

# Run in development

```bash
  npm run dev
```

Server will run at: `bash  http://localhost:5000 `

---

### 🌍 Deployment

Platform: Render
Database: PostgreSQL (Neon / Supabase)
Environment Variables: All values from .env must be set in production

---

### 👨‍💻 Developed By

**Purnendu Sarkar**
Full-Stack Developer | Travel Enthusiast ✈️
GitHub: https://github.com/Purnendu-sarkar
LinkedIn: https://www.linkedin.com/in/purnendusarkar
