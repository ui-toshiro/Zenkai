import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from '../models/Movie.js';
import Artist from '../models/Artist.js';
import MusicEvent from '../models/MusicEvent.js';
import { syncMoviePosters, syncArtistPictures } from '../services/mediaSyncService.js';
import {
  VERIFIED_MOVIE_MEDIA,
  VERIFIED_ARTISTS,
  VERIFIED_CONCERTS,
} from './verified_media_dataset.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../server/.env') });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev';

async function seedVerifiedContent() {
  try {
    console.log('🚀 Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // 1. Update Movie Posters & Backdrops with verified official media and TMDB sync
    console.log('\n--- 1. Synchronizing Movie Posters with TMDB & Verified Studio Artwork ---');
    const movieSyncResult = await syncMoviePosters();
    console.log(`✓ Successfully updated ${movieSyncResult.updatedCount}/${movieSyncResult.total} movies with unique official posters!`);

    // 2. Upsert Artists
    console.log('\n--- 2. Seeding Verified Artists Catalog ---');
    await Artist.deleteMany({});
    const createdArtists = await Artist.insertMany(VERIFIED_ARTISTS);
    console.log(`✓ Inserted ${createdArtists.length} verified artists across Indian, International, Bands, DJs & Indie!`);

    // Synchronize artist pictures from TMDB / Wikipedia REST
    console.log('\n--- 2b. Synchronizing Artist Profile Photographs ---');
    const artistSyncResult = await syncArtistPictures();
    console.log(`✓ Successfully enriched ${artistSyncResult.updatedCount}/${artistSyncResult.total} artists with authentic profile photographs!`);

    const artistMap = new Map();
    for (const a of createdArtists) {
      artistMap.set(a.slug, a._id);
    }

    // 3. Upsert Concerts & Music Events
    console.log('\n--- 3. Seeding Real Upcoming Concerts & Music Festivals ---');
    await MusicEvent.deleteMany({});

    const formattedEvents = VERIFIED_CONCERTS.map((ev) => {
      const artistId = artistMap.get(ev.artistSlug);
      return {
        ...ev,
        artist: artistId || createdArtists[0]._id,
        performingArtists: [
          {
            name: ev.artistName,
            role: 'Headline Performer',
            artistRef: artistId || createdArtists[0]._id,
            image: ev.poster,
          },
        ],
      };
    });

    const createdEvents = await MusicEvent.insertMany(formattedEvents);
    console.log(`✓ Inserted ${createdEvents.length} real upcoming concerts with verified ticket prices and booking links!`);

    // 4. Verification Check
    console.log('\n--- VERIFICATION CHECKS ---');
    const totalMovies = await Movie.countDocuments({});
    const totalArtists = await Artist.countDocuments({});
    const totalEvents = await MusicEvent.countDocuments({});
    const upcomingEvents = await MusicEvent.countDocuments({
      eventDate: { $gte: new Date() },
      status: { $nin: ['past', 'cancelled'] },
    });

    console.table([
      { Entity: 'Movies', TotalRecords: totalMovies, Status: 'Verified Posters' },
      { Entity: 'Artists', TotalRecords: totalArtists, Status: 'Official Profiles' },
      { Entity: 'Music Events', TotalRecords: totalEvents, Status: `${upcomingEvents} Future Dates` },
    ]);

    await mongoose.disconnect();
    console.log('\n✅ Verified Content Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedVerifiedContent();
