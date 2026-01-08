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

| Feature                          | Status | Description |
|----------------------------------|--------|-----------|
| User Registration & Login        | ✅     | Email + Password with JWT + Refresh Token |
| Role-Based Authorization         | ✅     | Traveler & Admin roles with middleware |
| Profile Management               | ✅     | Full CRUD + Cloudinary image upload |
| Travel Plan Management           | ✅     | Create, update, delete, status transitions |
| Advanced Matching Engine         | ✅     | Destination, dates overlap, budget, type, interests + match score |
| Buddy Request System             | ✅     | Send, accept, reject requests |
| Review & Rating System           | ✅     | Post-trip reviews with unique constraint |
| Subscription & Payment           | ✅     | Stripe monthly/yearly plans + webhook |
| Verified Badge                   | ✅     | Auto-granted on successful subscription |
| Admin Dashboard & Management     | ✅     | User blocking, plan deletion, analytics |
| Cron Jobs                        | ✅     | Auto plan status update & subscription expiry |
| Global Error Handling            | ✅     | Friendly messages + Prisma error parsing |

---

### 🛠 Technology Stack

| Category       | Technology                                      |
|----------------|-------------------------------------------------|
| Runtime        | Node.js + TypeScript                            |
| Framework      | Express.js                                      |
| ORM            | Prisma + PostgreSQL                             |
| Authentication | JWT (Access + Refresh) + HTTP-only cookies       |
| File Upload    | Multer + Cloudinary                             |
| Payment        | Stripe (Subscriptions + Webhook)                |
| Email          | Nodemailer (Gmail SMTP)                         |
| Validation     | Zod                                             |
| Error Handling | Custom ApiError + Global handler                |
| Utilities      | node-cron, bcryptjs, http-status                |

---

### 📂 Project Structure
