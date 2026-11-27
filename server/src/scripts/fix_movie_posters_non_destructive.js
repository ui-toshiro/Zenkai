import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev';
const PUBLIC_MOVIES_DIR = path.resolve(__dirname, '../../public/images/movies');

const UNRELATED_UNSPLASH_IDS = [
  '1518709268805-4e9042af9f23', // castle
  '1509198397868-475647b2a1e5', // gaming controller
  '1534447677768-be436bb09401',
  '1536440136628-849c177e76a1',
  '1489599849927-2ee91cede3ba',
];

const isPlaceholderBackdrop = (url) => {
  if (!url || typeof url !== 'string') return true;
  if (UNRELATED_UNSPLASH_IDS.some((id) => url.includes(id))) return true;
  return /backdrop(1280)?\.jpg$/i.test(url) || /7w6b5C5c9c9|8ZfI6sVz2M4/i.test(url);
};

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('[Poster Repair] Connected to MongoDB');

  const movies = await Movie.find({});
  let updatedCount = 0;

  for (const m of movies) {
    const expectedLocalPoster = `/images/movies/${m.slug}-poster.jpg`;
    const localFileExists = fs.existsSync(path.join(PUBLIC_MOVIES_DIR, `${m.slug}-poster.jpg`));
    const updates = {};

    if (localFileExists && m.poster !== expectedLocalPoster) {
      updates.poster = expectedLocalPoster;
    }

    const effectivePoster = updates.poster || m.poster;
    if (localFileExists && isPlaceholderBackdrop(m.backdrop)) {
      updates.backdrop = effectivePoster;
    }

    if (Object.keys(updates).length > 0) {
      await Movie.updateOne({ _id: m._id }, { $set: updates });
      updatedCount++;
      console.log(`[Updated] ${m.title} (${m.slug}) ->`, updates);
    }
  }

  console.log(`[Poster Repair] Done. Updated ${updatedCount}/${movies.length} movies without touching any other records.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('[Poster Repair] Failed:', err);
  process.exit(1);
});
