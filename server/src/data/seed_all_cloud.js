import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../server/.env') });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev';

console.log('====================================================');
console.log('🚀 ZENKAI Full-Stack Cloud Database Seeder');
console.log(`📡 Target MongoDB: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
console.log('====================================================\n');

try {
  // 1. Seed base users, reviews, initial movies
  console.log('📦 [1/3] Seeding Admin/User Accounts & Core Catalog...');
  execSync(`node "${path.join(__dirname, 'seed.js')}"`, {
    stdio: 'inherit',
    env: { ...process.env, MONGODB_URI: MONGO_URI }
  });

  // 2. Seed 26 genuine upcoming blockbusters with showtimes
  console.log('\n📦 [2/3] Seeding 26 Genuine Upcoming Theatrical Releases & Showtimes...');
  execSync(`node "${path.join(__dirname, 'seed_genuine_upcoming.js')}"`, {
    stdio: 'inherit',
    env: { ...process.env, MONGODB_URI: MONGO_URI }
  });

  // 3. Seed verified official artists, concerts & update movie artwork
  console.log('\n📦 [3/3] Seeding Verified Artists, Live Concerts & Official Movie Posters...');
  execSync(`node "${path.join(__dirname, 'seed_verified_content.js')}"`, {
    stdio: 'inherit',
    env: { ...process.env, MONGODB_URI: MONGO_URI }
  });

  // 4. Verify Final Collection Counts
  console.log('\n🔍 Verifying Database Records...');
  await mongoose.connect(MONGO_URI);
  const collections = await mongoose.connection.db.listCollections().toArray();
  const summary = [];
  for (const c of collections) {
    const count = await mongoose.connection.db.collection(c.name).countDocuments();
    summary.push({ Collection: c.name, TotalDocuments: count });
  }
  console.table(summary);
  await mongoose.disconnect();

  console.log('\n✅ All ZENKAI database collections successfully seeded and verified!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Seeding failed:', error.message);
  process.exit(1);
}
