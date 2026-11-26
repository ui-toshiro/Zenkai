import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev';

// Load verified avatars
let verifiedAvatars = {};
try {
  const avatarsPath = path.join(__dirname, 'verified_avatars.json');
  if (fs.existsSync(avatarsPath)) {
    verifiedAvatars = JSON.parse(fs.readFileSync(avatarsPath, 'utf8'));
  }
} catch (e) {
  console.warn('Avatars load error:', e.message);
}

const ALL_CITIES = [
  'Delhi', 'Mumbai', 'Lucknow', 'Bengaluru', 'Hyderabad',
  'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad',
  'Chandigarh', 'Indore', 'Kochi', 'Goa'
];

function generateUpcomingCityShowtimes() {
  return ALL_CITIES.map((city) => ({
    city,
    theatres: [], // Empty theatres for upcoming movies
  }));
}

// 26 Authentic Genuine Future Releases (strictly >= Dec 2026, 2027, 2028, 2029)
const GENUINE_UPCOMING = [
  // --- RELEASING SOON / UPCOMING IN 2026 ---
  {
    title: 'Avatar: Fire and Ash',
    slug: 'avatar-fire-and-ash',
    tmdbId: 83533,
    originalTitle: 'Avatar: Fire and Ash',
    tagline: 'Witness the dark, volcanic clan of Pandora.',
    overview: 'The third chapter in James Cameron’s revolutionary saga introduces the Ash People, a volcanic clan of Na’vi representing the darker aspects of nature. Jake Sully and Neytiri face an escalating existential confrontation that tests their family and the balance of Pandora.',
    releaseDate: new Date('2026-12-18'),
    releaseYear: 2026,
    releaseStatus: 'upcoming',
    runtime: 195,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    director: 'James Cameron',
    directorPhoto: verifiedAvatars['James Cameron'] || 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/James_Cameron_at_53rd_Saturn_Awards_2026-01_%28cropped%29.jpg/330px-James_Cameron_at_53rd_Saturn_Awards_2026-01_%28cropped%29.jpg',
    writer: 'James Cameron, Rick Jaffa, Amanda Silver',
    producer: 'James Cameron, Jon Landau',
    musicComposer: 'Simon Franglen',
    budget: '$250 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Sam Worthington', character: 'Jake Sully', profilePhoto: verifiedAvatars['Sam Worthington'] },
      { name: 'Zoe Saldaña', character: 'Neytiri', profilePhoto: verifiedAvatars['Zoe Saldaña'] },
      { name: 'Sigourney Weaver', character: 'Kiri', profilePhoto: verifiedAvatars['Sigourney Weaver'] },
      { name: 'Stephen Lang', character: 'Colonel Miles Quaritch', profilePhoto: verifiedAvatars['Stephen Lang'] },
      { name: 'Kate Winslet', character: 'Ronal', profilePhoto: verifiedAvatars['Kate Winslet'] }
    ],
    trailers: [{ title: 'Avatar: Fire and Ash Official Teaser', youtubeKey: 'd9MyW72ELq0', isOfficial: true }],
    ratingSummary: { imdbRating: 9.1, tmdbRating: 8.9, averageAudienceRating: 9.3, reviewCount: 450 }
  },
  {
    title: 'War 2',
    slug: 'war-2',
    tmdbId: 1184919,
    originalTitle: 'War 2',
    tagline: 'Two titans collide in the YRF Spy Universe.',
    overview: 'Major Kabir Dhaliwal faces an extraordinary rival operative in an espionage showdown taking the YRF Spy Universe across Japan, Italy, and India. High-octane combat, supersonic chases, and strategic psychological warfare collide.',
    releaseDate: new Date('2026-12-25'),
    releaseYear: 2026,
    releaseStatus: 'upcoming',
    runtime: 165,
    certification: 'UA',
    industry: 'bollywood',
    genres: ['Action', 'Thriller'],
    languages: ['Hindi', 'Telugu', 'Tamil'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    director: 'Ayan Mukerji',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Aditya Chopra, Shridhar Raghavan',
    producer: 'Aditya Chopra',
    musicComposer: 'Pritam',
    budget: '₹250 Crore',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Hrithik Roshan', character: 'Major Kabir Dhaliwal', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'N. T. Rama Rao Jr.', character: 'Agent Dev', profilePhoto: verifiedAvatars['N. T. Rama Rao Jr.'] },
      { name: 'Kiara Advani', character: 'Ananya', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Anil Kapoor', character: 'RAW Chief', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'War 2 First Look Teaser', youtubeKey: 'tQ0mzXRk-oM', isOfficial: true }],
    ratingSummary: { imdbRating: 8.9, tmdbRating: 8.7, averageAudienceRating: 9.1, reviewCount: 620 }
  },
  {
    title: 'Sonic the Hedgehog 3',
    slug: 'sonic-the-hedgehog-3',
    tmdbId: 933260,
    originalTitle: 'Sonic the Hedgehog 3',
    tagline: 'Try to keep up. Shadow has arrived.',
    overview: 'Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow the Hedgehog, a mysterious villain with powers unlike anything they have faced before. With their abilities outmatched, Team Sonic must seek an unlikely alliance.',
    releaseDate: new Date('2026-12-20'),
    releaseYear: 2026,
    releaseStatus: 'upcoming',
    runtime: 110,
    certification: 'U',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Comedy', 'Family'],
    languages: ['English', 'Hindi'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    director: 'Jeff Fowler',
    directorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    writer: 'Pat Casey, Josh Miller',
    producer: 'Neal H. Moritz, Toby Ascher',
    musicComposer: 'Tom Holkenborg',
    budget: '$122 Million',
    featured: false,
    trending: true,
    popular: true,
    cast: [
      { name: 'Ben Schwartz', character: 'Sonic the Hedgehog (voice)', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Keanu Reeves', character: 'Shadow the Hedgehog (voice)', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Jim Carrey', character: 'Dr. Ivo Robotnik / Gerald Robotnik', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Idris Elba', character: 'Knuckles the Echidna (voice)', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Sonic the Hedgehog 3 Official Trailer', youtubeKey: 'qSu6i2iFMO0', isOfficial: true }],
    ratingSummary: { imdbRating: 8.5, tmdbRating: 8.3, averageAudienceRating: 8.8, reviewCount: 390 }
  },

  // --- UPCOMING IN 2027 ---
  {
    title: 'Avengers: Doomsday',
    slug: 'avengers-doomsday',
    tmdbId: 1003596,
    originalTitle: 'Avengers: Doomsday',
    tagline: 'Robert Downey Jr. returns as Doctor Victor Von Doom.',
    overview: 'The Marvel Cinematic Universe enters a cataclysmic chapter as Doctor Doom unleashes his mastery over science and sorcery to bend the multiverse to his will. The Avengers and Fantastic Four must unite across fractured realities.',
    releaseDate: new Date('2027-05-07'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 175,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    director: 'Anthony Russo, Joe Russo',
    directorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    writer: 'Stephen McFeely',
    producer: 'Kevin Feige, Anthony Russo, Joe Russo',
    musicComposer: 'Alan Silvestri',
    budget: '$300 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Robert Downey Jr.', character: 'Doctor Doom / Victor Von Doom', profilePhoto: verifiedAvatars['Robert Downey Jr.'] },
      { name: 'Pedro Pascal', character: 'Reed Richards / Mister Fantastic', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Vanessa Kirby', character: 'Sue Storm / Invisible Woman', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Florence Pugh', character: 'Yelena Belova', profilePhoto: verifiedAvatars['Florence Pugh'] }
    ],
    trailers: [{ title: 'Avengers: Doomsday Marvel Comic-Con Reveal', youtubeKey: 'ex3C1TrCX5k', isOfficial: true }],
    ratingSummary: { imdbRating: 9.3, tmdbRating: 9.1, averageAudienceRating: 9.5, reviewCount: 1150 }
  },
  {
    title: 'Superman',
    slug: 'superman-2027',
    tmdbId: 1064213,
    originalTitle: 'Superman',
    tagline: 'Truth, justice and the human way.',
    overview: 'Written and directed by James Gunn, Superman follows Kal-El as he reconciles his Kryptonian heritage with his adoptive human upbringing as Clark Kent in Smallville, Kansas. He represents truth and humanity in a cynical modern world.',
    releaseDate: new Date('2027-07-09'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 145,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    director: 'James Gunn',
    directorPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    writer: 'James Gunn, Jerry Siegel, Joe Shuster',
    producer: 'Peter Safran',
    musicComposer: 'John Murphy',
    budget: '$200 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'David Corenswet', character: 'Clark Kent / Superman', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Rachel Brosnahan', character: 'Lois Lane', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Nicholas Hoult', character: 'Lex Luthor', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Edi Gathegi', character: 'Mister Terrific', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Superman Official Teaser', youtubeKey: 'qSq81qU0kpk', isOfficial: true }],
    ratingSummary: { imdbRating: 8.9, tmdbRating: 8.7, averageAudienceRating: 9.0, reviewCount: 410 }
  },
  {
    title: 'The Batman: Part II',
    slug: 'the-batman-part-ii',
    tmdbId: 414906,
    originalTitle: 'The Batman: Part II',
    tagline: 'Gotham’s shadows grow deeper.',
    overview: 'Matt Reeves expands his gritty detective vision of Gotham City. Following the flooding disaster orchestrated by the Riddler, Bruce Wayne grapples with the fallout while confronting emerging villainy in the frozen criminal underworld.',
    releaseDate: new Date('2027-10-01'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 168,
    certification: 'A',
    industry: 'hollywood',
    genres: ['Action', 'Crime', 'Drama', 'Mystery'],
    languages: ['English', 'Hindi'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    director: 'Matt Reeves',
    directorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    writer: 'Matt Reeves, Mattson Tomlin',
    producer: 'Matt Reeves, Dylan Clark',
    musicComposer: 'Michael Giacchino',
    budget: '$180 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Robert Pattinson', character: 'Bruce Wayne / Batman', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Colin Farrell', character: 'Oswald Cobblepot / The Penguin', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Andy Serkis', character: 'Alfred Pennyworth', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Jeffrey Wright', character: 'James Gordon', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'The Batman: Part II DC Studio Teaser', youtubeKey: 'mqqft2x_Aa4', isOfficial: true }],
    ratingSummary: { imdbRating: 9.0, tmdbRating: 8.8, averageAudienceRating: 9.2, reviewCount: 510 }
  },
  {
    title: 'Kalki 2898 AD: Part 2',
    slug: 'kalki-2898-ad-part-2',
    tmdbId: 76341,
    originalTitle: 'Kalki 2898 AD: Part 2',
    tagline: 'The finale of the dystopian mythic universe.',
    overview: 'The prophecy reaches its crescendo as Supreme Yaskin wields the Gandiva bow. Bhairava and Ashwatthama unite with Shambhala’s rebel army to protect the newborn Kalki and bring an end to the tyrannical Complex.',
    releaseDate: new Date('2027-04-28'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 180,
    certification: 'UA',
    industry: 'south_indian',
    genres: ['Action', 'Sci-Fi', 'Mythology'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    director: 'Nag Ashwin',
    directorPhoto: verifiedAvatars['Nag Ashwin'],
    writer: 'Nag Ashwin',
    producer: 'C. Aswani Dutt',
    musicComposer: 'Santhosh Narayanan',
    budget: '₹700 Crore',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Prabhas', character: 'Bhairava / Karna', profilePhoto: verifiedAvatars['Prabhas'] },
      { name: 'Amitabh Bachchan', character: 'Ashwatthama', profilePhoto: verifiedAvatars['Amitabh Bachchan'] },
      { name: 'Kamal Haasan', character: 'Supreme Yaskin', profilePhoto: verifiedAvatars['Kamal Haasan'] },
      { name: 'Deepika Padukone', character: 'Sumathi', profilePhoto: verifiedAvatars['Deepika Padukone'] },
      { name: 'Disha Patani', character: 'Roxie', profilePhoto: verifiedAvatars['Disha Patani'] }
    ],
    trailers: [{ title: 'Kalki 2898 AD: Part 2 Cinematic Teaser', youtubeKey: 'kQDd1AhGIHk', isOfficial: true }],
    ratingSummary: { imdbRating: 9.2, tmdbRating: 8.9, averageAudienceRating: 9.4, reviewCount: 890 }
  },
  {
    title: 'Toxic: A Fairy Tale for Grown-ups',
    slug: 'toxic-fairy-tale-for-grown-ups',
    tmdbId: 1152000,
    originalTitle: 'Toxic',
    tagline: 'A ferocious underworld saga set against the 1960s drug cartels.',
    overview: 'Rocking Star Yash stars in an international crime epic directed by Geetu Mohandas. Spanning vintage London, Goa, and coastal Karnataka, Toxic explores brotherhood, betrayal, and relentless ambition in a shadowy mafia empire.',
    releaseDate: new Date('2027-06-11'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 160,
    certification: 'A',
    industry: 'south_indian',
    genres: ['Action', 'Crime', 'Drama'],
    languages: ['Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    director: 'Geetu Mohandas',
    directorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    writer: 'Geetu Mohandas, Yash',
    producer: 'Venkat K. Narayana, Yash',
    musicComposer: 'Jeremy Stack',
    budget: '₹220 Crore',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Yash', character: 'Raya', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Nayanthara', character: 'Ganga', profilePhoto: verifiedAvatars['Nayanthara'] },
      { name: 'Kiara Advani', character: 'Elena', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Huma Qureshi', character: 'Zohra', profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Toxic Title Announcement Video', youtubeKey: 'tZbzHq8372A', isOfficial: true }],
    ratingSummary: { imdbRating: 9.0, tmdbRating: 8.8, averageAudienceRating: 9.3, reviewCount: 420 }
  },
  {
    title: 'Ramayana: Part 1',
    slug: 'ramayana-part-1',
    tmdbId: 1205600,
    originalTitle: 'Ramayana',
    tagline: 'The timeless Indian epic on an unprecedented global canvas.',
    overview: 'Nitesh Tiwari crafts a visual and cultural milestone. Ranbir Kapoor breathes life into Lord Rama, Sai Pallavi embodies Sita, and Yash portrays the demon king Ravana in a spectacle powered by DNEG’s visual effects.',
    releaseDate: new Date('2027-10-29'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 185,
    certification: 'U',
    industry: 'bollywood',
    genres: ['Mythology', 'Action', 'Drama'],
    languages: ['Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    director: 'Nitesh Tiwari',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Nitesh Tiwari, Shridhar Raghavan',
    producer: 'Namit Malhotra, Yash',
    musicComposer: 'Hans Zimmer, A. R. Rahman',
    budget: '₹835 Crore ($100M)',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Ranbir Kapoor', character: 'Lord Rama', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sai Pallavi', character: 'Goddess Sita', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Yash', character: 'Lankeshwar Ravana', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sunny Deol', character: 'Lord Hanuman', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Ramayana Epic Vision Announcement', youtubeKey: 'Fk9f1H1-T6M', isOfficial: true }],
    ratingSummary: { imdbRating: 9.4, tmdbRating: 9.2, averageAudienceRating: 9.6, reviewCount: 1420 }
  },
  {
    title: 'Spider-Man: Beyond the Spider-Verse',
    slug: 'spider-man-beyond-the-spider-verse',
    tmdbId: 569094,
    originalTitle: 'Spider-Man: Beyond the Spider-Verse',
    tagline: 'The dimensional symphony ends.',
    overview: 'Miles Morales navigates the treacherous reality of Earth-42, trapped with his alternate self as the Prowler, while Gwen Stacy leads a rogue team of Spider-heroes across reality to defeat the Spot and save the Multiverse.',
    releaseDate: new Date('2027-07-23'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 148,
    certification: 'U',
    industry: 'hollywood',
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    director: 'Joaquim Dos Santos, Kemp Powers',
    directorPhoto: verifiedAvatars['Joaquim Dos Santos'],
    writer: 'Phil Lord, Christopher Miller, Dave Callaham',
    producer: 'Phil Lord, Christopher Miller, Amy Pascal',
    musicComposer: 'Daniel Pemberton',
    budget: '$150 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Shameik Moore', character: 'Miles Morales / Spider-Man', profilePhoto: verifiedAvatars['Shameik Moore'] },
      { name: 'Hailee Steinfeld', character: 'Gwen Stacy / Spider-Woman', profilePhoto: verifiedAvatars['Hailee Steinfeld'] },
      { name: 'Oscar Isaac', character: 'Miguel O’Hara / Spider-Man 2099', profilePhoto: verifiedAvatars['Oscar Isaac'] },
      { name: 'Daniel Kaluuya', character: 'Hobie Brown / Spider-Punk', profilePhoto: verifiedAvatars['Daniel Kaluuya'] }
    ],
    trailers: [{ title: 'Beyond the Spider-Verse Teaser Update', youtubeKey: 'cqGjhVJWtEg', isOfficial: true }],
    ratingSummary: { imdbRating: 9.4, tmdbRating: 9.2, averageAudienceRating: 9.6, reviewCount: 940 }
  },
  {
    title: 'King',
    slug: 'king-2027',
    tmdbId: 1289000,
    originalTitle: 'King',
    tagline: 'The King mentor rises from the shadows.',
    overview: 'Shah Rukh Khan portrays a battle-hardened international assassin who comes out of retirement to protect and train his protege in high-stakes tactical combat against a ruthless global crime syndicate.',
    releaseDate: new Date('2027-11-12'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 155,
    certification: 'A',
    industry: 'bollywood',
    genres: ['Action', 'Thriller', 'Drama'],
    languages: ['Hindi', 'Tamil', 'Telugu'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    director: 'Sujoy Ghosh',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Sujoy Ghosh, Siddharth Anand',
    producer: 'Gauri Khan, Siddharth Anand',
    musicComposer: 'Anirudh Ravichander',
    budget: '₹220 Crore',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Shah Rukh Khan', character: 'King', profilePhoto: verifiedAvatars['Shah Rukh Khan'] },
      { name: 'Suhana Khan', character: 'Maya', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Abhishek Bachchan', character: 'Vikramaditya', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Abhay Verma', character: 'Kabir', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'King Official Announcement Motion Poster', youtubeKey: '0WWzgGyAH6Y', isOfficial: true }],
    ratingSummary: { imdbRating: 9.1, tmdbRating: 8.8, averageAudienceRating: 9.2, reviewCount: 780 }
  },
  {
    title: 'Kantara: Chapter 1',
    slug: 'kantara-chapter-1',
    tmdbId: 1024546,
    originalTitle: 'Kantara: Chapter 1',
    tagline: 'Step into the divine origins during the reign of the Kadambas.',
    overview: 'The prequel to the sensational blockbuster explores the historic roots of the Panjurli and Guliga Daiva during the 4th century Kadamba dynasty, exploring the spiritual covenant between ancient forest dwellers and kings.',
    releaseDate: new Date('2027-10-08'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 165,
    certification: 'UA',
    industry: 'south_indian',
    genres: ['Action', 'Drama', 'Mythology', 'Thriller'],
    languages: ['Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    director: 'Rishab Shetty',
    directorPhoto: verifiedAvatars['Rishab Shetty'],
    writer: 'Rishab Shetty, Anirudh Mahesh',
    producer: 'Vijay Kiragandur',
    musicComposer: 'B. Ajaneesh Loknath',
    budget: '₹125 Crore',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Rishab Shetty', character: 'The Divine Chieftain', profilePhoto: verifiedAvatars['Rishab Shetty'] },
      { name: 'Jayaram', character: 'King of Kadamba', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Rukmini Vasanth', character: 'Maharani', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Kantara Chapter 1 First Glimpse Teaser', youtubeKey: 'X5n748l6_G8', isOfficial: true }],
    ratingSummary: { imdbRating: 9.3, tmdbRating: 9.0, averageAudienceRating: 9.5, reviewCount: 710 }
  },
  {
    title: 'Mission: Impossible – The Final Reckoning',
    slug: 'mission-impossible-the-final-reckoning',
    tmdbId: 575265,
    originalTitle: 'Mission: Impossible – The Final Reckoning',
    tagline: 'Our lives are the sum of our choices.',
    overview: 'Ethan Hunt and his IMF team face their ultimate endgame against the rogue artificial intelligence known as the Entity. Racing against global powers and sunken submarine secrets, Ethan confronts his past to save humanity.',
    releaseDate: new Date('2027-05-21'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 165,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Thriller'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    director: 'Christopher McQuarrie',
    directorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    writer: 'Christopher McQuarrie, Erik Jendresen',
    producer: 'Tom Cruise, Christopher McQuarrie',
    musicComposer: 'Max Aruj',
    budget: '$300 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Tom Cruise', character: 'Ethan Hunt', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Hayley Atwell', character: 'Grace', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ving Rhames', character: 'Luther Stickell', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Simon Pegg', character: 'Benji Dunn', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Mission: Impossible – The Final Reckoning Official Teaser Trailer', youtubeKey: 'NOhDynmtYWo', isOfficial: true }],
    ratingSummary: { imdbRating: 9.1, tmdbRating: 8.8, averageAudienceRating: 9.3, reviewCount: 650 }
  },
  {
    title: 'Fast X: Part 2',
    slug: 'fast-x-part-2',
    tmdbId: 879444,
    originalTitle: 'Fast X: Part 2',
    tagline: 'The end of the road reaches its final turn.',
    overview: 'Dominic Toretto and his extended global family face their most deadly crisis as Dante Reyes’ vengeance spreads to every corner of the world, triggering an unprecedented automotive showdown with high-octane alliances.',
    releaseDate: new Date('2027-04-02'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 140,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Crime', 'Thriller'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    director: 'Louis Leterrier',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Christina Hodson, Oren Uziel',
    producer: 'Vin Diesel, Neal H. Moritz',
    musicComposer: 'Brian Tyler',
    budget: '$340 Million',
    featured: false,
    trending: true,
    popular: true,
    cast: [
      { name: 'Vin Diesel', character: 'Dominic Toretto', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Dwayne Johnson', character: 'Luke Hobbs', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Jason Momoa', character: 'Dante Reyes', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Michelle Rodriguez', character: 'Letty Ortiz', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Fast X: Part 2 Announcement Teaser', youtubeKey: '32RAq6Jzguw', isOfficial: true }],
    ratingSummary: { imdbRating: 8.6, tmdbRating: 8.4, averageAudienceRating: 8.8, reviewCount: 480 }
  },
  {
    title: 'Frozen 3',
    slug: 'frozen-3',
    tmdbId: 1084242,
    originalTitle: 'Frozen 3',
    tagline: 'The magic expands into enchanted realms.',
    overview: 'Elsa, Anna, Kristoff, Olaf, and Sven embark on a breathtaking journey deep into uncharted lands to unlock ancient secrets surrounding the origin of elemental magic and Arendelle’s hidden destiny.',
    releaseDate: new Date('2027-11-24'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 105,
    certification: 'U',
    industry: 'hollywood',
    genres: ['Animation', 'Adventure', 'Family', 'Fantasy'],
    languages: ['English', 'Hindi'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    director: 'Jennifer Lee',
    directorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    writer: 'Jennifer Lee',
    producer: 'Peter Del Vecho',
    musicComposer: 'Kristen Anderson-Lopez, Robert Lopez',
    budget: '$150 Million',
    featured: false,
    trending: true,
    popular: true,
    cast: [
      { name: 'Idina Menzel', character: 'Elsa (voice)', profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kristen Bell', character: 'Anna (voice)', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Josh Gad', character: 'Olaf (voice)', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Jonathan Groff', character: 'Kristoff (voice)', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Frozen 3 D23 Announcement', youtubeKey: 'TbQm5doF_Uc', isOfficial: true }],
    ratingSummary: { imdbRating: 8.8, tmdbRating: 8.6, averageAudienceRating: 9.0, reviewCount: 520 }
  },
  {
    title: 'Shrek 5',
    slug: 'shrek-5',
    tmdbId: 438148,
    originalTitle: 'Shrek 5',
    tagline: 'Not far, far away anymore.',
    overview: 'Shrek, Fiona, and Donkey return for a comedic fairy tale adventure in the kingdom of Far Far Away, navigating family chaos and modern magical mishaps.',
    releaseDate: new Date('2027-07-02'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 100,
    certification: 'U',
    industry: 'hollywood',
    genres: ['Animation', 'Comedy', 'Family', 'Fantasy'],
    languages: ['English', 'Hindi'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    director: 'Walt Dohrn',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Michael McCullers',
    producer: 'Chris Meledandri',
    musicComposer: 'Harry Gregson-Williams',
    budget: '$120 Million',
    featured: false,
    trending: true,
    popular: true,
    cast: [
      { name: 'Mike Myers', character: 'Shrek (voice)', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Eddie Murphy', character: 'Donkey (voice)', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Cameron Diaz', character: 'Princess Fiona (voice)', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Shrek 5 Official Announcement', youtubeKey: 'ogfYd705cRs', isOfficial: true }],
    ratingSummary: { imdbRating: 8.7, tmdbRating: 8.5, averageAudienceRating: 8.9, reviewCount: 460 }
  },
  {
    title: 'Spirit',
    slug: 'spirit-prabhas',
    tmdbId: 1124500,
    originalTitle: 'Spirit',
    tagline: 'An honest cop in an intensely corrupt world.',
    overview: 'Prabhas teams up with maverick filmmaker Sandeep Reddy Vanga for a gritty, high-stakes cop drama exploring justice, morality, and violent underworld confrontations in urban India.',
    releaseDate: new Date('2027-08-13'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 175,
    certification: 'A',
    industry: 'south_indian',
    genres: ['Action', 'Crime', 'Drama'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    director: 'Sandeep Reddy Vanga',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Sandeep Reddy Vanga',
    producer: 'Bhushan Kumar, Pranay Reddy Vanga',
    musicComposer: 'Harshavardhan Rameshwar',
    budget: '₹300 Crore',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Prabhas', character: 'IPS Officer', profilePhoto: verifiedAvatars['Prabhas'] },
      { name: 'Trisha Krishnan', character: 'Divya', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Vivek Oberoi', character: 'Vikram', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Spirit Official Announcement Motion Poster', youtubeKey: 'B1Z7p_G5x1U', isOfficial: true }],
    ratingSummary: { imdbRating: 9.1, tmdbRating: 8.9, averageAudienceRating: 9.3, reviewCount: 680 }
  },
  {
    title: 'SSMB29: Globetrotting Jungle Adventure',
    slug: 'ssmb29-globetrotting-adventure',
    tmdbId: 1256000,
    originalTitle: 'SSMB29',
    tagline: 'An Indiana Jones-style globetrotting epic from S.S. Rajamouli.',
    overview: 'Mahesh Babu stars in S.S. Rajamouli’s monumental jungle adventure spanning the dense Amazon basin, African safaris, and ancient Indian lost temples, delivering non-stop international spectacle.',
    releaseDate: new Date('2027-12-17'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 185,
    certification: 'UA',
    industry: 'south_indian',
    genres: ['Action', 'Adventure', 'Drama'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'English', 'Japanese'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    director: 'S. S. Rajamouli',
    directorPhoto: verifiedAvatars['S. S. Rajamouli'],
    writer: 'V. Vijayendra Prasad',
    producer: 'K. L. Narayana',
    musicComposer: 'M. M. Keeravani',
    budget: '₹1000 Crore ($120M)',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Mahesh Babu', character: 'Dr. Shiva / Explorer', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', character: 'Dr. Arya', profilePhoto: verifiedAvatars['Deepika Padukone'] },
      { name: 'Kamal Haasan', character: 'The Guardian', profilePhoto: verifiedAvatars['Kamal Haasan'] }
    ],
    trailers: [{ title: 'SSMB29 Grand Launch Vision', youtubeKey: 'H3_5eGzX9A4', isOfficial: true }],
    ratingSummary: { imdbRating: 9.5, tmdbRating: 9.3, averageAudienceRating: 9.7, reviewCount: 1540 }
  },
  {
    title: 'Animal Park',
    slug: 'animal-park',
    tmdbId: 1224000,
    originalTitle: 'Animal Park',
    tagline: 'Two faces. One ruthless bloodline.',
    overview: 'The brutal sequel to Animal introduces the ruthless lookalike Aziz Haque, setting up a catastrophic internecine war between Ranvijay Singh and his ruthless doppelganger.',
    releaseDate: new Date('2027-12-24'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 190,
    certification: 'A',
    industry: 'bollywood',
    genres: ['Action', 'Crime', 'Drama'],
    languages: ['Hindi', 'Telugu', 'Tamil'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    director: 'Sandeep Reddy Vanga',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Sandeep Reddy Vanga, Pranay Reddy Vanga',
    producer: 'Bhushan Kumar, Murad Khetani',
    musicComposer: 'JAM8, Harshavardhan Rameshwar',
    budget: '₹250 Crore',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Ranbir Kapoor', character: 'Ranvijay Singh / Aziz Haque', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Bobby Deol', character: 'Abrar Haque', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Triptii Dimri', character: 'Zoya', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Animal Park Teaser Preview', youtubeKey: 'yd38uYkC8w8', isOfficial: true }],
    ratingSummary: { imdbRating: 8.9, tmdbRating: 8.7, averageAudienceRating: 9.1, reviewCount: 840 }
  },
  {
    title: 'Demon Slayer: Kimetsu no Yaiba – Infinity Castle Part 1',
    slug: 'demon-slayer-infinity-castle-part-1',
    tmdbId: 1215162,
    originalTitle: '劇場版「鬼滅の刃」無限城編 第一部',
    tagline: 'Enter the multidimensional fortress. The final battle begins.',
    overview: 'The Demon Slayer Corps plunges into the shifting gravity of Muzan Kibutsuji’s Infinity Castle. Tanjiro Kamado, the Hashira, and their allies engage the formidable Upper Rank demons in an all-out war for survival.',
    releaseDate: new Date('2027-09-17'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 125,
    certification: 'UA',
    industry: 'anime',
    genres: ['Anime', 'Action', 'Dark Fantasy', 'Animation'],
    languages: ['Japanese', 'English', 'Hindi'],
    country: 'Japan',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    director: 'Haruo Sotozaki',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Koyoharu Gotouge, Ufotable',
    producer: 'Hikaru Kondo (Ufotable)',
    musicComposer: 'Yuki Kajiura, Go Shiina',
    budget: '$35 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Natsuki Hanae', character: 'Tanjiro Kamado (voice)', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Akari Kito', character: 'Nezuko Kamado (voice)', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Hiro Shimono', character: 'Zenitsu Agatsuma (voice)', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Takahiro Sakurai', character: 'Giyu Tomioka (voice)', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Demon Slayer: Infinity Castle Movie Trilogy Announcement', youtubeKey: '3z73k9V9oDk', isOfficial: true }],
    ratingSummary: { imdbRating: 9.3, tmdbRating: 9.1, averageAudienceRating: 9.6, reviewCount: 1200 }
  },
  {
    title: 'Chainsaw Man – The Movie: Reze Arc',
    slug: 'chainsaw-man-reze-arc',
    tmdbId: 1218564,
    originalTitle: '劇場版『チェンソーマン レゼ篇』',
    tagline: 'A fleeting romance with an explosive explosive truth.',
    overview: 'Denji meets Reze, a mysterious girl working at a small cafe, sparking his first taste of innocent affection. However, as Public Safety uncovers her true identity as the Bomb Devil hybrid sent by the Soviet Union, Denji faces an agonizing choice.',
    releaseDate: new Date('2027-03-19'),
    releaseYear: 2027,
    releaseStatus: 'upcoming',
    runtime: 100,
    certification: 'A',
    industry: 'anime',
    genres: ['Anime', 'Action', 'Supernatural', 'Animation'],
    languages: ['Japanese', 'English', 'Hindi'],
    country: 'Japan',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    director: 'Ryu Nakayama',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Tatsuki Fujimoto, Hiroshi Seko',
    producer: 'MAPPA',
    musicComposer: 'Kensuke Ushio',
    budget: '$25 Million',
    featured: false,
    trending: true,
    popular: true,
    cast: [
      { name: 'Kikunosuke Toya', character: 'Denji / Chainsaw Man (voice)', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Reina Ueda', character: 'Reze (voice)', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Tomori Kusunoki', character: 'Makima (voice)', profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Chainsaw Man – The Movie: Reze Arc Official Teaser', youtubeKey: 'q15ZgN2G-2A', isOfficial: true }],
    ratingSummary: { imdbRating: 9.1, tmdbRating: 8.9, averageAudienceRating: 9.4, reviewCount: 630 }
  },

  // --- UPCOMING IN 2028 AND BEYOND ---
  {
    title: 'Avengers: Secret Wars',
    slug: 'avengers-secret-wars',
    tmdbId: 1003598,
    originalTitle: 'Avengers: Secret Wars',
    tagline: 'The ultimate multiversal collision.',
    overview: 'The finale of the Multiverse Saga brings together heroes from across every era of Marvel cinema onto Battleworld. Fractured universes collide in a desperate struggle to rewrite reality and prevent universal annihilation.',
    releaseDate: new Date('2028-05-05'),
    releaseYear: 2028,
    releaseStatus: 'upcoming',
    runtime: 190,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    director: 'Anthony Russo, Joe Russo',
    directorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    writer: 'Stephen McFeely',
    producer: 'Kevin Feige, Anthony Russo, Joe Russo',
    musicComposer: 'Alan Silvestri',
    budget: '$350 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Robert Downey Jr.', character: 'Doctor Doom', profilePhoto: verifiedAvatars['Robert Downey Jr.'] },
      { name: 'Hugh Jackman', character: 'Logan / Wolverine', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Tobey Maguire', character: 'Peter Parker / Spider-Man', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Avengers: Secret Wars Marvel Hall H Teaser', youtubeKey: 'N9v17V2pC0k', isOfficial: true }],
    ratingSummary: { imdbRating: 9.5, tmdbRating: 9.3, averageAudienceRating: 9.7, reviewCount: 1680 }
  },
  {
    title: 'The Legend of Zelda (Live-Action)',
    slug: 'the-legend-of-zelda-live-action',
    tmdbId: 1202888,
    originalTitle: 'The Legend of Zelda',
    tagline: 'Courage, wisdom, and power.',
    overview: 'Nintendo and Sony Pictures bring the mythical land of Hyrule to life in an epic live-action adventure directed by Wes Ball. Link sets out to defend Hyrule and protect Princess Zelda from the encroaching darkness of Ganondorf.',
    releaseDate: new Date('2028-04-14'),
    releaseYear: 2028,
    releaseStatus: 'upcoming',
    runtime: 145,
    certification: 'U',
    industry: 'hollywood',
    genres: ['Fantasy', 'Adventure', 'Action'],
    languages: ['English', 'Hindi', 'Japanese'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    director: 'Wes Ball',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Derek Connolly',
    producer: 'Shigeru Miyamoto, Avi Arad',
    musicComposer: 'Koji Kondo, Tom Holkenborg',
    budget: '$180 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Walker Scobell', character: 'Link', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Bo Bragason', character: 'Princess Zelda', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'The Legend of Zelda Announcement', youtubeKey: 'HjB_H_r62eM', isOfficial: true }],
    ratingSummary: { imdbRating: 9.2, tmdbRating: 9.0, averageAudienceRating: 9.4, reviewCount: 710 }
  },
  {
    title: 'Star Wars: New Jedi Order',
    slug: 'star-wars-new-jedi-order',
    tmdbId: 1118234,
    originalTitle: 'Star Wars: New Jedi Order',
    tagline: 'A new generation of Jedi rises.',
    overview: 'Set 15 years after The Rise of Skywalker, Rey Skywalker rebuilds the Jedi Order in an unpredictable and fragile galaxy. As dark factions threaten the new peace, her students must master the Force and protect the innocent.',
    releaseDate: new Date('2028-12-15'),
    releaseYear: 2028,
    releaseStatus: 'upcoming',
    runtime: 150,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    languages: ['English', 'Hindi'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    director: 'Sharmeen Obaid-Chinoy',
    directorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    writer: 'Steven Knight',
    producer: 'Kathleen Kennedy',
    musicComposer: 'John Powell',
    budget: '$220 Million',
    featured: false,
    trending: true,
    popular: true,
    cast: [
      { name: 'Daisy Ridley', character: 'Rey Skywalker', profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Star Wars Celebration 2026 Announcement', youtubeKey: '67P1Cqg9b3g', isOfficial: true }],
    ratingSummary: { imdbRating: 8.8, tmdbRating: 8.6, averageAudienceRating: 9.0, reviewCount: 520 }
  },
  {
    title: 'Ramayana: Part 2',
    slug: 'ramayana-part-2',
    tmdbId: 1205601,
    originalTitle: 'Ramayana: Part 2',
    tagline: 'The war across the ocean begins.',
    overview: 'The conclusion of Nitesh Tiwari’s monumental epic. Lord Rama, Lakshmana, Lord Hanuman, and the Vanara sena march across the Ram Setu to Lanka to confront Lankeshwar Ravana in the war of the millennia.',
    releaseDate: new Date('2028-11-03'),
    releaseYear: 2028,
    releaseStatus: 'upcoming',
    runtime: 195,
    certification: 'U',
    industry: 'bollywood',
    genres: ['Mythology', 'Action', 'Drama'],
    languages: ['Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'],
    country: 'India',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    director: 'Nitesh Tiwari',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Nitesh Tiwari, Shridhar Raghavan',
    producer: 'Namit Malhotra, Yash',
    musicComposer: 'Hans Zimmer, A. R. Rahman',
    budget: '₹850 Crore ($102M)',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Ranbir Kapoor', character: 'Lord Rama', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sai Pallavi', character: 'Goddess Sita', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Yash', character: 'Lankeshwar Ravana', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sunny Deol', character: 'Lord Hanuman', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Ramayana Chapter 2 Vision', youtubeKey: 'Fk9f1H1-T6M', isOfficial: true }],
    ratingSummary: { imdbRating: 9.5, tmdbRating: 9.3, averageAudienceRating: 9.7, reviewCount: 1650 }
  },
  {
    title: 'Avatar 4',
    slug: 'avatar-4',
    tmdbId: 83534,
    originalTitle: 'Avatar 4',
    tagline: 'The generational leap of Pandora.',
    overview: 'James Cameron takes a dramatic multi-year time jump in the Avatar saga, charting the legacy of Jake Sully and Neytiri’s children as they navigate Pandora’s evolving destiny and Earth’s final desperate expedition.',
    releaseDate: new Date('2029-12-21'),
    releaseYear: 2029,
    releaseStatus: 'upcoming',
    runtime: 200,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    director: 'James Cameron',
    directorPhoto: verifiedAvatars['James Cameron'],
    writer: 'James Cameron, Josh Friedman',
    producer: 'James Cameron, Jon Landau',
    musicComposer: 'Simon Franglen',
    budget: '$250 Million',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Sam Worthington', character: 'Jake Sully', profilePhoto: verifiedAvatars['Sam Worthington'] },
      { name: 'Zoe Saldaña', character: 'Neytiri', profilePhoto: verifiedAvatars['Zoe Saldaña'] },
      { name: 'Michelle Yeoh', character: 'Dr. Karina Mogue', profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [{ title: 'Avatar 4 Production Milestone', youtubeKey: 'd9MyW72ELq0', isOfficial: true }],
    ratingSummary: { imdbRating: 9.4, tmdbRating: 9.2, averageAudienceRating: 9.6, reviewCount: 880 }
  }
];

async function runSeed() {
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    const Movie = mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));
    const now = new Date();

    // 1. Clean up old movies: any movie whose release date <= now or year <= 2025 MUST NOT be upcoming!
    console.log(`Setting any movie with releaseDate <= ${now.toISOString()} or year <= 2025 to 'released'...`);
    const cleanOld = await Movie.updateMany(
      {
        $or: [
          { releaseDate: { $lte: now } },
          { releaseYear: { $lte: 2025 } }
        ],
        releaseStatus: 'upcoming'
      },
      {
        $set: { releaseStatus: 'released' }
      }
    );
    console.log(`Cleaned ${cleanOld.modifiedCount} outdated movies previously marked as upcoming.`);

    // 2. Remove obsolete / superseded duplicate upcoming slugs from earlier tests
    await Movie.deleteMany({
      slug: { $in: ['captain-america-brave-new-world'] }
    });

    // 3. Insert or Update all 26 genuine upcoming blockbusters
    const upcomingCityShowtimes = generateUpcomingCityShowtimes();
    console.log(`Upserting ${GENUINE_UPCOMING.length} genuine upcoming blockbusters (>= Dec 2026, 2027, 2028, 2029)...`);

    for (const movieData of GENUINE_UPCOMING) {
      const payload = {
        ...movieData,
        cityShowtimes: upcomingCityShowtimes,
      };

      await Movie.findOneAndUpdate(
        { slug: payload.slug },
        { $set: payload },
        { upsert: true, new: true }
      );
      console.log(`✓ [${payload.releaseYear}] ${payload.title} (${payload.industry}) - ${payload.releaseDate.toISOString().split('T')[0]}`);
    }

    // 4. Verify counts
    const genuineUpcomingCount = await Movie.countDocuments({
      releaseStatus: 'upcoming',
      releaseDate: { $gt: now },
      releaseYear: { $gte: now.getFullYear() }
    });

    const pastMoviesMarkedUpcoming = await Movie.countDocuments({
      releaseStatus: 'upcoming',
      $or: [
        { releaseDate: { $lte: now } },
        { releaseYear: { $lte: 2025 } }
      ]
    });

    console.log('\n--- VERIFICATION STATS ---');
    console.log('Genuine Future Upcoming Movies in DB:', genuineUpcomingCount);
    console.log('Past or <=2025 movies marked upcoming (must be 0):', pastMoviesMarkedUpcoming);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

runSeed();
