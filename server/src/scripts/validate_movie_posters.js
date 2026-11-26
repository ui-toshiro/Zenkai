import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import axios from 'axios';
import Movie from '../models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_POSTER_DIR = path.resolve(__dirname, '../../../client/public/images/movies');
const SERVER_POSTER_DIR = path.resolve(__dirname, '../../public/images/movies');
const OPPENHEIMER_HASH = '8Gxv8gSFCU0XGDykEGv7zR1n2ua';

async function validateSystem() {
  console.log('========================================================================');
  console.log('🛡️  ZENKAI MOVIE POSTER VALIDATION & AUDIT SUITE');
  console.log('========================================================================\n');

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev');
  const movies = await Movie.find({}, 'title slug poster backdrop tmdbId releaseStatus releaseYear').sort({ title: 1 }).lean();

  console.log(`Auditing ${movies.length} movies in database...\n`);

  let failures = [];
  const posterToMovies = new Map();
  const testedMovies = [];

  for (const m of movies) {
    const issues = [];

    // 1. Valid poster check
    if (!m.poster || typeof m.poster !== 'string' || m.poster.trim().length === 0) {
      issues.push('Missing poster URL');
    }

    // 2. Unsplash generic stock check
    if (m.poster && m.poster.includes('unsplash.com')) {
      issues.push(`Using generic stock image: ${m.poster}`);
    }

    // 3. Oppenheimer assignment check
    if (m.poster && (m.poster.includes(OPPENHEIMER_HASH) || m.poster.includes('oppenheimer-poster.jpg'))) {
      if (m.slug !== 'oppenheimer') {
        issues.push(`UNAUTHORIZED OPPENHEIMER POSTER ASSIGNED TO: ${m.title}`);
      }
    }

    // 4. Duplicate poster tracking
    if (m.poster) {
      if (!posterToMovies.has(m.poster)) {
        posterToMovies.set(m.poster, []);
      }
      posterToMovies.get(m.poster).push(m.title);
    }

    // 5. Physical disk existence check for local posters
    let fileSizeKb = 0;
    if (m.poster && m.poster.startsWith('/images/movies/')) {
      const fileName = path.basename(m.poster);
      const clientPath = path.join(CLIENT_POSTER_DIR, fileName);
      const serverPath = path.join(SERVER_POSTER_DIR, fileName);

      if (!fs.existsSync(clientPath)) {
        issues.push(`Missing file on disk in client: ${clientPath}`);
      } else {
        const stat = fs.statSync(clientPath);
        fileSizeKb = (stat.size / 1024).toFixed(1);
        if (stat.size < 5000) {
          issues.push(`File too small in client: ${stat.size} bytes`);
        }
      }

      if (!fs.existsSync(serverPath)) {
        issues.push(`Missing file on disk in server: ${serverPath}`);
      }
    }

    // 6. Network connectivity test (Frontend & Backend HTTP 200)
    let feStatus = 'N/A';
    let beStatus = 'N/A';
    if (m.poster && m.poster.startsWith('/images/movies/')) {
      try {
        const feRes = await axios.get(`http://localhost:5174${m.poster}`, { timeout: 3000 });
        feStatus = `${feRes.status} OK`;
      } catch (err) {
        feStatus = `ERR (${err.message})`;
        issues.push(`Frontend HTTP fetch failed: ${err.message}`);
      }

      try {
        const beRes = await axios.get(`http://localhost:5001${m.poster}`, { timeout: 3000 });
        beStatus = `${beRes.status} OK`;
      } catch (err) {
        beStatus = `ERR (${err.message})`;
        issues.push(`Backend HTTP fetch failed: ${err.message}`);
      }
    }

    testedMovies.push({
      title: m.title,
      slug: m.slug,
      poster: m.poster,
      fileSizeKb: `${fileSizeKb} KB`,
      feStatus,
      beStatus,
      issues,
    });

    if (issues.length > 0) {
      failures.push({ movie: m.title, issues });
    }
  }

  // Check for duplicates
  let duplicateGroups = 0;
  for (const [poster, movieList] of posterToMovies.entries()) {
    if (movieList.length > 1) {
      duplicateGroups++;
      failures.push({
        movie: movieList.join(', '),
        issues: [`Duplicate poster URL shared by ${movieList.length} movies: ${poster}`],
      });
    }
  }

  // Display detailed test table of 25+ movies
  console.log('--- TESTED MOVIES AUDIT REPORT (Sample 25 Movies) ---');
  console.log('Title'.padEnd(35) + ' | ' + 'File Size'.padEnd(10) + ' | ' + 'FE (5174)'.padEnd(12) + ' | ' + 'BE (5001)'.padEnd(12) + ' | Poster Path');
  console.log('-'.repeat(105));
  for (const t of testedMovies.slice(0, 25)) {
    console.log(
      t.title.padEnd(35).substring(0, 35) +
      ' | ' +
      t.fileSizeKb.padEnd(10) +
      ' | ' +
      t.feStatus.padEnd(12) +
      ' | ' +
      t.beStatus.padEnd(12) +
      ' | ' +
      t.poster
    );
  }

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`Total Movies Checked: ${movies.length}`);
  console.log(`Unique Posters in Use: ${posterToMovies.size}`);
  console.log(`Duplicate Poster Groups: ${duplicateGroups}`);
  console.log(`Oppenheimer Poster Usage: Exactly ${posterToMovies.get('/images/movies/oppenheimer-poster.jpg')?.length || 0} movie (Oppenheimer only)`);

  // Verify Discovery API endpoint
  console.log('\n--- VERIFYING API DISCOVERY & CATEGORIES ENDPOINTS ---');
  try {
    const discRes = await axios.get('http://localhost:5001/api/v1/movies/discovery', { timeout: 4000 });
    const nowShowingCount = discRes.data?.data?.nowShowing?.length || 0;
    const upcomingCount = discRes.data?.data?.upcoming?.length || 0;
    console.log(`✓ GET /api/v1/movies/discovery: ${nowShowingCount} now-showing, ${upcomingCount} upcoming`);
  } catch (err) {
    console.error(`✗ GET /api/v1/movies/discovery error: ${err.message}`);
    failures.push({ movie: 'Discovery Endpoint', issues: [err.message] });
  }

  try {
    const catRes = await axios.get('http://localhost:5001/api/v1/movies/theatrical/categories', { timeout: 4000 });
    console.log(`✓ GET /api/v1/movies/theatrical/categories: 200 OK`);
  } catch (err) {
    console.error(`✗ GET /api/v1/movies/theatrical/categories error: ${err.message}`);
    failures.push({ movie: 'Categories Endpoint', issues: [err.message] });
  }

  await mongoose.disconnect();

  if (failures.length > 0) {
    console.error('\n❌ VALIDATION FAILED WITH ISSUES:');
    for (const f of failures) {
      console.error(`- ${f.movie}: ${f.issues.join('; ')}`);
    }
    process.exit(1);
  } else {
    console.log('\n========================================================================');
    console.log('🎉 ALL AUDIT CHECKS PASSED: ZERO DUPLICATES, ZERO OPPENHEIMER FALLBACKS');
    console.log('========================================================================');
  }
}

validateSystem().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
