import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import musicEventRoutes from './routes/musicEventRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Security and utility middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve static images directly from public directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/music', musicEventRoutes);
app.use('/api/v1/artists', artistRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/feedback', feedbackRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ZENKAI Movies & Music Events Platform API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Interactive API Documentation at /docs
app.get('/docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZENKAI API Documentation – Movies & Music Events</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4f46e5;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --get: #0284c7;
      --post: #16a34a;
      --put: #ea580c;
      --delete: #dc2626;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 50; }
    .brand { display: flex; align-items: center; gap: 0.75rem; }
    .logo { font-size: 1.4rem; font-weight: 800; color: #4338ca; text-decoration: none; }
    .badge { background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .container { max-width: 1100px; margin: 2rem auto; padding: 0 1.5rem; }
    .intro { background: var(--surface); padding: 2rem; border-radius: 1rem; border: 1px solid var(--border); margin-bottom: 2rem; }
    .intro h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #1e1b4b; }
    .intro p { color: var(--muted); margin-bottom: 1rem; }
    .server-url { background: #f1f5f9; padding: 0.4rem 0.8rem; border-radius: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; display: inline-block; }
    .section-title { font-size: 1.25rem; margin: 2rem 0 1rem; color: #334155; display: flex; items-center; gap: 0.5rem; }
    .endpoint-card { background: var(--surface); border: 1px solid var(--border); border-radius: 0.75rem; margin-bottom: 0.85rem; overflow: hidden; }
    .endpoint-header { padding: 0.85rem 1.25rem; display: flex; align-items: center; gap: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; }
    .method { padding: 0.25rem 0.55rem; border-radius: 0.375rem; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; color: #fff; }
    .method.get { background: var(--get); }
    .method.post { background: var(--post); }
    .method.put { background: var(--put); }
    .method.delete { background: var(--delete); }
    .path { font-weight: 600; color: #1e293b; }
    .desc { margin-left: auto; color: var(--muted); font-size: 0.825rem; font-family: 'Plus Jakarta Sans', sans-serif; }
    code { font-family: 'JetBrains Mono', monospace; background: #f1f5f9; padding: 0.15rem 0.35rem; border-radius: 0.25rem; font-size: 0.85rem; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <a href="/docs" class="logo">🍿 ZENKAI</a>
      <span class="badge">Movies & Music Platform v2.0</span>
      <span class="badge" style="background:#ecfdf5;color:#047857;">Live & Operational</span>
    </div>
    <div style="font-size:0.9rem;color:var(--muted);">
      Client Web App: <a href="http://localhost:5174" target="_blank" style="color:var(--primary);font-weight:600;">http://localhost:5174</a>
    </div>
  </header>

  <div class="container">
    <div class="intro">
      <h1>ZENKAI REST API Specifications</h1>
      <p>Modern discovery platform for currently running and upcoming movies, live concerts, music festivals, artist tours, and verified ticketing.</p>
      <div>Base API URL: <span class="server-url">http://localhost:5001/api/v1</span></div>
    </div>

    <h2 class="section-title">🔍 Unified Multi-Entertainment Search</h2>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/search/unified</span>
        <span class="desc">Search simultaneously across Movies, Concerts, Festivals & Artists</span>
      </div>
    </div>

    <h2 class="section-title">🎵 Music Events & Concerts</h2>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/music/discovery</span>
        <span class="desc">Music sections: Upcoming Concerts, Live Events, Music Festivals, Artist Tours, Popular</span>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/music/events</span>
        <span class="desc">Filter events by genre, city, date, artist, price range, and eventType</span>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/music/events/:idOrSlug</span>
        <span class="desc">Complete event details: performing artists, venue, tickets, and booking links</span>
      </div>
    </div>

    <h2 class="section-title">🎤 Artists & Musicians</h2>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/artists</span>
        <span class="desc">Get featured, popular, and all artists</span>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/artists/:idOrSlug</span>
        <span class="desc">Artist profile: popular tracks, upcoming concert dates, and social links</span>
      </div>
    </div>

    <h2 class="section-title">🎬 Movies & Cinema</h2>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/movies/discovery</span>
        <span class="desc">Now Showing, Upcoming, Trending, Top-Rated, Bollywood, Hollywood, South Indian</span>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/movies/:idOrSlug</span>
        <span class="desc">Movie details: cast, crew, YouTube trailer, cinema ticket prices, and OTT availability</span>
      </div>
    </div>

    <h2 class="section-title">👤 User Collections & Reminders</h2>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/v1/users/saved-events/:eventId</span>
        <span class="desc">Save music event to user profile</span>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/v1/users/event-reminders/:eventId</span>
        <span class="desc">Toggle concert reminder notification</span>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method post">POST</span>
        <span class="path">/api/v1/users/favourite-artists/:artistId</span>
        <span class="desc">Add or remove artist from favourite musicians</span>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="method get">GET</span>
        <span class="path">/api/v1/users/profile-data</span>
        <span class="desc">Fetch user's watchlist, favourite movies & artists, and saved concerts</span>
      </div>
    </div>
  </div>
</body>
</html>
  `);
});

const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Serve frontend static build if client/dist exists
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/docs') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Fallback root route redirects to /docs in API-only mode
  app.get('/', (req, res) => {
    res.redirect('/docs');
  });
}

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🍿 [ZENKAI Platform Server] Running on http://localhost:${PORT}`);
  console.log(`📄 [ZENKAI Docs] Interactive documentation available at http://localhost:${PORT}/docs`);
});
