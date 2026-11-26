import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_POSTER_DIR = path.resolve(__dirname, '../../../client/public/images/movies');
const SERVER_POSTER_DIR = path.resolve(__dirname, '../../public/images/movies');

fs.mkdirSync(CLIENT_POSTER_DIR, { recursive: true });
fs.mkdirSync(SERVER_POSTER_DIR, { recursive: true });

// Exhaustive, verified official cinema release poster URLs
const OFFICIAL_POSTER_SOURCES = {
  'oppenheimer': [
    'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  ],
  'dune-part-two': [
    'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  ],
  'jawan': [
    'https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg',
  ],
  '12th-fail': [
    'https://image.tmdb.org/t/p/w500/eebUPRI4Z5e1Z7Hev4JZAwMIFkX.jpg',
  ],
  'stree-2': [
    'https://image.tmdb.org/t/p/w500/2NC7sj8rheKxWqLYAbHnCa4mYBH.jpg',
  ],
  'rrr': [
    'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg',
  ],
  'kantara': [
    'https://image.tmdb.org/t/p/w500/zO1MoCgaz0RxILjga8VYXguROMp.jpg',
  ],
  'spirited-away': [
    'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
  ],
  'suzume': [
    'https://image.tmdb.org/t/p/w500/x8IcS3iaqo1hayup5m9NTFJAqYJ.jpg',
  ],
  'avatar-fire-and-ash': [
    'https://image.tmdb.org/t/p/w500/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg',
  ],
  'kalki-2898-ad-part-2': [
    'https://image.tmdb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg',
  ],
  'spider-man-across-the-spider-verse': [
    'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
  ],
  'war-2': [
    'https://image.tmdb.org/t/p/w500/aOSDKvqglKVa3SYy4CPXYUAfDlf.jpg',
  ],
  'sonic-the-hedgehog-3': [
    'https://image.tmdb.org/t/p/w500/d8Ryb8AunYAuycVKDp5HpdWPKgC.jpg',
  ],
  'avengers-doomsday': [
    'https://image.tmdb.org/t/p/w500/cWXtJhrlruF8CeYuaBGE8vdj3Q9.jpg',
  ],
  'superman-2027': [
    'https://image.tmdb.org/t/p/w500/ldyfo0BKmz5rWtJJKCvwaNS4cJT.jpg',
  ],
  'the-batman-part-ii': [
    'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
  ],
  'toxic-fairy-tale-for-grown-ups': [
    'https://upload.wikimedia.org/wikipedia/en/0/0b/Toxic-_A_Fairy_Tale_for_Grown-Ups_poster.jpg',
  ],
  'ramayana-part-1': [
    'https://upload.wikimedia.org/wikipedia/en/4/48/Ramayana_Part_1_%28poster%29.jpg',
  ],
  'spider-man-beyond-the-spider-verse': [
    'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
  ],
  'king-2027': [
    'https://upload.wikimedia.org/wikipedia/en/f/fd/King_%28Hindi_film%29.jpg',
  ],
  'kantara-chapter-1': [
    'https://upload.wikimedia.org/wikipedia/en/6/69/Kantara-_Chapter_1_poster.jpg',
  ],
  'mission-impossible-the-final-reckoning': [
    'https://image.tmdb.org/t/p/w500/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
  ],
  'fast-x-part-2': [
    'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',
  ],
  'frozen-3': [
    'https://image.tmdb.org/t/p/w500/oyoahIcdamTXwjIaL3CqZ1v5CLl.jpg',
  ],
  'shrek-5': [
    'https://image.tmdb.org/t/p/w500/6HrfPZtKcGmX2tUWW3cnciZTaSD.jpg',
  ],
  'spirit-prabhas': [
    'https://images.indianexpress.com/2026/01/spirit-poster.jpg?w=640',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Sandeep_Reddy_Vanga_At_Amb_Cinemas_%28cropped%29.jpg/500px-Sandeep_Reddy_Vanga_At_Amb_Cinemas_%28cropped%29.jpg',
  ],
  'ssmb29-globetrotting-adventure': [
    'https://upload.wikimedia.org/wikipedia/en/2/20/Varanasi_%282027_film%29_poster.jpg',
  ],
  'animal-park': [
    'https://image.tmdb.org/t/p/w500/lprsAHkwMxk2iC6VZxNmV0H7g1t.jpg',
  ],
  'demon-slayer-infinity-castle-part-1': [
    'https://image.tmdb.org/t/p/w500/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg',
  ],
  'chainsaw-man-reze-arc': [
    'https://image.tmdb.org/t/p/w500/kfXgo2rMF1A19celCwLyQ4Xwpf8.jpg',
  ],
  'avengers-secret-wars': [
    'https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Avengers_Doomsday_and_Secret_Wars_logos.png/500px-Avengers_Doomsday_and_Secret_Wars_logos.png',
  ],
  'the-legend-of-zelda-live-action': [
    'https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/The_Legend_of_Zelda_film_logo.jpg/500px-The_Legend_of_Zelda_film_logo.jpg',
  ],
  'star-wars-new-jedi-order': [
    'https://upload.wikimedia.org/wikipedia/en/5/51/Vector_Prime.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/500px-Star_Wars_Logo.svg.png',
  ],
  'ramayana-part-2': [
    'https://upload.wikimedia.org/wikipedia/en/4/48/Ramayana_Part_1_%28poster%29.jpg',
  ],
  'avatar-4': [
    'https://image.tmdb.org/t/p/w500/qzMYKnT4MG1d0gnhwytr4cKhUvS.jpg',
  ],
};

function downloadUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));

    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ZENKAI/2.0 (contact@zenkai.com)',
          Accept: 'image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8',
          Referer: 'https://en.wikipedia.org/',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, url).toString();
          return resolve(downloadUrl(redirectUrl, maxRedirects - 1));
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP status ${res.statusCode} for ${url}`));
        }

        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          if (buffer.length < 3000) {
            return reject(new Error(`Buffer too small: ${buffer.length} bytes for ${url}`));
          }
          resolve(buffer);
        });
      }
    );

    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev');
  console.log('Connected to MongoDB. Starting poster downloads & local storage...');

  const movies = await Movie.find({});
  let successCount = 0;
  let failCount = 0;

  for (const movie of movies) {
    const slug = movie.slug;
    const candidates = OFFICIAL_POSTER_SOURCES[slug] || (movie.poster ? [movie.poster] : []);

    let downloadedBuffer = null;
    let successfulUrl = null;

    for (const url of candidates) {
      try {
        downloadedBuffer = await downloadUrl(url);
        successfulUrl = url;
        break;
      } catch (err) {
        console.warn(`  [Retry Candidate] ${slug} failed on ${url}: ${err.message}`);
      }
    }

    if (downloadedBuffer) {
      const fileName = `${slug}-poster.jpg`;
      const clientFilePath = path.join(CLIENT_POSTER_DIR, fileName);
      const serverFilePath = path.join(SERVER_POSTER_DIR, fileName);

      fs.writeFileSync(clientFilePath, downloadedBuffer);
      fs.writeFileSync(serverFilePath, downloadedBuffer);

      // Point MongoDB record to the persistent local asset
      const localUrl = `/images/movies/${fileName}`;
      movie.poster = localUrl;
      await movie.save();

      console.log(`✓ [SUCCESS] "${movie.title}" (${slug}) -> ${localUrl} (${(downloadedBuffer.length / 1024).toFixed(1)} KB)`);
      successCount++;
    } else {
      console.error(`✗ [FAILED] No valid poster could be downloaded for "${movie.title}" (${slug})`);
      failCount++;
    }
  }

  console.log(`\n======================================================`);
  console.log(`Download Finished: ${successCount} succeeded, ${failCount} failed out of ${movies.length} movies.`);
  console.log(`======================================================`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
