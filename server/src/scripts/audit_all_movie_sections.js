import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_POSTER_DIR = path.resolve(__dirname, '../../../client/public/images/movies');
const SERVER_POSTER_DIR = path.resolve(__dirname, '../../public/images/movies');

async function audit() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev');
  const movies = await Movie.find({}).sort({ title: 1 }).lean();

  console.log(`\n========================================================================`);
  console.log(`🎬 AUDITING ${movies.length} MOVIES ACROSS ALL ZENKAI SECTIONS`);
  console.log(`========================================================================\n`);

  // Ensure ID-based poster files exist: {movie-id}-poster.jpg
  let idPostersCreated = 0;
  for (const m of movies) {
    const slugFile = `${m.slug}-poster.jpg`;
    const idFile = `${m._id}-poster.jpg`;

    const clientSlugPath = path.join(CLIENT_POSTER_DIR, slugFile);
    const serverSlugPath = path.join(SERVER_POSTER_DIR, slugFile);
    const clientIdPath = path.join(CLIENT_POSTER_DIR, idFile);
    const serverIdPath = path.join(SERVER_POSTER_DIR, idFile);

    if (fs.existsSync(clientSlugPath) && !fs.existsSync(clientIdPath)) {
      fs.copyFileSync(clientSlugPath, clientIdPath);
      idPostersCreated++;
    }
    if (fs.existsSync(serverSlugPath) && !fs.existsSync(serverIdPath)) {
      fs.copyFileSync(serverSlugPath, serverIdPath);
    }
  }
  console.log(`✓ Synchronized ID-based poster files ({movie-id}-poster.jpg): ${idPostersCreated} created.`);

  // Group by Industry
  const industries = {
    bollywood: [],
    hollywood: [],
    south_indian: [],
    international: [],
  };

  // Group by Section
  const sections = {
    nowShowing: [],
    upcoming: [],
    featured: [],
    trending: [],
    popular: [],
  };

  const posterMap = new Map();
  const duplicates = [];

  for (const m of movies) {
    const ind = m.industry || 'other';
    if (!industries[ind]) industries[ind] = [];
    industries[ind].push(m);

    if (m.releaseStatus === 'now_showing') sections.nowShowing.push(m);
    if (m.releaseStatus === 'upcoming') sections.upcoming.push(m);
    if (m.featured) sections.featured.push(m);
    if (m.trending) sections.trending.push(m);
    if (m.popular) sections.popular.push(m);

    if (posterMap.has(m.poster)) {
      duplicates.push({ poster: m.poster, movies: [posterMap.get(m.poster), m.title] });
    } else {
      posterMap.set(m.poster, m.title);
    }
  }

  console.log('\n--- BREAKDOWN BY INDUSTRY ---');
  for (const [ind, list] of Object.entries(industries)) {
    console.log(`📁 ${ind.toUpperCase()} (${list.length} movies):`);
    for (const m of list) {
      console.log(`   - "${m.title}" (${m.releaseYear || 'N/A'}) [TMDB: ${m.tmdbId}] -> ${m.poster}`);
    }
  }

  console.log('\n--- BREAKDOWN BY SECTION ---');
  console.log(`🎟️ Now Showing: ${sections.nowShowing.length} movies`);
  console.log(`⏳ Upcoming: ${sections.upcoming.length} movies`);
  console.log(`⭐ Featured: ${sections.featured.length} movies`);
  console.log(`🔥 Trending: ${sections.trending.length} movies`);
  console.log(`🚀 Popular: ${sections.popular.length} movies`);

  console.log('\n--- DUPLICATE AUDIT ---');
  if (duplicates.length === 0) {
    console.log('✓ PERFECT: ZERO DUPLICATE POSTERS FOUND ACROSS ENTIRE CATALOG.');
  } else {
    console.error('✗ WARNING: Found duplicate posters:', duplicates);
  }

  await mongoose.disconnect();
}

audit().catch(console.error);
