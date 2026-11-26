# ZENKAI – Cloud Deployment & Operations Guide

ZENKAI is architected as a **unified, production-grade full-stack Node.js web application** (React 19 + Vite frontend statically served by an Express 4 backend with MongoDB).

---

## 🏗️ Architecture Overview

- **Frontend**: React 19, Tailwind CSS, Lucide icons, React Router 7. Pre-built with Vite into `client/dist`.
- **Backend**: Node.js / Express 4 ES Modules (`server/src/server.js`), serving:
  - All API routes under `/api/v1/*`
  - Interactive API documentation under `/docs`
  - Health check endpoint under `/health`
  - Client SPA static assets and HTML fallback for all frontend routes (`/`, `/movies`, `/feedback`, `/admin`, `/concerts`, etc.)
- **Database**: MongoDB (Local `zenkai_dev` or Cloud MongoDB Atlas M0 Cluster via `MONGODB_URI`).
- **Security**: Helmet, CORS, JWT authentication, bcrypt password hashing, in-memory IP rate limiting on feedback endpoints.

---

## 🚀 Recommended Deployment: Render (Free & Permanent)

Render hosts the full-stack service 24/7 with a permanent HTTPS domain (`https://zenkai.onrender.com`).

### Step 1: Set up Cloud MongoDB (MongoDB Atlas)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and log in or create a free account.
2. Create a free **M0 Shared Cluster** (always free, 512MB).
3. Under **Database Access**, create a user (e.g. `zenkai_admin` with password).
4. Under **Network Access**, click **Add IP Address** -> choose **Allow Access From Anywhere** (`0.0.0.0/0`).
5. Click **Connect** -> **Drivers (Node.js)** -> copy your connection string:
   ```
   mongodb+srv://zenkai_admin:<password>@cluster0.abcde.mongodb.net/zenkai_prod?retryWrites=true&w=majority
   ```

### Step 2: Seed the Cloud Database (1-Click)
Run this command from the project root on your computer (replace `<MONGODB_URI>` with your Atlas string):
```bash
set MONGODB_URI=mongodb+srv://zenkai_admin:<password>@cluster0.abcde.mongodb.net/zenkai_prod?retryWrites=true&w=majority
npm run seed
```
This automatically populates:
- 36 Curated Movies (Theatrical Now Showing & Genuine Upcoming 2026–2029)
- Multiplex showtimes across 14 major Indian cities (Mumbai, Delhi, Bengaluru, Lucknow, etc.)
- 7 Concerts & Music Festivals
- 5 Featured Artists (Coldplay, Diljit Dosanjh, A.R. Rahman, etc.)
- Admin Account: `admin@zenkai.com` / `Admin@12345Password!`
- User Account: `user@zenkai.com` / `User@12345Password!`

### Step 3: Deploy to Render
1. Push this repository to GitHub or GitLab.
2. In [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
3. Select your repository.
4. Configure the service:
   - **Environment**: Node
   - **Build Command**: `npm install --prefix server && npm install --prefix client && npm run build --prefix client`
   - **Start Command**: `node server/src/server.js`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
     - `MONGODB_URI`: `mongodb+srv://zenkai_admin:<password>@cluster0.abcde.mongodb.net/zenkai_prod?retryWrites=true&w=majority`
     - `JWT_SECRET`: Any secure random 32+ character string
     - `TMDB_API_KEY`: *(Optional)* Your TMDB API key if fetching live TMDB data
5. Click **Deploy Web Service**.
6. Render will build and launch your permanent HTTPS URL (e.g., `https://zenkai.onrender.com`).

---

## ⚡ Alternative Deployment: Vercel (Frontend) + Render (Backend)

If you prefer splitting frontend and backend:
1. Deploy Backend to Render Web Service using root folder `server`.
2. Deploy Frontend to Vercel:
   - In `client/`, set environment variable `VITE_API_URL=https://your-backend.onrender.com/api/v1`
   - Run `npx vercel deploy --prod`

---

## 🔑 Default Production Credentials

- **Admin Account**:
  - Email: `admin@zenkai.com`
  - Password: `Admin@12345Password!`
  - Access: Full access to `/admin` dashboard, feedback management, status triage, and notes.
- **Regular User**:
  - Email: `user@zenkai.com`
  - Password: `User@12345Password!`
