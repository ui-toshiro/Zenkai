import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MusicEvent from '../models/MusicEvent.js';
import Artist from '../models/Artist.js';
import User from '../models/User.js';

dotenv.config();

const curatedArtists = [
  {
    name: 'Coldplay',
    slug: 'coldplay',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    genres: ['Alternative Rock', 'Pop Rock', 'Post-Britpop'],
    country: 'United Kingdom',
    bio: 'Formed in London in 1997, Coldplay is one of the world’s best-selling music acts with over 100 million albums sold worldwide. Renowned for their electrifying, visually spectacular stadium spectacles and sustainable touring initiatives.',
    monthlyListeners: '88.4M',
    isFeatured: true,
    isPopular: true,
    popularTracks: [
      { title: 'Yellow', duration: '4:29', album: 'Parachutes' },
      { title: 'Viva La Vida', duration: '4:01', album: 'Viva la Vida' },
      { title: 'Fix You', duration: '4:55', album: 'X&Y' },
      { title: 'A Sky Full of Stars', duration: '4:28', album: 'Ghost Stories' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU',
      instagram: 'https://instagram.com/coldplay',
      youtube: 'https://youtube.com/coldplay',
    },
  },
  {
    name: 'Diljit Dosanjh',
    slug: 'diljit-dosanjh',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    genres: ['Punjabi Pop', 'Bhangra', 'Hip-Hop'],
    country: 'India',
    bio: 'Global Indian superstar, singer, and actor who made history as the first Punjabi artist to perform at Coachella. His energetic stadium tours have broken attendance records across North America, Europe, Australia, and India.',
    monthlyListeners: '22.8M',
    isFeatured: true,
    isPopular: true,
    popularTracks: [
      { title: 'Lover', duration: '3:05', album: 'MoonChild Era' },
      { title: 'Born to Shine', duration: '3:33', album: 'G.O.A.T.' },
      { title: 'Naina', duration: '3:00', album: 'Crew' },
      { title: 'G.O.A.T.', duration: '3:43', album: 'G.O.A.T.' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/2FKWNmZWDBCdRs4IOfOXBh',
      instagram: 'https://instagram.com/diljitdosanjh',
      youtube: 'https://youtube.com/diljitdosanjh',
    },
  },
  {
    name: 'A.R. Rahman',
    slug: 'ar-rahman',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80',
    genres: ['Film Score', 'Sufi', 'World Fusion', 'Classical'],
    country: 'India',
    bio: 'Two-time Academy Award, two-time Grammy Award, and BAFTA winning composer, singer, and music producer. Celebrated as the "Mozart of Madras" for redefining Indian film music and symphonic world arrangements.',
    monthlyListeners: '35.1M',
    isFeatured: true,
    isPopular: true,
    popularTracks: [
      { title: 'Kun Faya Kun', duration: '7:53', album: 'Rockstar' },
      { title: 'Jai Ho', duration: '5:19', album: 'Slumdog Millionaire' },
      { title: 'Maa Tujhe Salaam', duration: '6:12', album: 'Vande Mataram' },
      { title: 'Chaiyya Chaiyya', duration: '6:54', album: 'Dil Se..' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/1mYsTxn95ij0t0f6F082Wz',
      instagram: 'https://instagram.com/arrahman',
      youtube: 'https://youtube.com/arrahman',
    },
  },
  {
    name: 'Dua Lipa',
    slug: 'dua-lipa',
    image: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
    genres: ['Dance Pop', 'Disco Pop', 'Electropop'],
    country: 'United Kingdom',
    bio: 'Global pop powerhouse and multi-Grammy winner known for critically acclaimed, disco-drenched dance floor anthems and sold-out stadium performances worldwide.',
    monthlyListeners: '74.2M',
    isFeatured: true,
    isPopular: true,
    popularTracks: [
      { title: 'Levitating', duration: '3:23', album: 'Future Nostalgia' },
      { title: 'Don’t Start Now', duration: '3:03', album: 'Future Nostalgia' },
      { title: 'Houdini', duration: '3:05', album: 'Radical Optimism' },
      { title: 'Training Season', duration: '3:29', album: 'Radical Optimism' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we',
      instagram: 'https://instagram.com/dualipa',
      youtube: 'https://youtube.com/dualipa',
    },
  },
  {
    name: 'Arijit Singh',
    slug: 'arijit-singh',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
    genres: ['Bollywood', 'Acoustic', 'Sufi', 'Pop'],
    country: 'India',
    bio: 'The defining romantic voice of contemporary Indian music and the most streamed Indian artist globally on Spotify, beloved for soul-stirring melodies and heartfelt live arena performances.',
    monthlyListeners: '43.6M',
    isFeatured: false,
    isPopular: true,
    popularTracks: [
      { title: 'Kesariya', duration: '4:28', album: 'Brahmāstra' },
      { title: 'Tum Hi Ho', duration: '4:22', album: 'Aashiqui 2' },
      { title: 'Apna Bana Le', duration: '4:21', album: 'Bhediya' },
      { title: 'Channa Mereya', duration: '4:49', album: 'Ae Dil Hai Mushkil' },
    ],
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/4YRxDV8wJFuvUnO2v1neNu',
      instagram: 'https://instagram.com/arijitsingh',
      youtube: 'https://youtube.com/arijitsingh',
    },
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev';
    await mongoose.connect(mongoUri);
    console.log(`[Seed ZENKAI Music] Connected to database: ${mongoUri}`);

    await Artist.deleteMany({});
    await MusicEvent.deleteMany({});

    const createdArtists = await Artist.insertMany(curatedArtists);
    console.log(`[Seed v2.0] Inserted ${createdArtists.length} featured artists!`);

    const coldplay = createdArtists.find((a) => a.slug === 'coldplay');
    const diljit = createdArtists.find((a) => a.slug === 'diljit-dosanjh');
    const rahman = createdArtists.find((a) => a.slug === 'ar-rahman');
    const dualipa = createdArtists.find((a) => a.slug === 'dua-lipa');
    const arijit = createdArtists.find((a) => a.slug === 'arijit-singh');

    // Future Dates relative to late 2026: December 2026 through mid 2027
    const curatedMusicEvents = [
      // 1. Coldplay: Music of the Spheres World Tour - India
      {
        title: 'Coldplay: Music of the Spheres World Tour',
        slug: 'coldplay-music-of-the-spheres-mumbai',
        eventType: 'tour',
        artist: coldplay._id,
        artistName: 'Coldplay',
        performingArtists: [
          { name: 'Coldplay', role: 'Headline Band', artistRef: coldplay._id, image: coldplay.image },
        ],
        poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
        banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80',
        description: 'Coldplay returns with their record-breaking Music of the Spheres World Tour. Expect wristband synchronized light displays, kinetic dance floors, fireworks, and an unforgettable journey through their greatest hits and latest album.',
        eventDate: new Date('2027-01-18T18:00:00Z'),
        time: '6:00 PM IST',
        venue: {
          name: 'D.Y. Patil Sports Stadium',
          address: 'Sector 7, Nerul, Navi Mumbai',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          mapUrl: 'https://maps.google.com/?q=DY+Patil+Stadium+Mumbai',
        },
        genres: ['Alternative Rock', 'Pop Rock'],
        status: 'upcoming',
        isFeatured: true,
        isPopular: true,
        isTour: true,
        isInternational: true,
        isRecentlyAnnounced: true,
        ticketPricing: [
          { category: 'Level 3 Upper Reserved', price: 4500, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Standing Floor (General Admission)', price: 6450, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Level 2 Premium Reserved', price: 9500, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'VIP Infinity Lounge Experience', price: 12500, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
        ],
        promotionalVideo: 'd020hcWA_Wg',
        gallery: [
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
        ],
        likesCount: 1240,
      },

      // 2. Diljit Dosanjh: Dil-Luminati India Tour
      {
        title: 'Diljit Dosanjh: Dil-Luminati India Tour',
        slug: 'diljit-dosanjh-dil-luminati-delhi',
        eventType: 'tour',
        artist: diljit._id,
        artistName: 'Diljit Dosanjh',
        performingArtists: [
          { name: 'Diljit Dosanjh', role: 'Headline Artist', artistRef: diljit._id, image: diljit.image },
        ],
        poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
        banner: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
        description: 'The monumental Dil-Luminati Tour arrives in the capital city! Experience unmatched Punjabi charisma, high-energy live band choreography, and a stadium celebration filled with roaring anthems.',
        eventDate: new Date('2027-02-15T18:30:00Z'),
        time: '6:30 PM IST',
        venue: {
          name: 'Jawaharlal Nehru Stadium',
          address: 'Pragati Vihar',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          mapUrl: 'https://maps.google.com/?q=JLN+Stadium+Delhi',
        },
        genres: ['Punjabi Pop', 'Hip-Hop', 'Bhangra'],
        status: 'upcoming',
        isFeatured: true,
        isPopular: true,
        isTour: true,
        isInternational: false,
        isRecentlyAnnounced: true,
        ticketPricing: [
          { category: 'Silver Stand Entry', price: 2499, currency: '₹', isAvailable: true, bookingUrl: 'https://www.zomato.com/live' },
          { category: 'Gold Circle Standing', price: 4999, currency: '₹', isAvailable: true, bookingUrl: 'https://www.zomato.com/live' },
          { category: 'Fan Pit (Stage Front Access)', price: 9999, currency: '₹', isAvailable: true, bookingUrl: 'https://www.zomato.com/live' },
        ],
        promotionalVideo: 'MWOlnZSnXjo',
        likesCount: 980,
      },

      // 3. Lollapalooza India 2027 (Music Festival)
      {
        title: 'Lollapalooza India 2027',
        slug: 'lollapalooza-india-2027',
        eventType: 'festival',
        artistName: 'Green Day, Shawn Mendes & Multi-Artist Lineup',
        performingArtists: [
          { name: 'Green Day', role: 'Headliner', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200' },
          { name: 'Shawn Mendes', role: 'Headliner', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200' },
          { name: 'Glass Animals', role: 'Co-Headliner', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
          { name: 'Raftaar', role: 'Hip-Hop Headline', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=200' },
        ],
        poster: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80',
        banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
        description: 'Asia’s biggest multi-genre music festival returns to Mumbai! 4 stages, 40+ global and homegrown musical legends, food parks, art installations, and 2 full days of extraordinary festival memories.',
        eventDate: new Date('2027-03-08T14:00:00Z'),
        time: '2:00 PM – 10:00 PM',
        venue: {
          name: 'Mahalaxmi Racecourse',
          address: 'Dr E Moses Marg, Royal Western India Turf Club',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          mapUrl: 'https://maps.google.com/?q=Mahalaxmi+Racecourse+Mumbai',
        },
        genres: ['Rock', 'Pop', 'Alternative', 'Indie', 'Hip-Hop'],
        status: 'upcoming',
        isFeatured: true,
        isPopular: true,
        isFestival: true,
        isInternational: true,
        isRecentlyAnnounced: false,
        ticketPricing: [
          { category: 'General Access 2-Day Festival Pass', price: 6999, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Lolla VIP 2-Day Dedicated Lounge', price: 15999, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
        ],
        promotionalVideo: 'cqGjhVJWtEg',
        likesCount: 2150,
      },

      // 4. Sunburn Goa 2026 (Music Festival / EDM)
      {
        title: 'Sunburn Goa Festival 2026',
        slug: 'sunburn-goa-2026',
        eventType: 'festival',
        artistName: 'Hardwell, Charlotte de Witte & Global EDM Lineup',
        performingArtists: [
          { name: 'Hardwell', role: 'Main Stage Headliner', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200' },
          { name: 'Charlotte de Witte', role: 'Techno Stage Headliner', image: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=200' },
        ],
        poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
        description: 'Asia’s premier Electronic Dance Music festival under the Goan sun and coastal stars. 3 days of heavy bass, laser pyrotechnics, flea markets, and world-class DJ sets on Vagator beach.',
        eventDate: new Date('2026-12-28T15:00:00Z'),
        time: '3:00 PM – Late Night',
        venue: {
          name: 'Vagator Beach Arena',
          address: 'Vagator, Bardez',
          city: 'Goa',
          state: 'Goa',
          country: 'India',
          mapUrl: 'https://maps.google.com/?q=Vagator+Beach+Goa',
        },
        genres: ['Electronic/EDM', 'Techno', 'House', 'Trance'],
        status: 'upcoming',
        isFeatured: false,
        isPopular: true,
        isFestival: true,
        isInternational: true,
        isRecentlyAnnounced: true,
        ticketPricing: [
          { category: 'GA 3-Day Festival Pass', price: 4500, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'VIP 3-Day Raised Viewing Deck', price: 9000, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
        ],
        promotionalVideo: 'F7nQ0VUAOXg',
        likesCount: 1670,
      },

      // 5. Dua Lipa: Radical Optimism Concert
      {
        title: 'Dua Lipa: Radical Optimism Concert',
        slug: 'dua-lipa-radical-optimism-mumbai',
        eventType: 'concert',
        artist: dualipa._id,
        artistName: 'Dua Lipa',
        performingArtists: [
          { name: 'Dua Lipa', role: 'Headline Artist', artistRef: dualipa._id, image: dualipa.image },
        ],
        poster: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&w=600&q=80',
        banner: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
        description: 'The 3-time Grammy-winning global sensation brings the Radical Optimism Tour to Mumbai. Prepare to dance all night to hits like Levitating, Houdini, and Don’t Start Now in a state-of-the-art concert production.',
        eventDate: new Date('2027-04-12T19:00:00Z'),
        time: '7:00 PM IST',
        venue: {
          name: 'MMRDA Grounds, BKC',
          address: 'Bandra Kurla Complex',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          mapUrl: 'https://maps.google.com/?q=MMRDA+Grounds+BKC+Mumbai',
        },
        genres: ['Dance Pop', 'Disco Pop'],
        status: 'upcoming',
        isFeatured: true,
        isPopular: true,
        isTour: true,
        isInternational: true,
        isRecentlyAnnounced: true,
        ticketPricing: [
          { category: 'General Standing Tier 2', price: 3500, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Front GA Standing', price: 7500, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
        ],
        promotionalVideo: 'ByXuk9QqQkk',
        likesCount: 840,
      },

      // 6. A.R. Rahman Live in Concert: Symphony of Hope
      {
        title: 'A.R. Rahman Live in Concert: Symphony of Hope',
        slug: 'ar-rahman-symphony-of-hope-delhi',
        eventType: 'concert',
        artist: rahman._id,
        artistName: 'A.R. Rahman',
        performingArtists: [
          { name: 'A.R. Rahman', role: 'Lead Maestro & Conductor', artistRef: rahman._id, image: rahman.image },
        ],
        poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80',
        description: 'An acoustic and symphonic celebration of three decades of musical magic with the Maestro A.R. Rahman, accompanied by a 50-piece international orchestra and legendary playback singers.',
        eventDate: new Date('2027-03-22T19:30:00Z'),
        time: '7:30 PM IST',
        venue: {
          name: 'Indira Gandhi Indoor Arena',
          address: 'Indraprastha Estate',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          mapUrl: 'https://maps.google.com/?q=Indira+Gandhi+Arena+Delhi',
        },
        genres: ['Sufi', 'Film Score', 'Classical', 'World Fusion'],
        status: 'upcoming',
        isFeatured: true,
        isPopular: true,
        isTour: false,
        isInternational: false,
        isRecentlyAnnounced: false,
        ticketPricing: [
          { category: 'Bronze Reserved Balcony', price: 1999, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Silver Reserved Tier', price: 3499, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Gold Reserved Row', price: 6000, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Platinum VIP Floor Experience', price: 12000, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
        ],
        promotionalVideo: '8MR_H_Y5g1o',
        likesCount: 1530,
      },

      // 7. Arijit Singh Arena Live - Bengaluru
      {
        title: 'Arijit Singh Arena Live in Bengaluru',
        slug: 'arijit-singh-arena-live-bengaluru',
        eventType: 'live_gig',
        artist: arijit._id,
        artistName: 'Arijit Singh',
        performingArtists: [
          { name: 'Arijit Singh', role: 'Headline Singer', artistRef: arijit._id, image: arijit.image },
        ],
        poster: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
        banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
        description: 'Immerse in an evening of pure soul and emotional resonance as India’s foremost singer performs non-stop 3.5 hours of his timeless Bollywood and acoustic favorites.',
        eventDate: new Date('2027-04-26T18:30:00Z'),
        time: '6:30 PM IST',
        venue: {
          name: 'Nice Ground',
          address: 'Tumkur Road, Madavara',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          mapUrl: 'https://maps.google.com/?q=Nice+Grounds+Bengaluru',
        },
        genres: ['Bollywood', 'Romantic', 'Acoustic'],
        status: 'upcoming',
        isFeatured: false,
        isPopular: true,
        isTour: false,
        isInternational: false,
        isRecentlyAnnounced: true,
        ticketPricing: [
          { category: 'Silver Standing', price: 2999, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Gold Standing', price: 5999, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
          { category: 'Fan Zone VIP', price: 10999, currency: '₹', isAvailable: true, bookingUrl: 'https://in.bookmyshow.com' },
        ],
        promotionalVideo: 'MWOlnZSnXjo',
        likesCount: 1110,
      },
    ];

    const createdEvents = await MusicEvent.insertMany(curatedMusicEvents);
    console.log(`[Seed v2.0] Successfully inserted ${createdEvents.length} future-dated music events!`);

    const testUser = await User.findOne({ email: 'user@zenkai.com' });
    if (testUser) {
      testUser.favouriteArtists = [coldplay._id, rahman._id];
      testUser.savedEvents = [createdEvents[0]._id, createdEvents[2]._id];
      testUser.eventReminders = [
        { event: createdEvents[0]._id, reminderSetAt: new Date(), emailNotification: true },
      ];
      await testUser.save();
    }

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
