import fs from 'fs';

const avatars = JSON.parse(fs.readFileSync('c:/Users/Anurag Singh/Videos/Mocktail/server/src/data/verified_avatars.json', 'utf8'));

// High quality verified posters and backdrops
const movieMedia = {
  'oppenheimer': {
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Academy Award-winning British-American filmmaker acclaimed for his complex storytelling, grand practical visual effects, and philosophical depth.',
  },
  'dune-part-two': {
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Acclaimed Canadian director renowned for ambitious, visionary, and visually breathtaking science fiction and drama masterworks.',
  },
  'jawan': {
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg',
    backdrop: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Celebrated Indian film director and screenwriter known for delivering colossal high-octane commercial action spectacles.',
  },
  '12th-fail': {
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg',
    backdrop: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'National Award-winning Indian director, producer, and screenwriter celebrated for authentic, heartfelt human storytelling.',
  },
  'stree-2': {
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Stree_2.jpg',
    backdrop: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Leading contemporary director who pioneered the blockbuster horror-comedy universe in Indian cinema.',
  },
  'rrr': {
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg',
    backdrop: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Visionary Indian auteur whose kinetic visual grandeur and emotional epics have garnered global acclaim and Academy recognition.',
  },
  'kantara': {
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Versatile Kannada filmmaker and actor celebrated for bringing indigenous folklore and divine Bootha Kola rituals to worldwide audiences.',
  },
  'spirited-away': {
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png',
    backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Legendary Japanese animator, director, and Studio Ghibli co-founder considered one of the greatest animation auteurs in history.',
  },
  'suzume': {
    poster: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Renowned modern anime filmmaker acclaimed for evocative themes of connection, memory, and breathtaking celestial landscapes.',
  },
  'avatar-fire-and-ash': {
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/95/Avatar_Fire_and_Ash_poster.jpeg',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Pioneering Oscar-winning director known for revolutionizing cinematic technology, underwater exploration, and world-building.',
  },
  'kalki-2898-ad-part-2': {
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    directorBio: 'Ambitious visionary Indian filmmaker seamlessly blending ancient Hindu mythology with futuristic dystopian sci-fi cyberpunk worlds.',
  },
  'spider-man-across-the-spider-verse': {
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    directorBio: 'Celebrated creative trio pushing the visual boundaries of comic book artistry and multidisciplinary animation.',
  }
};

// Cities list helper
import { fileURLToPath } from 'url';
const showtimesCode = fs.readFileSync('c:/Users/Anurag Singh/Videos/Mocktail/server/src/data/showtimes_helper.js', 'utf8');

console.log('Build clean seed script ready.');
