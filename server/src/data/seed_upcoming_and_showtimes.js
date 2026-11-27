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

// 14 Cities Full Showtimes Generator
function generate14CitiesShowtimes() {
  return [
    {
      city: 'Delhi',
      theatres: [
        {
          cinema: 'PVR Director’s Cut: Ambience Mall, Vasant Kunj',
          theatreChain: 'PVR INOX',
          theatreType: 'Director’s Cut Luxury',
          address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi',
          distance: '4.1 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '11:15 AM', format: 'Gold Class', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Executive', price: 650, currency: '₹', availableSeats: 22 }, { category: 'Recliner / VIP', price: 950, currency: '₹', availableSeats: 8 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-ncr' },
                { time: '03:30 PM', format: 'Gold Class', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Executive', price: 750, currency: '₹', availableSeats: 12 }, { category: 'Recliner / VIP', price: 1100, currency: '₹', availableSeats: 2 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-ncr' },
                { time: '07:45 PM', format: 'Gold Class', language: 'Original / Hindi', status: 'almost_full', seatCategories: [{ category: 'Executive', price: 850, currency: '₹', availableSeats: 4 }, { category: 'Recliner / VIP', price: 1200, currency: '₹', availableSeats: 1 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-ncr' }
              ]
            }
          ]
        },
        {
          cinema: 'PVR Priya: Community Centre, Vasant Vihar',
          theatreChain: 'PVR INOX',
          theatreType: 'IMAX Laser 2D',
          address: 'Basant Lok Community Centre, Vasant Vihar, New Delhi',
          distance: '5.8 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:00 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 290, currency: '₹', availableSeats: 48 }, { category: 'Executive', price: 440, currency: '₹', availableSeats: 24 }, { category: 'Recliner / VIP', price: 780, currency: '₹', availableSeats: 9 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-ncr' },
                { time: '05:15 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 340, currency: '₹', availableSeats: 15 }, { category: 'Executive', price: 490, currency: '₹', availableSeats: 8 }, { category: 'Recliner / VIP', price: 850, currency: '₹', availableSeats: 3 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-ncr' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Mumbai',
      theatres: [
        {
          cinema: 'PVR INOX: Phoenix Palladium, Lower Parel',
          theatreChain: 'PVR INOX',
          theatreType: 'IMAX Laser 2D',
          address: '462, Senapati Bapat Marg, Lower Parel, Mumbai',
          distance: '3.2 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '10:30 AM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 350, currency: '₹', availableSeats: 45 }, { category: 'Executive', price: 500, currency: '₹', availableSeats: 20 }, { category: 'Recliner / VIP', price: 850, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '02:15 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 400, currency: '₹', availableSeats: 15 }, { category: 'Executive', price: 600, currency: '₹', availableSeats: 8 }, { category: 'Recliner / VIP', price: 950, currency: '₹', availableSeats: 4 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '06:45 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'almost_full', seatCategories: [{ category: 'Normal', price: 450, currency: '₹', availableSeats: 5 }, { category: 'Executive', price: 650, currency: '₹', availableSeats: 3 }, { category: 'Recliner / VIP', price: 1050, currency: '₹', availableSeats: 1 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' }
              ]
            }
          ]
        },
        {
          cinema: 'Cinépolis: Viviana Mall, Thane West',
          theatreChain: 'Cinépolis',
          theatreType: '4DX & VIP Lounge',
          address: 'Eastern Express Hwy, Near Cadbury Junction, Thane',
          distance: '12.4 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:00 PM', format: '4DX', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 300, currency: '₹', availableSeats: 50 }, { category: 'Executive', price: 450, currency: '₹', availableSeats: 25 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '04:30 PM', format: '4DX', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 350, currency: '₹', availableSeats: 30 }, { category: 'Executive', price: 500, currency: '₹', availableSeats: 18 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Lucknow',
      theatres: [
        {
          cinema: 'PVR: Phoenix Palassio Mall, Amar Shaheed Path',
          theatreChain: 'PVR INOX',
          theatreType: 'IMAX Laser & LUXE',
          address: 'Sector 7, Gomti Nagar Extension, Lucknow',
          distance: '3.5 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '11:00 AM', format: 'IMAX 2D', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 240, currency: '₹', availableSeats: 55 }, { category: 'Executive', price: 380, currency: '₹', availableSeats: 28 }, { category: 'Recliner / VIP', price: 650, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '02:45 PM', format: 'IMAX 2D', language: 'Hindi / English', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 280, currency: '₹', availableSeats: 18 }, { category: 'Executive', price: 420, currency: '₹', availableSeats: 10 }, { category: 'Recliner / VIP', price: 720, currency: '₹', availableSeats: 4 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '07:00 PM', format: 'LUXE Recliner', language: 'Hindi / English', status: 'almost_full', seatCategories: [{ category: 'Executive', price: 480, currency: '₹', availableSeats: 6 }, { category: 'Recliner / VIP', price: 800, currency: '₹', availableSeats: 2 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' }
              ]
            }
          ]
        },
        {
          cinema: 'Cinépolis: One Awadh Center Mall, Gomti Nagar',
          theatreChain: 'Cinépolis',
          theatreType: 'RealD 3D & VIP',
          address: 'Vibhuti Khand, Gomti Nagar, Lucknow',
          distance: '4.8 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:15 PM', format: '2D Atmos', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 200, currency: '₹', availableSeats: 60 }, { category: 'Executive', price: 320, currency: '₹', availableSeats: 30 }, { category: 'Recliner / VIP', price: 550, currency: '₹', availableSeats: 14 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '05:30 PM', format: '2D Atmos', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 250, currency: '₹', availableSeats: 35 }, { category: 'Executive', price: 360, currency: '₹', availableSeats: 18 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' }
              ]
            }
          ]
        },
        {
          cinema: 'Wave Cinemas: Wave Mall, Gomti Nagar',
          theatreChain: 'Wave Cinemas',
          theatreType: 'Platinum Lounge',
          address: 'TC 54 Vibhuti Khand, Gomti Nagar, Lucknow',
          distance: '5.2 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:30 PM', format: 'Digital 2D', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 180, currency: '₹', availableSeats: 70 }, { category: 'Executive', price: 280, currency: '₹', availableSeats: 35 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '06:15 PM', format: 'Platinum Recliner', language: 'Hindi', status: 'filling_fast', seatCategories: [{ category: 'Executive', price: 320, currency: '₹', availableSeats: 20 }, { category: 'Recliner / VIP', price: 500, currency: '₹', availableSeats: 8 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Bengaluru',
      theatres: [
        {
          cinema: 'PVR: Forum Mall, Koramangala',
          theatreChain: 'PVR INOX',
          theatreType: 'Gold Class & IMAX',
          address: 'Hosur Road, Koramangala, Bengaluru',
          distance: '2.8 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '10:45 AM', format: 'IMAX 2D', language: 'English / Kannada', status: 'available', seatCategories: [{ category: 'Normal', price: 300, currency: '₹', availableSeats: 40 }, { category: 'Executive', price: 460, currency: '₹', availableSeats: 20 }, { category: 'Recliner / VIP', price: 790, currency: '₹', availableSeats: 8 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' },
                { time: '03:15 PM', format: 'IMAX 2D', language: 'English / Kannada', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 360, currency: '₹', availableSeats: 12 }, { category: 'Executive', price: 520, currency: '₹', availableSeats: 6 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Hyderabad',
      theatres: [
        {
          cinema: 'Prasads Multiplex: Large Screen PCX, Necklace Road',
          theatreChain: 'Prasads',
          theatreType: 'PCX Giant Screen 4K Dolby Atmos',
          address: 'Necklace Road, Khairatabad, Hyderabad',
          distance: '3.0 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '11:00 AM', format: 'PCX 2D', language: 'Telugu / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 250, currency: '₹', availableSeats: 80 }, { category: 'Executive', price: 350, currency: '₹', availableSeats: 40 }, { category: 'Recliner / VIP', price: 550, currency: '₹', availableSeats: 15 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-hyderabad' },
                { time: '02:30 PM', format: 'PCX 2D', language: 'Telugu / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 295, currency: '₹', availableSeats: 25 }, { category: 'Executive', price: 395, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-hyderabad' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Chennai',
      theatres: [
        {
          cinema: 'Sathyam Cinemas (SPI): Royapettah',
          theatreChain: 'SPI Cinemas',
          theatreType: 'RGB Laser Dolby Atmos',
          address: 'Thiru Vi Ka Road, Royapettah, Chennai',
          distance: '2.1 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '11:45 AM', format: '2D Atmos', language: 'Tamil / English', status: 'available', seatCategories: [{ category: 'Normal', price: 190, currency: '₹', availableSeats: 70 }, { category: 'Executive', price: 250, currency: '₹', availableSeats: 40 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-chennai' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Kolkata',
      theatres: [
        {
          cinema: 'INOX: South City Mall, Prince Anwar Shah Road',
          theatreChain: 'PVR INOX',
          theatreType: 'IMAX Laser 2D',
          address: 'South City Mall, Prince Anwar Shah Road, Kolkata',
          distance: '4.5 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:00 PM', format: 'IMAX 2D', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 220, currency: '₹', availableSeats: 50 }, { category: 'Executive', price: 340, currency: '₹', availableSeats: 25 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-kolkata' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Pune',
      theatres: [
        {
          cinema: 'Cinépolis: Seasons Mall, Magarpatta City',
          theatreChain: 'Cinépolis',
          theatreType: 'VIP Lounge 4DX',
          address: 'Magarpatta City, Hadapsar, Pune',
          distance: '3.8 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:30 PM', format: '4DX', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 260, currency: '₹', availableSeats: 45 }, { category: 'Executive', price: 380, currency: '₹', availableSeats: 20 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-pune' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Jaipur',
      theatres: [
        {
          cinema: 'Raj Mandir Cinema: Bhagwan Das Road',
          theatreChain: 'Heritage Single Screen',
          theatreType: 'Palace Experience 70mm',
          address: 'Bhagwan Das Road, Panch Batti, Jaipur',
          distance: '1.5 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:30 PM', format: '70mm Sound', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 160, currency: '₹', availableSeats: 90 }, { category: 'Executive', price: 260, currency: '₹', availableSeats: 45 }, { category: 'Recliner / VIP', price: 450, currency: '₹', availableSeats: 20 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-jaipur' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Ahmedabad',
      theatres: [
        {
          cinema: 'PVR: Acropolis Mall, Thaltej Crossroads',
          theatreChain: 'PVR INOX',
          theatreType: '4DX Laser 2D',
          address: 'Sarkhej - Gandhinagar Hwy, Thaltej, Ahmedabad',
          distance: '5.0 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '02:00 PM', format: '2D Atmos', language: 'Hindi / Gujarati', status: 'available', seatCategories: [{ category: 'Normal', price: 200, currency: '₹', availableSeats: 50 }, { category: 'Executive', price: 320, currency: '₹', availableSeats: 24 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-ahmedabad' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Chandigarh',
      theatres: [
        {
          cinema: 'PVR: Elante Mall, Industrial Area Phase 1',
          theatreChain: 'PVR INOX',
          theatreType: 'Gold Class & 4DX',
          address: '178-178A, Industrial Area Phase I, Chandigarh',
          distance: '3.2 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:00 PM', format: '4DX', language: 'Hindi / Punjabi', status: 'available', seatCategories: [{ category: 'Normal', price: 230, currency: '₹', availableSeats: 50 }, { category: 'Executive', price: 360, currency: '₹', availableSeats: 25 }, { category: 'Recliner / VIP', price: 650, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-chandigarh' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Indore',
      theatres: [
        {
          cinema: 'INOX: Treasure Island Mall, MG Road',
          theatreChain: 'PVR INOX',
          theatreType: 'Laser Dolby 7.1',
          address: '11, Tukoganj Main Rd, South Tukoganj, Indore',
          distance: '2.5 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:15 PM', format: '2D Atmos', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 190, currency: '₹', availableSeats: 55 }, { category: 'Executive', price: 290, currency: '₹', availableSeats: 30 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-indore' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Kochi',
      theatres: [
        {
          cinema: 'PVR: LuLu International Shopping Mall, Edappally',
          theatreChain: 'PVR INOX',
          theatreType: 'IMAX Laser 2D',
          address: '34/1000, Old NH 47, Edappally, Kochi, Kerala',
          distance: '4.0 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:45 PM', format: 'IMAX 2D', language: 'Malayalam / English', status: 'available', seatCategories: [{ category: 'Normal', price: 220, currency: '₹', availableSeats: 50 }, { category: 'Executive', price: 340, currency: '₹', availableSeats: 25 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-kochi' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Goa',
      theatres: [
        {
          cinema: 'INOX: Osia Commercial Arcade, Margao',
          theatreChain: 'PVR INOX',
          theatreType: 'Dolby 7.1 2D',
          address: 'Near KTC Bus Stand, Margao, Goa',
          distance: '2.0 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '02:00 PM', format: '2D', language: 'English / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 180, currency: '₹', availableSeats: 60 }, { category: 'Executive', price: 280, currency: '₹', availableSeats: 30 }, { category: 'Recliner / VIP', price: 500, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-goa' }
              ]
            }
          ]
        }
      ]
    }
  ];
}

// 15 Authentic Upcoming Blockbusters Roster
const UPCOMING_MOVIES = [
  {
    title: 'Avatar: Fire and Ash',
    slug: 'avatar-fire-and-ash',
    originalTitle: 'Avatar: Fire and Ash',
    tagline: 'Witness the dark, volcanic clan of Pandora.',
    overview: 'The third chapter in James Cameron’s revolutionary saga introduces the Ash People, a volcanic clan of Na’vi representing the darker aspects of nature. Jake Sully and Neytiri face an escalating existential confrontation that tests their family and the balance of Pandora.',
    releaseDate: new Date('2025-12-19'),
    releaseYear: 2025,
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
    cinematographer: 'Russell Carpenter',
    budget: '$250 Million',
    boxOffice: 'Upcoming Worldwide Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Sam Worthington', character: 'Jake Sully', profilePhoto: verifiedAvatars['Sam Worthington'] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Zoe Saldaña', character: 'Neytiri', profilePhoto: verifiedAvatars['Zoe Saldaña'] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sigourney Weaver', character: 'Kiri', profilePhoto: verifiedAvatars['Sigourney Weaver'] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Stephen Lang', character: 'Colonel Miles Quaritch', profilePhoto: verifiedAvatars['Stephen Lang'] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kate Winslet', character: 'Ronal', profilePhoto: verifiedAvatars['Kate Winslet'] || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Avatar: Fire and Ash Official Teaser', youtubeKey: 'd9MyW72ELq0', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.1, tmdbRating: 8.9, rottenTomatoesScore: 92, metacriticScore: 84, averageAudienceRating: 9.3, reviewCount: 450 }
  },
  {
    title: 'Superman',
    slug: 'superman-2025',
    originalTitle: 'Superman',
    tagline: 'Truth, justice and the human way.',
    overview: 'Written and directed by James Gunn, Superman follows Kal-El as he reconciles his Kryptonian heritage with his adoptive human upbringing as Clark Kent in Smallville, Kansas. He represents truth and humanity in a cynical modern world.',
    releaseDate: new Date('2025-07-11'),
    releaseYear: 2025,
    releaseStatus: 'upcoming',
    runtime: 142,
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
    cinematographer: 'Henry Braham',
    budget: '$200 Million',
    boxOffice: 'Upcoming Summer Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'David Corenswet', character: 'Clark Kent / Superman', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Rachel Brosnahan', character: 'Lois Lane', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Nicholas Hoult', character: 'Lex Luthor', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Edi Gathegi', character: 'Mister Terrific / Michael Holt', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Superman Official Announcement Teaser', youtubeKey: 'qSq81qU0kpk', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 8.9, tmdbRating: 8.7, rottenTomatoesScore: 89, metacriticScore: 82, averageAudienceRating: 9.0, reviewCount: 380 }
  },
  {
    title: 'War 2',
    slug: 'war-2',
    originalTitle: 'War 2',
    tagline: 'Two titans collide in the YRF Spy Universe.',
    overview: 'Major Kabir Dhaliwal faces an extraordinary rival operative in an espionage showdown taking the YRF Spy Universe across Japan, Italy, and India. High-octane combat, supersonic chases, and strategic psychological warfare collide.',
    releaseDate: new Date('2025-08-14'),
    releaseYear: 2025,
    releaseStatus: 'upcoming',
    runtime: 165,
    certification: 'UA',
    industry: 'bollywood',
    genres: ['Action', 'Thriller'],
    languages: ['Hindi', 'Telugu', 'Tamil'],
    country: 'India',
    poster: '/images/movies/war-2-poster.jpg',
    backdrop: '/images/movies/war-2-poster.jpg',
    director: 'Ayan Mukerji',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Aditya Chopra, Shridhar Raghavan',
    producer: 'Aditya Chopra',
    musicComposer: 'Pritam',
    cinematographer: 'Benjamin Jasper',
    budget: '₹220 Crore',
    boxOffice: 'Upcoming Independence Day Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Hrithik Roshan', character: 'Major Kabir Dhaliwal', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'N. T. Rama Rao Jr.', character: 'Agent Dev', profilePhoto: verifiedAvatars['N. T. Rama Rao Jr.'] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kiara Advani', character: 'Ananya', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Anil Kapoor', character: 'RAW Chief', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'War 2 First Look Teaser', youtubeKey: 'tQ0mzXRk-oM', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 8.8, tmdbRating: 8.6, rottenTomatoesScore: 88, metacriticScore: 80, averageAudienceRating: 9.1, reviewCount: 620 }
  },
  {
    title: 'The Batman: Part II',
    slug: 'the-batman-part-ii',
    originalTitle: 'The Batman: Part II',
    tagline: 'Gotham’s shadows grow deeper.',
    overview: 'Matt Reeves expands his gritty detective vision of Gotham City. Following the flooding disaster orchestrated by the Riddler, Bruce Wayne grapples with the fallout while confronting emerging villainy in the frozen criminal underworld.',
    releaseDate: new Date('2026-10-02'),
    releaseYear: 2026,
    releaseStatus: 'upcoming',
    runtime: 168,
    certification: 'A',
    industry: 'hollywood',
    genres: ['Action', 'Crime', 'Drama', 'Mystery'],
    languages: ['English', 'Hindi'],
    country: 'United States',
    poster: '/images/movies/the-batman-part-ii-poster.jpg',
    backdrop: '/images/movies/the-batman-part-ii-poster.jpg',
    director: 'Matt Reeves',
    directorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    writer: 'Matt Reeves, Mattson Tomlin',
    producer: 'Matt Reeves, Dylan Clark',
    musicComposer: 'Michael Giacchino',
    cinematographer: 'Greig Fraser',
    budget: '$180 Million',
    boxOffice: 'Upcoming Worldwide Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Robert Pattinson', character: 'Bruce Wayne / Batman', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Colin Farrell', character: 'Oswald Cobblepot / The Penguin', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Andy Serkis', character: 'Alfred Pennyworth', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Jeffrey Wright', character: 'James Gordon', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'The Batman: Part II DC Studio Teaser', youtubeKey: 'mqqft2x_Aa4', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.0, tmdbRating: 8.8, rottenTomatoesScore: 91, metacriticScore: 85, averageAudienceRating: 9.2, reviewCount: 510 }
  },
  {
    title: 'Kalki 2898 AD: Part 2',
    slug: 'kalki-2898-ad-part-2',
    originalTitle: 'Kalki 2898 AD: Part 2',
    tagline: 'The finale of the dystopian mythic universe.',
    overview: 'The prophecy reaches its crescendo as Supreme Yaskin wields the Gandiva bow. Bhairava and Ashwatthama unite with Shambhala’s rebel army to protect the newborn Kalki and bring an end to the tyrannical Complex.',
    releaseDate: new Date('2026-05-15'),
    releaseYear: 2026,
    releaseStatus: 'upcoming',
    runtime: 180,
    certification: 'UA',
    industry: 'south_indian',
    genres: ['Action', 'Sci-Fi', 'Mythology'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    country: 'India',
    poster: '/images/movies/kalki-2898-ad-part-2-poster.jpg',
    backdrop: '/images/movies/kalki-2898-ad-part-2-poster.jpg',
    director: 'Nag Ashwin',
    directorPhoto: verifiedAvatars['Nag Ashwin'] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Nag Ashwin',
    producer: 'C. Aswani Dutt',
    musicComposer: 'Santhosh Narayanan',
    cinematographer: 'Djordje Stojiljkovic',
    budget: '₹700 Crore',
    boxOffice: 'Upcoming Summer Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Prabhas', character: 'Bhairava / Karna', profilePhoto: verifiedAvatars['Prabhas'] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Amitabh Bachchan', character: 'Ashwatthama', profilePhoto: verifiedAvatars['Amitabh Bachchan'] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kamal Haasan', character: 'Supreme Yaskin', profilePhoto: verifiedAvatars['Kamal Haasan'] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', character: 'SUM-80 / Sumathi', profilePhoto: verifiedAvatars['Deepika Padukone'] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Disha Patani', character: 'Roxie', profilePhoto: verifiedAvatars['Disha Patani'] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Kalki 2898 AD: Part 2 Cinematic Teaser', youtubeKey: 'kQDd1AhGIHk', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.2, tmdbRating: 8.9, rottenTomatoesScore: 93, metacriticScore: 86, averageAudienceRating: 9.4, reviewCount: 890 }
  },
  {
    title: 'Toxic: A Fairy Tale for Grown-ups',
    slug: 'toxic-fairy-tale-for-grown-ups',
    originalTitle: 'Toxic',
    tagline: 'A ferocious underworld saga set against the 1960s drug cartels.',
    overview: 'Rocking Star Yash stars in an international crime epic directed by Geetu Mohandas. Spanning vintage London, Goa, and coastal Karnataka, Toxic explores brotherhood, betrayal, and relentless ambition in a shadowy mafia empire.',
    releaseDate: new Date('2025-04-10'),
    releaseYear: 2025,
    releaseStatus: 'upcoming',
    runtime: 160,
    certification: 'A',
    industry: 'south_indian',
    genres: ['Action', 'Crime', 'Drama'],
    languages: ['Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'],
    country: 'India',
    poster: '/images/movies/toxic-fairy-tale-for-grown-ups-poster.jpg',
    backdrop: '/images/movies/toxic-fairy-tale-for-grown-ups-poster.jpg',
    director: 'Geetu Mohandas',
    directorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    writer: 'Geetu Mohandas, Yash',
    producer: 'Venkat K. Narayana, Yash',
    musicComposer: 'Jeremy Stack',
    cinematographer: 'Rajeev Ravi',
    budget: '₹200 Crore',
    boxOffice: 'Upcoming Global Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Yash', character: 'Raya', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Nayanthara', character: 'Ganga', profilePhoto: verifiedAvatars['Nayanthara'] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kiara Advani', character: 'Elena', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Huma Qureshi', character: 'Zohra', profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Toxic Title Announcement Video', youtubeKey: 'tZbzHq8372A', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.0, tmdbRating: 8.8, rottenTomatoesScore: 90, metacriticScore: 84, averageAudienceRating: 9.3, reviewCount: 420 }
  },
  {
    title: 'Avengers: Doomsday',
    slug: 'avengers-doomsday',
    originalTitle: 'Avengers: Doomsday',
    tagline: 'Robert Downey Jr. returns as Doctor Victor Von Doom.',
    overview: 'The Marvel Cinematic Universe enters a cataclysmic chapter as Doctor Doom unleashes his mastery over science and sorcery to bend the multiverse to his will. The Avengers and Fantastic Four must unite across fractured realities.',
    releaseDate: new Date('2026-05-01'),
    releaseYear: 2026,
    releaseStatus: 'upcoming',
    runtime: 175,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: '/images/movies/avengers-doomsday-poster.jpg',
    backdrop: '/images/movies/avengers-doomsday-poster.jpg',
    director: 'Anthony Russo, Joe Russo',
    directorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    writer: 'Stephen McFeely',
    producer: 'Kevin Feige, Anthony Russo, Joe Russo',
    musicComposer: 'Alan Silvestri',
    cinematographer: 'Trent Opaloch',
    budget: '$300 Million',
    boxOffice: 'Upcoming Global Event Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Robert Downey Jr.', character: 'Doctor Doom / Victor Von Doom', profilePhoto: verifiedAvatars['Robert Downey Jr.'] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Pedro Pascal', character: 'Reed Richards / Mister Fantastic', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Vanessa Kirby', character: 'Sue Storm / Invisible Woman', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Florence Pugh', character: 'Yelena Belova', profilePhoto: verifiedAvatars['Florence Pugh'] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Avengers: Doomsday Marvel Hall H Presentation', youtubeKey: 'ex3C1TrCX5k', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.3, tmdbRating: 9.1, rottenTomatoesScore: 94, metacriticScore: 88, averageAudienceRating: 9.5, reviewCount: 1150 }
  },
  {
    title: 'King',
    slug: 'king-2026',
    originalTitle: 'King',
    tagline: 'The King mentor rises from the shadows.',
    overview: 'Shah Rukh Khan portrays a battle-hardened international assassin who comes out of retirement to protect and train his protege in high-stakes tactical combat against a ruthless global crime syndicate.',
    releaseDate: new Date('2026-11-06'),
    releaseYear: 2026,
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
    cinematographer: 'Sanu John Varghese',
    budget: '₹200 Crore',
    boxOffice: 'Upcoming Diwali Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Shah Rukh Khan', character: 'King', profilePhoto: verifiedAvatars['Shah Rukh Khan'] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Suhana Khan', character: 'Maya', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Abhishek Bachchan', character: 'Vikramaditya (Antagonist)', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Abhay Verma', character: 'Kabir', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'King Official Announcement Motion Poster', youtubeKey: '0WWzgGyAH6Y', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.1, tmdbRating: 8.8, rottenTomatoesScore: 90, metacriticScore: 82, averageAudienceRating: 9.2, reviewCount: 780 }
  },
  {
    title: 'Ramayana: Part 1',
    slug: 'ramayana-part-1',
    originalTitle: 'Ramayana',
    tagline: 'The timeless Indian epic on an unprecedented global canvas.',
    overview: 'Nitesh Tiwari crafts a visual and cultural milestone. Ranbir Kapoor breathes life into Lord Rama, Sai Pallavi embodies Sita, and Yash portrays the demon king Ravana in a spectacle powered by DNEG’s visual effects.',
    releaseDate: new Date('2026-10-23'),
    releaseYear: 2026,
    releaseStatus: 'upcoming',
    runtime: 185,
    certification: 'U',
    industry: 'bollywood',
    genres: ['Mythology', 'Action', 'Drama'],
    languages: ['Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'],
    country: 'India',
    poster: '/images/movies/ramayana-part-1-poster.jpg',
    backdrop: '/images/movies/ramayana-part-1-poster.jpg',
    director: 'Nitesh Tiwari',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Nitesh Tiwari, Shridhar Raghavan',
    producer: 'Namit Malhotra, Yash',
    musicComposer: 'Hans Zimmer, A. R. Rahman',
    cinematographer: 'Jason West',
    budget: '₹835 Crore ($100M)',
    boxOffice: 'Upcoming Global Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Ranbir Kapoor', character: 'Lord Rama', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sai Pallavi', character: 'Goddess Sita', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Yash', character: 'Lankeshwar Ravana', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sunny Deol', character: 'Lord Hanuman', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Ramayana Epic Vision Announcement', youtubeKey: 'Fk9f1H1-T6M', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.4, tmdbRating: 9.2, rottenTomatoesScore: 95, metacriticScore: 89, averageAudienceRating: 9.6, reviewCount: 1420 }
  },
  {
    title: 'Captain America: Brave New World',
    slug: 'captain-america-brave-new-world',
    originalTitle: 'Captain America: Brave New World',
    tagline: 'A new shield. A dangerous global conspiracy.',
    overview: 'Sam Wilson finds himself in the middle of an international incident following a meeting with newly elected U.S. President Thaddeus Ross. He must discover the motive behind a nefarious global plot before the mastermind has the world seeing red.',
    releaseDate: new Date('2025-02-14'),
    releaseYear: 2025,
    releaseStatus: 'upcoming',
    runtime: 135,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Sci-Fi', 'Thriller'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    director: 'Julius Onah',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Malcolm Spellman, Dalan Musson, Julius Onah',
    producer: 'Kevin Feige, Nate Moore',
    musicComposer: 'Laura Karpman',
    cinematographer: 'Kramer Morgenthau',
    budget: '$180 Million',
    boxOffice: 'Upcoming Theatrical Release',
    featured: false,
    trending: true,
    popular: true,
    cast: [
      { name: 'Anthony Mackie', character: 'Sam Wilson / Captain America', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Harrison Ford', character: 'President Thaddeus Ross / Red Hulk', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Danny Ramirez', character: 'Joaquin Torres / Falcon', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Giancarlo Esposito', character: 'Seth Voelker / Sidewinder', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Captain America: Brave New World Official Trailer', youtubeKey: '1pHDWnXmK7Y', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 8.6, tmdbRating: 8.4, rottenTomatoesScore: 84, metacriticScore: 78, averageAudienceRating: 8.8, reviewCount: 310 }
  },
  {
    title: 'Kantara: Chapter 1',
    slug: 'kantara-chapter-1',
    originalTitle: 'Kantara: Chapter 1',
    tagline: 'Step into the divine origins during the reign of the Kadambas.',
    overview: 'The prequel to the sensational blockbuster explores the historic roots of the Panjurli and Guliga Daiva during the 4th century Kadamba dynasty, exploring the spiritual covenant between ancient forest dwellers and kings.',
    releaseDate: new Date('2025-10-02'),
    releaseYear: 2025,
    releaseStatus: 'upcoming',
    runtime: 165,
    certification: 'UA',
    industry: 'south_indian',
    genres: ['Action', 'Drama', 'Mythology', 'Thriller'],
    languages: ['Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'],
    country: 'India',
    poster: '/images/movies/kantara-chapter-1-poster.jpg',
    backdrop: '/images/movies/kantara-chapter-1-poster.jpg',
    director: 'Rishab Shetty',
    directorPhoto: verifiedAvatars['Rishab Shetty'] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    writer: 'Rishab Shetty, Anirudh Mahesh',
    producer: 'Vijay Kiragandur',
    musicComposer: 'B. Ajaneesh Loknath',
    cinematographer: 'Aravind S. Kashyap',
    budget: '₹125 Crore',
    boxOffice: 'Upcoming Dussehra Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Rishab Shetty', character: 'The Divine Chieftain', profilePhoto: verifiedAvatars['Rishab Shetty'] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Jayaram', character: 'King of Kadamba', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Rukmini Vasanth', character: 'Maharani', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Kantara Chapter 1 First Glimpse Teaser', youtubeKey: 'X5n748l6_G8', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.3, tmdbRating: 9.0, rottenTomatoesScore: 94, metacriticScore: 87, averageAudienceRating: 9.5, reviewCount: 710 }
  },
  {
    title: 'Spider-Man: Beyond the Spider-Verse',
    slug: 'spider-man-beyond-the-spider-verse',
    originalTitle: 'Spider-Man: Beyond the Spider-Verse',
    tagline: 'The dimensional symphony ends.',
    overview: 'Miles Morales navigates the treacherous reality of Earth-42, trapped with his alternate self as the Prowler, while Gwen Stacy leads a rogue team of Spider-heroes across reality to defeat the Spot and save the Multiverse.',
    releaseDate: new Date('2026-06-19'),
    releaseYear: 2026,
    releaseStatus: 'upcoming',
    runtime: 148,
    certification: 'U',
    industry: 'hollywood',
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: '/images/movies/spider-man-beyond-the-spider-verse-poster.jpg',
    backdrop: '/images/movies/spider-man-beyond-the-spider-verse-poster.jpg',
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    directorPhoto: verifiedAvatars['Joaquim Dos Santos'] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Phil Lord, Christopher Miller, Dave Callaham',
    producer: 'Phil Lord, Christopher Miller, Amy Pascal',
    musicComposer: 'Daniel Pemberton',
    cinematographer: 'Brian Bendis',
    budget: '$150 Million',
    boxOffice: 'Upcoming Global Summer Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Shameik Moore', character: 'Miles Morales / Spider-Man', profilePhoto: verifiedAvatars['Shameik Moore'] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Hailee Steinfeld', character: 'Gwen Stacy / Spider-Woman', profilePhoto: verifiedAvatars['Hailee Steinfeld'] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Oscar Isaac', character: 'Miguel O’Hara / Spider-Man 2099', profilePhoto: verifiedAvatars['Oscar Isaac'] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Daniel Kaluuya', character: 'Hobie Brown / Spider-Punk', profilePhoto: verifiedAvatars['Daniel Kaluuya'] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Beyond the Spider-Verse Teaser Update', youtubeKey: 'cqGjhVJWtEg', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.4, tmdbRating: 9.2, rottenTomatoesScore: 96, metacriticScore: 89, averageAudienceRating: 9.6, reviewCount: 940 }
  },
  {
    title: 'Mission: Impossible – The Final Reckoning',
    slug: 'mission-impossible-the-final-reckoning',
    originalTitle: 'Mission: Impossible – The Final Reckoning',
    tagline: 'Our lives are the sum of our choices.',
    overview: 'Ethan Hunt and his IMF team face their ultimate endgame against the rogue artificial intelligence known as the Entity. Racing against global powers and sunken submarine secrets, Ethan confronts his past to save humanity.',
    releaseDate: new Date('2025-05-23'),
    releaseYear: 2025,
    releaseStatus: 'upcoming',
    runtime: 165,
    certification: 'UA',
    industry: 'hollywood',
    genres: ['Action', 'Adventure', 'Thriller'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    poster: '/images/movies/mission-impossible-the-final-reckoning-poster.jpg',
    backdrop: '/images/movies/mission-impossible-the-final-reckoning-poster.jpg',
    director: 'Christopher McQuarrie',
    directorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    writer: 'Christopher McQuarrie, Erik Jendresen',
    producer: 'Tom Cruise, Christopher McQuarrie',
    musicComposer: 'Max Aruj',
    cinematographer: 'Fraser Taggart',
    budget: '$300 Million',
    boxOffice: 'Upcoming Global Memorial Day Release',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Tom Cruise', character: 'Ethan Hunt', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Hayley Atwell', character: 'Grace', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ving Rhames', character: 'Luther Stickell', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Simon Pegg', character: 'Benji Dunn', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Mission: Impossible – The Final Reckoning Official Teaser Trailer', youtubeKey: 'NOhDynmtYWo', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.1, tmdbRating: 8.8, rottenTomatoesScore: 92, metacriticScore: 85, averageAudienceRating: 9.3, reviewCount: 650 }
  },
  {
    title: 'Demon Slayer: Kimetsu no Yaiba – Infinity Castle Part 1',
    slug: 'demon-slayer-infinity-castle-part-1',
    originalTitle: '劇場版「鬼滅の刃」無限城編 第一部',
    tagline: 'Enter the multidimensional fortress. The final battle begins.',
    overview: 'The Demon Slayer Corps plunges into the shifting gravity of Muzan Kibutsuji’s Infinity Castle. Tanjiro Kamado, the Hashira, and their allies engage the formidable Upper Rank demons in an all-out war for survival.',
    releaseDate: new Date('2025-10-17'),
    releaseYear: 2025,
    releaseStatus: 'upcoming',
    runtime: 120,
    certification: 'UA',
    industry: 'anime',
    genres: ['Anime', 'Action', 'Dark Fantasy', 'Animation'],
    languages: ['Japanese', 'English', 'Hindi'],
    country: 'Japan',
    poster: '/images/movies/demon-slayer-infinity-castle-part-1-poster.jpg',
    backdrop: '/images/movies/demon-slayer-infinity-castle-part-1-poster.jpg',
    director: 'Haruo Sotozaki',
    directorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    writer: 'Koyoharu Gotouge, Ufotable',
    producer: 'Hikaru Kondo (Ufotable)',
    musicComposer: 'Yuki Kajiura, Go Shiina',
    cinematographer: 'Yuichi Terao',
    budget: '$30 Million',
    boxOffice: 'Upcoming Global Theatrical Trilogy',
    featured: true,
    trending: true,
    popular: true,
    cast: [
      { name: 'Natsuki Hanae', character: 'Tanjiro Kamado (voice)', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Akari Kito', character: 'Nezuko Kamado (voice)', profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Hiro Shimono', character: 'Zenitsu Agatsuma (voice)', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Takahiro Sakurai', character: 'Giyu Tomioka (voice)', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Demon Slayer: Infinity Castle Movie Trilogy Announcement', youtubeKey: '3z73k9V9oDk', isOfficial: true }
    ],
    ratingSummary: { imdbRating: 9.3, tmdbRating: 9.1, rottenTomatoesScore: 95, metacriticScore: 88, averageAudienceRating: 9.6, reviewCount: 1200 }
  }
];

async function runSeed() {
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    const Movie = mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

    // 1. Update all currently showing movies with full 14 cities showtimes
    const full14Showtimes = generate14CitiesShowtimes();
    console.log(`Injecting verified 14-city showtimes into now_showing movies...`);
    const updateResult = await Movie.updateMany(
      { releaseStatus: { $in: ['now_showing', 'released', 'streaming'] } },
      { $set: { cityShowtimes: full14Showtimes } }
    );
    console.log(`Updated showtimes for ${updateResult.modifiedCount} movies.`);

    // 2. Insert or Upsert Upcoming Movies
    console.log(`Seeding ${UPCOMING_MOVIES.length} upcoming blockbusters...`);
    for (const upcomingData of UPCOMING_MOVIES) {
      // Create empty showtimes for all 14 cities indicating advance booking not yet open
      const upcomingCityShowtimes = full14Showtimes.map((cityObj) => ({
        city: cityObj.city,
        theatres: [] // Explicitly empty for upcoming, with advance booking pending
      }));

      const payload = {
        ...upcomingData,
        cityShowtimes: upcomingCityShowtimes
      };

      await Movie.findOneAndUpdate(
        { slug: payload.slug },
        { $set: payload },
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded upcoming movie: ${payload.title} (${payload.industry})`);
    }

    const totalNowShowing = await Movie.countDocuments({ releaseStatus: 'now_showing' });
    const totalUpcoming = await Movie.countDocuments({ releaseStatus: 'upcoming' });
    const distinctCities = await Movie.distinct('cityShowtimes.city');

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Total Now Showing Movies:', totalNowShowing);
    console.log('Total Upcoming Movies:', totalUpcoming);
    console.log('Supported Showtimes Cities in Database:', distinctCities);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

runSeed();
