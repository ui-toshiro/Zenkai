# 🍿 ZENKAI — Modern Movies & Music Events Discovery Platform

<p align="center">
  <b>A comprehensive, high-performance entertainment discovery platform for currently running & upcoming cinema releases, multiplex ticket pricing, live concerts, music festivals, and artist tours.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-20.x%20%7C%2022.x-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_8.x-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## 🌟 Highlights & Features

- **🎬 36 Curated Movies & Showtimes:**
  - Now Showing theatrical films with cinema ticket pricing across 14 major Indian cities (Mumbai, Delhi, Bengaluru, Lucknow, etc.).
  - Genuine Upcoming 2026–2029 film slates with trailers, genres, ratings, cast, and crew.
  - Multi-category curation: Bollywood, Hollywood, South Indian, Anime, and Top-Rated.
- **🎵 Concerts, Music Festivals & Tours:**
  - Live music events, venue maps, and ticketing links.
  - Featured performing artists profiles (Coldplay, Diljit Dosanjh, A.R. Rahman, etc.) with discography and upcoming dates.
- **🔍 Unified Multi-Entertainment Search:**
  - Simultaneous search engine querying across movies, concert dates, festivals, and musicians.
- **👤 User Collections & Reminders:**
  - Watchlist management, concert reminders, favorite artists, and community ratings/reviews.
- **🛡️ Admin & Moderation Center:**
  - Feedback triage, event management, and status reporting.
- **📄 Interactive API Documentation:**
  - Built-in interactive route inspector and schema explorer available at `/docs`.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS v4, Lucide React icons, React Router 7, Vite |
| **Backend** | Node.js (ES Modules), Express 4, Morgan, Helmet, CORS |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose 8.x |
| **Authentication** | JSON Web Tokens (JWT), bcrypt password hashing |
| **Deployment** | Render, Vercel, Docker-ready |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ 
- **MongoDB** (Local instance on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Installation
Clone the repository and install all dependencies:

```bash
git clone https://github.com/<your-username>/zenkai.git
cd zenkai

# Install dependencies for both server and client
npm run install:all
```

### 3. Environment Setup
Configure your environment variables in `server/.env`:

```env
PORT=5001
CLIENT_URL=http://localhost:5174
MONGODB_URI=mongodb://127.0.0.1:27017/zenkai_dev
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 4. Seed the Database
Populate all 36 movies, showtimes across 14 cities, concerts, festivals, and sample accounts:

```bash
npm run seed
```

### 5. Start Development Servers

**Run Server (Backend API on `http://localhost:5001`):**
```bash
npm run dev:server
```

**Run Client (Vite Dev Server on `http://localhost:5174`):**
```bash
npm run dev:client
```

---

## 🔑 Default Accounts

- **Admin Account:**
  - Email: `admin@zenkai.com`
  - Password: `Admin@12345Password!`
  - Access: Full access to `/admin` dashboard, feedback management, and moderation.

- **Demo User:**
  - Email: `user@zenkai.com`
  - Password: `User@12345Password!`
  - Access: Watchlists, event reminders, reviews, and bookings.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/health` | System health check and uptime status |
| `GET` | `/docs` | Interactive HTML API documentation |
| `GET` | `/api/v1/movies/discovery` | Now Showing, Upcoming, Trending, Top-Rated & Genre categorizations |
| `GET` | `/api/v1/movies/:idOrSlug` | Detailed movie page, cast, trailer, and multiplex showtime pricing |
| `GET` | `/api/v1/music/discovery` | Upcoming concerts, music festivals, and artist tour stops |
| `GET` | `/api/v1/artists` | Featured musicians and artist profiles |
| `GET` | `/api/v1/search/unified` | Unified multi-search across movies, events, and artists |
| `POST` | `/api/v1/auth/register` | User account registration |
| `POST` | `/api/v1/auth/login` | User authentication & JWT issuance |
| `POST` | `/api/v1/feedback` | User feedback submission |

---

## 🚢 Production Deployment

The project is structured for easy deployment to cloud platforms like **Render**, **Railway**, or **Vercel**:

```bash
# Build the production frontend into client/dist
npm run build

# Start the unified production server (serves API + static frontend build)
npm start
```

---

## 📜 License
MIT License. Built with ❤️ for entertainment lovers.
