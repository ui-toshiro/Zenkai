import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

dotenv.config();

// Helper to generate realistic city showtimes
function makeCityShowtimes(formats = ['IMAX 2D', 'Dolby Atmos 2D', 'Regular 2D']) {
  return [
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
                { time: '10:15 AM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 280, currency: '₹', availableSeats: 52 }, { category: 'Executive', price: 420, currency: '₹', availableSeats: 28 }, { category: 'Recliner / VIP', price: 750, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '01:45 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 320, currency: '₹', availableSeats: 14 }, { category: 'Executive', price: 480, currency: '₹', availableSeats: 8 }, { category: 'Recliner / VIP', price: 850, currency: '₹', availableSeats: 2 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '05:30 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'almost_full', seatCategories: [{ category: 'Normal', price: 380, currency: '₹', availableSeats: 4 }, { category: 'Executive', price: 550, currency: '₹', availableSeats: 3 }, { category: 'Recliner / VIP', price: 950, currency: '₹', availableSeats: 0 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '09:00 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 350, currency: '₹', availableSeats: 38 }, { category: 'Executive', price: 500, currency: '₹', availableSeats: 20 }, { category: 'Recliner / VIP', price: 900, currency: '₹', availableSeats: 6 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' }
              ]
            },
            {
              date: '2026-11-24',
              label: 'Tomorrow',
              shows: [
                { time: '11:00 AM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 260, currency: '₹', availableSeats: 60 }, { category: 'Executive', price: 400, currency: '₹', availableSeats: 32 }, { category: 'Recliner / VIP', price: 700, currency: '₹', availableSeats: 14 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '03:15 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 300, currency: '₹', availableSeats: 45 }, { category: 'Executive', price: 450, currency: '₹', availableSeats: 25 }, { category: 'Recliner / VIP', price: 800, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '07:30 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 380, currency: '₹', availableSeats: 12 }, { category: 'Executive', price: 550, currency: '₹', availableSeats: 6 }, { category: 'Recliner / VIP', price: 950, currency: '₹', availableSeats: 1 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' }
              ]
            }
          ]
        },
        {
          cinema: 'Cinépolis: Viviana Mall, Eastern Express Highway, Thane',
          theatreChain: 'Cinépolis',
          theatreType: '4DX 2D',
          address: 'Viviana Mall, Service Road, Laxmi Nagar, Thane West',
          distance: '8.5 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:30 PM', format: '4DX', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 240, currency: '₹', availableSeats: 44 }, { category: 'Executive', price: 360, currency: '₹', availableSeats: 26 }, { category: 'Recliner / VIP', price: 650, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '04:15 PM', format: '4DX', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 280, currency: '₹', availableSeats: 18 }, { category: 'Executive', price: 400, currency: '₹', availableSeats: 12 }, { category: 'Recliner / VIP', price: 700, currency: '₹', availableSeats: 4 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' }
              ]
            }
          ]
        },
        {
          cinema: 'INOX Megaplex: Inorbit Mall, Malad West',
          theatreChain: 'PVR INOX',
          theatreType: 'Dolby Atmos 2D',
          address: 'Link Road, Malad West, Mumbai',
          distance: '12 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '02:00 PM', format: 'Dolby Atmos', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 220, currency: '₹', availableSeats: 58 }, { category: 'Executive', price: 340, currency: '₹', availableSeats: 30 }, { category: 'Recliner / VIP', price: 600, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '06:45 PM', format: 'Dolby Atmos', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 290, currency: '₹', availableSeats: 16 }, { category: 'Executive', price: 420, currency: '₹', availableSeats: 9 }, { category: 'Recliner / VIP', price: 750, currency: '₹', availableSeats: 3 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' }
              ]
            }
          ]
        }
      ]
    },
    {
      city: 'Delhi NCR',
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
                { time: '03:30 PM', format: 'Gold Class', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Executive', price: 750, currency: '₹', availableSeats: 12 }, { category: 'Recliner / VIP', price: 1100, currency: '₹', availableSeats: 2 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-ncr' }
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
      city: 'Bengaluru',
      theatres: [
        {
          cinema: 'PVR: The Forum Mall, Koramangala',
          theatreChain: 'PVR INOX',
          theatreType: 'IMAX 2D',
          address: 'Hosur Road, Koramangala, Bengaluru',
          distance: '2.5 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '10:45 AM', format: 'IMAX 2D', language: 'Original / Kannada', status: 'available', seatCategories: [{ category: 'Normal', price: 260, currency: '₹', availableSeats: 55 }, { category: 'Executive', price: 390, currency: '₹', availableSeats: 30 }, { category: 'Recliner / VIP', price: 680, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' },
                { time: '02:15 PM', format: 'IMAX 2D', language: 'Original / Kannada', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 300, currency: '₹', availableSeats: 19 }, { category: 'Executive', price: 450, currency: '₹', availableSeats: 10 }, { category: 'Recliner / VIP', price: 780, currency: '₹', availableSeats: 4 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' }
              ]
            }
          ]
        },
        {
          cinema: 'Cinépolis: Nexus Shantiniketan Mall, Whitefield',
          theatreChain: 'Cinépolis',
          theatreType: '4DX 2D',
          address: 'ITPL Main Road, Whitefield, Bengaluru',
          distance: '7.8 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:15 PM', format: '4DX', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 250, currency: '₹', availableSeats: 42 }, { category: 'Executive', price: 380, currency: '₹', availableSeats: 22 }, { category: 'Recliner / VIP', price: 690, currency: '₹', availableSeats: 8 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' }
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
          cinema: 'Prasads Multiplex: Necklace Road',
          theatreChain: 'Prasads',
          theatreType: 'Large Screen PCX / Atmos',
          address: 'NTR Gardens, Necklace Road, Hyderabad',
          distance: '3.0 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '11:00 AM', format: 'Large Screen PCX', language: 'Telugu / Original', status: 'available', seatCategories: [{ category: 'Normal', price: 200, currency: '₹', availableSeats: 80 }, { category: 'Executive', price: 320, currency: '₹', availableSeats: 45 }, { category: 'Recliner / VIP', price: 550, currency: '₹', availableSeats: 15 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-hyderabad' },
                { time: '02:45 PM', format: 'Large Screen PCX', language: 'Telugu / Original', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 250, currency: '₹', availableSeats: 24 }, { category: 'Executive', price: 380, currency: '₹', availableSeats: 14 }, { category: 'Recliner / VIP', price: 650, currency: '₹', availableSeats: 5 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-hyderabad' }
              ]
            }
          ]
        },
        {
          cinema: 'AMB Cinemas: Gachibowli',
          theatreChain: 'AMB Cinemas',
          theatreType: 'Superplex VIP',
          address: 'Sarath City Capital Mall, Gachibowli, Kondapur',
          distance: '6.4 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:30 PM', format: 'M-Screen Atmos', language: 'Telugu / Original', status: 'available', seatCategories: [{ category: 'Normal', price: 230, currency: '₹', availableSeats: 48 }, { category: 'Executive', price: 350, currency: '₹', availableSeats: 26 }, { category: 'Recliner / VIP', price: 600, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-hyderabad' }
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
          theatreChain: 'PVR INOX (SPI)',
          theatreType: 'RDX Dolby Atmos',
          address: '8, Thiruvika Rd, Royapettah, Chennai',
          distance: '2.1 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '10:30 AM', format: 'Dolby Atmos', language: 'Tamil / Original', status: 'available', seatCategories: [{ category: 'Normal', price: 190, currency: '₹', availableSeats: 65 }, { category: 'Executive', price: 280, currency: '₹', availableSeats: 38 }, { category: 'Recliner / VIP', price: 480, currency: '₹', availableSeats: 14 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-chennai' },
                { time: '02:00 PM', format: 'Dolby Atmos', language: 'Tamil / Original', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 220, currency: '₹', availableSeats: 21 }, { category: 'Executive', price: 320, currency: '₹', availableSeats: 12 }, { category: 'Recliner / VIP', price: 550, currency: '₹', availableSeats: 4 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-chennai' }
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
          address: '375, Prince Anwar Shah Rd, South City Complex, Kolkata',
          distance: '3.6 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '11:45 AM', format: 'IMAX 2D', language: 'Hindi / Original', status: 'available', seatCategories: [{ category: 'Normal', price: 220, currency: '₹', availableSeats: 50 }, { category: 'Executive', price: 340, currency: '₹', availableSeats: 26 }, { category: 'Recliner / VIP', price: 580, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-kolkata' }
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
          theatreType: 'VIP & 4DX 2D',
          address: 'Magarpatta City, Hadapsar, Pune',
          distance: '4.2 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:15 PM', format: '4DX', language: 'Hindi / Original', status: 'available', seatCategories: [{ category: 'Normal', price: 230, currency: '₹', availableSeats: 46 }, { category: 'Executive', price: 350, currency: '₹', availableSeats: 24 }, { category: 'Recliner / VIP', price: 620, currency: '₹', availableSeats: 9 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-pune' }
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
          cinema: 'PVR: Acropolis Mall, Thaltej SG Highway',
          theatreChain: 'PVR INOX',
          theatreType: '4DX 2D',
          address: 'SG Highway, Thaltej, Ahmedabad',
          distance: '5.1 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:00 PM', format: '4DX', language: 'Hindi / Original', status: 'available', seatCategories: [{ category: 'Normal', price: 210, currency: '₹', availableSeats: 52 }, { category: 'Executive', price: 330, currency: '₹', availableSeats: 28 }, { category: 'Recliner / VIP', price: 580, currency: '₹', availableSeats: 11 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-ahmedabad' }
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
          theatreChain: 'Raj Mandir Heritage',
          theatreType: 'Grand Showcase Cinema',
          address: 'Bhagwan Das Rd, Panch Batti, Ashok Nagar, Jaipur',
          distance: '1.8 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:30 PM', format: 'Grand Showcase', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 180, currency: '₹', availableSeats: 90 }, { category: 'Executive', price: 280, currency: '₹', availableSeats: 50 }, { category: 'Recliner / VIP', price: 450, currency: '₹', availableSeats: 20 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-jaipur' }
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
          theatreType: 'P[XL] Atmos & 4DX',
          address: '34/1000, Old NH 47, Edappally, Kochi',
          distance: '3.4 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '11:30 AM', format: 'P[XL] Atmos', language: 'Malayalam / Original', status: 'available', seatCategories: [{ category: 'Normal', price: 200, currency: '₹', availableSeats: 62 }, { category: 'Executive', price: 310, currency: '₹', availableSeats: 34 }, { category: 'Recliner / VIP', price: 540, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-kochi' }
              ]
            }
          ]
        }
      ]
    }
  ];
}

const curatedMovies = [
  // 1. Oppenheimer (Hollywood, Top-rated, Now Streaming)
  {
    title: 'Oppenheimer',
    slug: 'oppenheimer',
    tmdbId: 872585,
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, exploring the moral and scientific complexities of humanity’s most devastating creation.',
    releaseDate: new Date('2023-07-21'),
    releaseYear: 2023,
    runtime: 180,
    genres: ['Drama', 'History', 'Biography'],
    languages: ['English', 'German'],
    country: 'United States',
    certification: 'R',
    director: 'Christopher Nolan',
    directorInfo: {
      name: 'Christopher Nolan',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/ChristopherNolan-byPhilipRomano_%28cropped%29.jpg/330px-ChristopherNolan-byPhilipRomano_%28cropped%29.jpg',
      bio: 'Academy Award-winning British-American filmmaker acclaimed for his complex storytelling, grand practical visual effects, and philosophical depth.'
    },
    productionCompanies: ['Syncopy', 'Universal Pictures'],
    industry: 'hollywood',
    releaseStatus: 'streaming',
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    ratingSummary: {
      imdbRating: 8.9,
      tmdbRating: 8.1,
      averageAudienceRating: 9.1,
      reviewCount: 420,
      ratingDistribution: { 1: 3, 2: 2, 3: 5, 4: 8, 5: 12, 6: 20, 7: 50, 8: 90, 9: 130, 10: 100 },
      positivePercentage: 88,
      negativePercentage: 4,
    },
    cast: [
      { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', role: 'Lead Actor', profileImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg/330px-Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg' },
      { name: 'Emily Blunt', character: 'Katherine "Kitty" Oppenheimer', role: 'Lead Actress', profileImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Emily_Blunt_at_WWD_Style_Awards_2026-02.jpg/330px-Emily_Blunt_at_WWD_Style_Awards_2026-02.jpg' },
      { name: 'Robert Downey Jr.', character: 'Lewis Strauss', role: 'Supporting Actor', profileImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/RobertDowneyJr-byPhilipRomano7_%28cropped%29.jpg/330px-RobertDowneyJr-byPhilipRomano7_%28cropped%29.jpg' },
      { name: 'Matt Damon', character: 'Leslie Groves', role: 'Supporting Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Matt_Damon_TIFF_2015.jpg/330px-Matt_Damon_TIFF_2015.jpg' },
      { name: 'Florence Pugh', character: 'Jean Tatlock', role: 'Supporting Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_02_%28cropped%29.jpg/330px-Florence_Pugh_at_the_2024_Toronto_International_Film_Festival_02_%28cropped%29.jpg' }
    ],
    crew: [
      { name: 'Christopher Nolan', role: 'Director & Screenplay', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/ChristopherNolan-byPhilipRomano_%28cropped%29.jpg/330px-ChristopherNolan-byPhilipRomano_%28cropped%29.jpg' },
      { name: 'Emma Thomas', role: 'Producer', department: 'Production', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Emma_Thomas_at_the_Oppenheimer_premiere.jpg/330px-Emma_Thomas_at_the_Oppenheimer_premiere.jpg' },
      { name: 'Hoyte van Hoytema', role: 'Cinematographer', department: 'Camera', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hoyte_van_Hoytema_at_Berlinale_2017.jpg/330px-Hoyte_van_Hoytema_at_Berlinale_2017.jpg' },
      { name: 'Ludwig Göransson', role: 'Original Score', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ludwig_G%C3%B6ransson_by_Gage_Skidmore.jpg/330px-Ludwig_G%C3%B6ransson_by_Gage_Skidmore.jpg' }
    ],
    trailers: [
      { title: 'Oppenheimer Official Trailer', youtubeKey: 'uYPbbksJxIg', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [],
    cityShowtimes: [],
    streamingAvailability: [
      {
        platform: 'JioCinema Premium',
        logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 29,
        currency: '₹',
        url: 'https://www.jiocinema.com',
        isAvailable: true,
        ottReleaseDate: new Date('2024-03-21'),
        lastUpdated: new Date()
      },
      {
        platform: 'Prime Video',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'rent',
        price: 149,
        currency: '₹',
        url: 'https://www.primevideo.com',
        isAvailable: true,
        ottReleaseDate: new Date('2023-11-21'),
        lastUpdated: new Date()
      }
    ]
  },

  // 2. Dune: Part Two (Hollywood, Now Showing & Theatrical)
  {
    title: 'Dune: Part Two',
    slug: 'dune-part-two',
    tmdbId: 693134,
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    releaseDate: new Date('2024-03-01'),
    releaseYear: 2024,
    runtime: 166,
    genres: ['Science Fiction', 'Adventure', 'Action'],
    languages: ['English'],
    country: 'United States',
    certification: 'PG-13',
    director: 'Denis Villeneuve',
    directorInfo: {
      name: 'Denis Villeneuve',
      profileImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg/330px-DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg',
      bio: 'Acclaimed Canadian director renowned for ambitious, visionary, and visually breathtaking science fiction and drama masterworks.'
    },
    productionCompanies: ['Legendary Pictures', 'Warner Bros. Pictures'],
    industry: 'hollywood',
    releaseStatus: 'now_showing',
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    ratingSummary: {
      imdbRating: 8.7,
      tmdbRating: 8.3,
      averageAudienceRating: 9.4,
      reviewCount: 512,
      ratingDistribution: { 1: 1, 2: 2, 3: 4, 4: 6, 5: 10, 6: 15, 7: 45, 8: 110, 9: 180, 10: 139 },
      positivePercentage: 92,
      negativePercentage: 3,
    },
    cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides', role: 'Lead Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Timoth%C3%A9e_Chalamet-6262.jpg/330px-Timoth%C3%A9e_Chalamet-6262.jpg' },
      { name: 'Zendaya', character: 'Chani', role: 'Lead Actress', profileImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Zendaya-byPhilipRomano.jpg/330px-Zendaya-byPhilipRomano.jpg' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica', role: 'Supporting Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rebecca_Ferguson_at_the_Mission_Impossible_Dead_Reckoning_Part_One_Premiere.jpg/330px-Rebecca_Ferguson_at_the_Mission_Impossible_Dead_Reckoning_Part_One_Premiere.jpg' },
      { name: 'Javier Bardem', character: 'Stilgar', role: 'Supporting Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Javier_Bardem_Cannes_2018.jpg/330px-Javier_Bardem_Cannes_2018.jpg' },
      { name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', role: 'Antagonist', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Austin_Butler_by_Gage_Skidmore.jpg/330px-Austin_Butler_by_Gage_Skidmore.jpg' }
    ],
    crew: [
      { name: 'Denis Villeneuve', role: 'Director & Screenplay', department: 'Directing', profileImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg/330px-DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg' },
      { name: 'Hans Zimmer', role: 'Original Score Composer', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Hans_Zimmer_at_the_2010_Toronto_International_Film_Festival.jpg/330px-Hans_Zimmer_at_the_2010_Toronto_International_Film_Festival.jpg' },
      { name: 'Greig Fraser', role: 'Director of Photography', department: 'Camera', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Greig_Fraser_at_Berlinale_2020.jpg/330px-Greig_Fraser_at_Berlinale_2020.jpg' }
    ],
    trailers: [
      { title: 'Dune: Part Two Official Trailer 3', youtubeKey: 'Way9Dexny3w', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [
      { cinema: 'PVR INOX: Phoenix Palladium, Lower Parel', city: 'Mumbai', format: 'IMAX Laser 2D', price: 380, bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
      { cinema: 'PVR Priya: Vasant Vihar', city: 'Delhi NCR', format: 'IMAX 2D', price: 340, bookingUrl: 'https://in.bookmyshow.com/explore/movies-ncr' },
      { cinema: 'PVR Forum Mall: Koramangala', city: 'Bengaluru', format: 'IMAX 2D', price: 320, bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' }
    ],
    cityShowtimes: makeCityShowtimes(['IMAX 2D', '4DX 2D', 'Dolby Atmos 2D']),
    streamingAvailability: [
      {
        platform: 'JioCinema Premium',
        logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 29,
        currency: '₹',
        url: 'https://www.jiocinema.com',
        isAvailable: true,
        ottReleaseDate: new Date('2024-05-21'),
        lastUpdated: new Date()
      }
    ]
  },

  // 3. Jawan (Bollywood, All-Time Record Blockbuster)
  {
    title: 'Jawan',
    slug: 'jawan',
    tmdbId: 872906,
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg',
    backdrop: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1600&q=80',
    overview: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society, backed by a personal vendetta while keeping a promise made years ago.',
    releaseDate: new Date('2023-09-07'),
    releaseYear: 2023,
    runtime: 169,
    genres: ['Action', 'Thriller', 'Drama'],
    languages: ['Hindi', 'Tamil', 'Telugu'],
    country: 'India',
    certification: 'UA',
    director: 'Atlee',
    directorInfo: {
      name: 'Atlee',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Atlee_in_2024.jpg',
      bio: 'Celebrated Indian film director and screenwriter known for delivering colossal high-octane commercial action spectacles.'
    },
    productionCompanies: ['Red Chillies Entertainment'],
    industry: 'bollywood',
    releaseStatus: 'now_showing',
    featured: true,
    trending: true,
    popular: true,
    topRated: false,
    ratingSummary: {
      imdbRating: 7.0,
      tmdbRating: 7.2,
      averageAudienceRating: 8.8,
      reviewCount: 380,
      ratingDistribution: { 1: 5, 2: 5, 3: 8, 4: 12, 5: 20, 6: 40, 7: 80, 8: 110, 9: 70, 10: 30 },
      positivePercentage: 81,
      negativePercentage: 6,
    },
    cast: [
      { name: 'Shah Rukh Khan', character: 'Vikram Rathore / Azad', role: 'Lead Actor (Double Role)', profileImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg/330px-Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg' },
      { name: 'Nayanthara', character: 'Narmada Rai', role: 'Lead Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Nayanthara_at_IFFI_2019.jpg/330px-Nayanthara_at_IFFI_2019.jpg' },
      { name: 'Vijay Sethupathi', character: 'Kaleeswaran', role: 'Lead Antagonist', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Vijay_Sethupathi_at_the_Super_Deluxe_press_meet.jpg/330px-Vijay_Sethupathi_at_the_Super_Deluxe_press_meet.jpg' },
      { name: 'Deepika Padukone', character: 'Aishwarya Rathore', role: 'Special Appearance', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Deepika_Padukone_at_Cannes_2022.jpg/330px-Deepika_Padukone_at_Cannes_2022.jpg' },
      { name: 'Sanya Malhotra', character: 'Dr. Eeram', role: 'Supporting Cast', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sanya_Malhotra_at_the_GQ_Men_of_the_Year_Awards_2022.jpg/330px-Sanya_Malhotra_at_the_GQ_Men_of_the_Year_Awards_2022.jpg' }
    ],
    crew: [
      { name: 'Atlee', role: 'Director & Screenplay', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Atlee_in_2024.jpg' },
      { name: 'Gauri Khan', role: 'Producer', department: 'Production', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Gauri_Khan_at_an_event.jpg/330px-Gauri_Khan_at_an_event.jpg' },
      { name: 'Anirudh Ravichander', role: 'Original Soundtrack & Score', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Anirudh_Ravichander_at_the_Leo_Success_Meet.jpg/330px-Anirudh_Ravichander_at_the_Leo_Success_Meet.jpg' }
    ],
    trailers: [
      { title: 'Jawan Official Prevue Hindi', youtubeKey: 'MWOlnZSnXJo', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg',
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [
      { cinema: 'INOX Megaplex: Inorbit Mall, Malad', city: 'Mumbai', format: 'Dolby Atmos 2D', price: 290, bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
      { cinema: 'PVR Priya: Vasant Vihar', city: 'Delhi NCR', format: 'Main Screen 2D', price: 300, bookingUrl: 'https://in.bookmyshow.com/explore/movies-ncr' }
    ],
    cityShowtimes: makeCityShowtimes(['Dolby Atmos 2D', '4DX 2D', 'Regular 2D']),
    streamingAvailability: [
      {
        platform: 'Netflix',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 199,
        currency: '₹',
        url: 'https://www.netflix.com',
        isAvailable: true,
        ottReleaseDate: new Date('2023-11-02'),
        lastUpdated: new Date()
      }
    ]
  },

  // 4. 12th Fail (Bollywood, Biographical Masterpiece)
  {
    title: '12th Fail',
    slug: '12th-fail',
    tmdbId: 1184918,
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg',
    backdrop: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    overview: 'Based on the true story of IPS officer Manoj Kumar Sharma who restarts his academic journey to clear the world’s toughest competitive exam—UPSC, demonstrating the sheer power of honesty and relentless perseverance.',
    releaseDate: new Date('2023-10-27'),
    releaseYear: 2023,
    runtime: 147,
    genres: ['Drama', 'Biography'],
    languages: ['Hindi'],
    country: 'India',
    certification: 'U',
    director: 'Vidhu Vinod Chopra',
    directorInfo: {
      name: 'Vidhu Vinod Chopra',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Vidhu_Vinod_Chopra.jpg/330px-Vidhu_Vinod_Chopra.jpg',
      bio: 'National Award-winning Indian director, producer, and screenwriter celebrated for authentic, heartfelt human storytelling.'
    },
    productionCompanies: ['Vinod Chopra Films', 'Zee Studios'],
    industry: 'bollywood',
    releaseStatus: 'now_showing',
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    ratingSummary: {
      imdbRating: 8.9,
      tmdbRating: 8.5,
      averageAudienceRating: 9.6,
      reviewCount: 640,
      ratingDistribution: { 1: 1, 2: 0, 3: 1, 4: 2, 5: 5, 6: 10, 7: 35, 8: 90, 9: 220, 10: 276 },
      positivePercentage: 96,
      negativePercentage: 1,
    },
    cast: [
      { name: 'Vikrant Massey', character: 'Manoj Kumar Sharma', role: 'Lead Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Vikrant_Massey_in_2023.jpg/330px-Vikrant_Massey_in_2023.jpg' },
      { name: 'Medha Shankr', character: 'Shraddha Joshi', role: 'Lead Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Medha_Shankr_at_12th_Fail_success_party_%28cropped%29.jpg/330px-Medha_Shankr_at_12th_Fail_success_party_%28cropped%29.jpg' },
      { name: 'Anant V Joshi', character: 'Pritam Pandey', role: 'Supporting Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Anant_V_Joshi.jpg/330px-Anant_V_Joshi.jpg' },
      { name: 'Anshumaan Pushkar', character: 'Gauri Bhaiya', role: 'Mentor / Supporting Actor', profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    crew: [
      { name: 'Vidhu Vinod Chopra', role: 'Director, Writer & Producer', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Vidhu_Vinod_Chopra.jpg/330px-Vidhu_Vinod_Chopra.jpg' },
      { name: 'Shantanu Moitra', role: 'Original Score', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Shantanu_Moitra.jpg/330px-Shantanu_Moitra.jpg' }
    ],
    trailers: [
      { title: '12th Fail Official Trailer', youtubeKey: 'we333qZ_p4o', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [
      { cinema: 'Cinépolis: Viviana Mall, Thane', city: 'Mumbai', format: 'Regular 2D', price: 210, bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
      { cinema: 'Raj Mandir Cinema', city: 'Jaipur', format: 'Grand Showcase', price: 180, bookingUrl: 'https://in.bookmyshow.com/explore/movies-jaipur' }
    ],
    cityShowtimes: makeCityShowtimes(['Dolby Atmos 2D', 'Regular 2D']),
    streamingAvailability: [
      {
        platform: 'Disney+ Hotstar',
        logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 299,
        currency: '₹',
        url: 'https://www.hotstar.com',
        isAvailable: true,
        ottReleaseDate: new Date('2023-12-29'),
        lastUpdated: new Date()
      }
    ]
  },

  // 5. Stree 2: Sarkate Ka Aatank (Bollywood, Now Showing)
  {
    title: 'Stree 2: Sarkate Ka Aatank',
    slug: 'stree-2',
    tmdbId: 1111873,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Stree_2.jpg',
    backdrop: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1600&q=80',
    overview: 'After the events of Stree, the historic town of Chanderi is plagued by a new headless terror called Sarkata who abducts progressive women. Vicky, Bittu, Jana, and Rudra must team up once more with the mysterious woman to rescue their town.',
    releaseDate: new Date('2024-08-15'),
    releaseYear: 2024,
    runtime: 149,
    genres: ['Comedy', 'Horror'],
    languages: ['Hindi'],
    country: 'India',
    certification: 'UA',
    director: 'Amar Kaushik',
    directorInfo: {
      name: 'Amar Kaushik',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Amar_Kaushik_at_Bhediya_trailer_launch.jpg/330px-Amar_Kaushik_at_Bhediya_trailer_launch.jpg',
      bio: 'Leading contemporary director who pioneered the blockbuster horror-comedy universe in Indian cinema.'
    },
    productionCompanies: ['Maddock Films', 'Jio Studios'],
    industry: 'bollywood',
    releaseStatus: 'now_showing',
    featured: true,
    trending: true,
    popular: true,
    topRated: false,
    ratingSummary: {
      imdbRating: 7.6,
      tmdbRating: 7.4,
      averageAudienceRating: 8.7,
      reviewCount: 310,
      ratingDistribution: { 1: 3, 2: 2, 3: 4, 4: 8, 5: 15, 6: 35, 7: 75, 8: 95, 9: 50, 10: 23 },
      positivePercentage: 84,
      negativePercentage: 5,
    },
    cast: [
      { name: 'Shraddha Kapoor', character: 'The Girl with No Name', role: 'Lead Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Shraddha_Kapoor_promoting_Tu_Jhoothi_Main_Makkaar.jpg/330px-Shraddha_Kapoor_promoting_Tu_Jhoothi_Main_Makkaar.jpg' },
      { name: 'Rajkummar Rao', character: 'Vicky', role: 'Lead Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Rajkummar_Rao_at_the_54th_IFFI.jpg/330px-Rajkummar_Rao_at_the_54th_IFFI.jpg' },
      { name: 'Pankaj Tripathi', character: 'Rudra Bhaiya', role: 'Supporting Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Pankaj_Tripathi_at_53rd_IFFI.jpg/330px-Pankaj_Tripathi_at_53rd_IFFI.jpg' },
      { name: 'Aparshakti Khurana', character: 'Bittu', role: 'Supporting Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Aparshakti_Khurana_in_2024.jpg/330px-Aparshakti_Khurana_in_2024.jpg' },
      { name: 'Abhishek Banerjee', character: 'Jana', role: 'Supporting Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Abhishek_Banerjee_grace_the_premiere_of_Kill_%28cropped%29.jpg' }
    ],
    crew: [
      { name: 'Amar Kaushik', role: 'Director', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Amar_Kaushik_at_Bhediya_trailer_launch.jpg/330px-Amar_Kaushik_at_Bhediya_trailer_launch.jpg' },
      { name: 'Dinesh Vijan', role: 'Producer', department: 'Production', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Dinesh_Vijan_at_an_event.jpg/330px-Dinesh_Vijan_at_an_event.jpg' },
      { name: 'Niren Bhatt', role: 'Writer', department: 'Writing', profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Stree 2 Official Trailer', youtubeKey: 'KVnKKb8c-YQ', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/a/a1/Stree_2.jpg',
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [
      { cinema: 'PVR INOX: Phoenix Palladium', city: 'Mumbai', format: 'Dolby Atmos 2D', price: 320, bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
      { cinema: 'Cinépolis: Seasons Mall', city: 'Pune', format: 'VIP 2D', price: 280, bookingUrl: 'https://in.bookmyshow.com/explore/movies-pune' }
    ],
    cityShowtimes: makeCityShowtimes(['Dolby Atmos 2D', 'Regular 2D']),
    streamingAvailability: [
      {
        platform: 'Prime Video',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'rent',
        price: 199,
        currency: '₹',
        url: 'https://www.primevideo.com',
        isAvailable: true,
        ottReleaseDate: new Date('2024-09-27'),
        lastUpdated: new Date()
      }
    ]
  },

  // 6. RRR (South Indian, Academy Award Winner)
  {
    title: 'RRR (Rise Roar Revolt)',
    slug: 'rrr',
    tmdbId: 579974,
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg',
    backdrop: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=1600&q=80',
    overview: 'A fictionalized chronicle of two legendary Indian revolutionaries—Alluri Sitarama Raju and Komaram Bheem—who forge a deep brotherly bond before discovering each other’s secret identities and standing united against the British Raj.',
    releaseDate: new Date('2022-03-25'),
    releaseYear: 2022,
    runtime: 187,
    genres: ['Action', 'Drama'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam'],
    country: 'India',
    certification: 'UA',
    director: 'S. S. Rajamouli',
    directorInfo: {
      name: 'S. S. Rajamouli',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S._S._Rajamouli_at_the_RRR_press_meet.jpg/330px-S._S._Rajamouli_at_the_RRR_press_meet.jpg',
      bio: 'Visionary Indian auteur whose kinetic visual grandeur and emotional epics have garnered global acclaim and Academy recognition.'
    },
    productionCompanies: ['DVV Entertainment'],
    industry: 'south_indian',
    releaseStatus: 'now_showing',
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    ratingSummary: {
      imdbRating: 7.8,
      tmdbRating: 7.8,
      averageAudienceRating: 9.2,
      reviewCount: 490,
      ratingDistribution: { 1: 2, 2: 3, 3: 5, 4: 8, 5: 12, 6: 25, 7: 60, 8: 110, 9: 145, 10: 120 },
      positivePercentage: 89,
      negativePercentage: 3,
    },
    cast: [
      { name: 'N. T. Rama Rao Jr.', character: 'Komaram Bheem', role: 'Lead Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/N._T._Rama_Rao_Jr._at_the_RRR_press_meet.jpg/330px-N._T._Rama_Rao_Jr._at_the_RRR_press_meet.jpg' },
      { name: 'Ram Charan', character: 'Alluri Sitarama Raju', role: 'Lead Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ram_Charan_at_the_RRR_press_meet.jpg/330px-Ram_Charan_at_the_RRR_press_meet.jpg' },
      { name: 'Alia Bhatt', character: 'Sita', role: 'Supporting Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Alia_Bhatt_at_Berlinale_2022.jpg/330px-Alia_Bhatt_at_Berlinale_2022.jpg' },
      { name: 'Ajay Devgn', character: 'Venkata Rama Raju', role: 'Cameo / Mentor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ajay_Devgn_promoting_Tanhaji.jpg/330px-Ajay_Devgn_promoting_Tanhaji.jpg' }
    ],
    crew: [
      { name: 'S. S. Rajamouli', role: 'Director & Screenplay', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S._S._Rajamouli_at_the_RRR_press_meet.jpg/330px-S._S._Rajamouli_at_the_RRR_press_meet.jpg' },
      { name: 'M. M. Keeravani', role: 'Original Soundtrack (Oscar Winner)', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/M._M._Keeravani_at_the_RRR_press_meet.jpg/330px-M._M._Keeravani_at_the_RRR_press_meet.jpg' },
      { name: 'K. K. Senthil Kumar', role: 'Cinematography', department: 'Camera', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/K._K._Senthil_Kumar.jpg/330px-K._K._Senthil_Kumar.jpg' }
    ],
    trailers: [
      { title: 'RRR Official Trailer', youtubeKey: 'NgBoAMgp6tQ', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg',
      'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [
      { cinema: 'Prasads Multiplex', city: 'Hyderabad', format: 'Large Screen PCX', price: 250, bookingUrl: 'https://in.bookmyshow.com/explore/movies-hyderabad' },
      { cinema: 'Sathyam Cinemas (SPI)', city: 'Chennai', format: 'Dolby Atmos', price: 220, bookingUrl: 'https://in.bookmyshow.com/explore/movies-chennai' }
    ],
    cityShowtimes: makeCityShowtimes(['Dolby Atmos 2D', 'Large Screen PCX', 'Regular 2D']),
    streamingAvailability: [
      {
        platform: 'Netflix',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 199,
        currency: '₹',
        url: 'https://www.netflix.com',
        isAvailable: true,
        ottReleaseDate: new Date('2022-05-20'),
        lastUpdated: new Date()
      },
      {
        platform: 'ZEE5',
        logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 99,
        currency: '₹',
        url: 'https://www.zee5.com',
        isAvailable: true,
        ottReleaseDate: new Date('2022-05-20'),
        lastUpdated: new Date()
      }
    ]
  },

  // 7. Kantara: A Legend (South Indian, Folk Phenomenon)
  {
    title: 'Kantara: A Legend',
    slug: 'kantara',
    tmdbId: 1024546,
    poster: 'https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    overview: 'In a coastal Karnataka village, a hot-tempered Kambala champion clashes with a no-nonsense forest officer over ancestral tribal land, awaking the divine spirit of Guliga and Panjurli Daiva.',
    releaseDate: new Date('2022-09-30'),
    releaseYear: 2022,
    runtime: 148,
    genres: ['Action', 'Thriller', 'Mystery'],
    languages: ['Kannada', 'Hindi', 'Telugu', 'Tamil'],
    country: 'India',
    certification: 'UA',
    director: 'Rishab Shetty',
    directorInfo: {
      name: 'Rishab Shetty',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rishab_Shetty_at_53rd_IFFI.jpg/330px-Rishab_Shetty_at_53rd_IFFI.jpg',
      bio: 'Versatile Kannada filmmaker and actor celebrated for bringing indigenous folklore and divine Bootha Kola rituals to worldwide audiences.'
    },
    productionCompanies: ['Hombale Films'],
    industry: 'south_indian',
    releaseStatus: 'now_showing',
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    ratingSummary: {
      imdbRating: 8.2,
      tmdbRating: 8.1,
      averageAudienceRating: 9.3,
      reviewCount: 410,
      ratingDistribution: { 1: 1, 2: 2, 3: 4, 4: 6, 5: 10, 6: 22, 7: 55, 8: 95, 9: 125, 10: 90 },
      positivePercentage: 90,
      negativePercentage: 3,
    },
    cast: [
      { name: 'Rishab Shetty', character: 'Shiva / Kaadubettu Shiva', role: 'Lead Actor & Daiva Performer', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rishab_Shetty_at_53rd_IFFI.jpg/330px-Rishab_Shetty_at_53rd_IFFI.jpg' },
      { name: 'Sapthami Gowda', character: 'Leela', role: 'Lead Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Sapthami_Gowda_at_IFFI_2022.jpg/330px-Sapthami_Gowda_at_IFFI_2022.jpg' },
      { name: 'Kishore', character: 'Murali (Range Forest Officer)', role: 'Supporting Lead', profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Achyuth Kumar', character: 'Devendra Suttooru', role: 'Antagonist', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Achyuth_Kumar_at_an_event.jpg/330px-Achyuth_Kumar_at_an_event.jpg' }
    ],
    crew: [
      { name: 'Rishab Shetty', role: 'Director & Writer', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rishab_Shetty_at_53rd_IFFI.jpg/330px-Rishab_Shetty_at_53rd_IFFI.jpg' },
      { name: 'Vijay Kiragandur', role: 'Producer', department: 'Production', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Vijay_Kiragandur.jpg/330px-Vijay_Kiragandur.jpg' },
      { name: 'B. Ajaneesh Loknath', role: 'Original Background Score', department: 'Sound', profileImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Kantara Official Hindi Trailer', youtubeKey: '6oKfvi_PK8Y', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [
      { cinema: 'PVR: Forum Mall, Koramangala', city: 'Bengaluru', format: 'Dolby Atmos 2D', price: 260, bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' }
    ],
    cityShowtimes: makeCityShowtimes(['Dolby Atmos 2D', 'Regular 2D']),
    streamingAvailability: [
      {
        platform: 'Prime Video',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 179,
        currency: '₹',
        url: 'https://www.primevideo.com',
        isAvailable: true,
        ottReleaseDate: new Date('2022-11-24'),
        lastUpdated: new Date()
      },
      {
        platform: 'Netflix (Hindi)',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 199,
        currency: '₹',
        url: 'https://www.netflix.com',
        isAvailable: true,
        ottReleaseDate: new Date('2022-12-09'),
        lastUpdated: new Date()
      }
    ]
  },

  // 8. Spirited Away (Anime, Studio Ghibli Classic)
  {
    title: 'Spirited Away',
    slug: 'spirited-away',
    tmdbId: 129,
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png',
    backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    overview: 'A young girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts. After her parents are transformed into pigs, she takes a job in a mystical bathhouse to earn their freedom.',
    releaseDate: new Date('2001-07-20'),
    releaseYear: 2001,
    runtime: 125,
    genres: ['Animation', 'Family', 'Fantasy'],
    languages: ['Japanese', 'English'],
    country: 'Japan',
    certification: 'PG',
    director: 'Hayao Miyazaki',
    directorInfo: {
      name: 'Hayao Miyazaki',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Hayao_Miyazaki_cropped_1_Hayao_Miyazaki_201211.jpg/330px-Hayao_Miyazaki_cropped_1_Hayao_Miyazaki_201211.jpg',
      bio: 'Legendary Japanese animator, director, and Studio Ghibli co-founder considered one of the greatest animation auteurs in history.'
    },
    productionCompanies: ['Studio Ghibli', 'Nippon Television Network'],
    industry: 'anime',
    releaseStatus: 'streaming',
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    ratingSummary: {
      imdbRating: 8.6,
      tmdbRating: 8.5,
      averageAudienceRating: 9.5,
      reviewCount: 520,
      ratingDistribution: { 1: 1, 2: 1, 3: 2, 4: 5, 5: 8, 6: 15, 7: 45, 8: 95, 9: 180, 10: 168 },
      positivePercentage: 94,
      negativePercentage: 2,
    },
    cast: [
      { name: 'Rumi Hiiragi', character: 'Chihiro Ogino (voice)', role: 'Lead Voice', profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Miyu Irino', character: 'Haku (voice)', role: 'Lead Voice', profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
      { name: 'Mari Natsuki', character: 'Yubaba / Zeniba (voice)', role: 'Supporting Voice', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Mari_Natsuki_at_Tokyo_International_Film_Festival_2015.jpg/330px-Mari_Natsuki_at_Tokyo_International_Film_Festival_2015.jpg' }
    ],
    crew: [
      { name: 'Hayao Miyazaki', role: 'Director & Original Writer', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Hayao_Miyazaki_cropped_1_Hayao_Miyazaki_201211.jpg/330px-Hayao_Miyazaki_cropped_1_Hayao_Miyazaki_201211.jpg' },
      { name: 'Joe Hisaishi', role: 'Original Symphony Score', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Joe_Hisaishi_Cannes_2008.jpg/330px-Joe_Hisaishi_Cannes_2008.jpg' },
      { name: 'Toshio Suzuki', role: 'Producer', department: 'Production', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Toshio_Suzuki_at_the_Annecy_International_Animated_Film_Festival_2018.jpg/330px-Toshio_Suzuki_at_the_Annecy_International_Animated_Film_Festival_2018.jpg' }
    ],
    trailers: [
      { title: 'Spirited Away Official Studio Ghibli Trailer', youtubeKey: 'ByXuk9QqQkk', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [],
    cityShowtimes: [],
    streamingAvailability: [
      {
        platform: 'Netflix',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 199,
        currency: '₹',
        url: 'https://www.netflix.com',
        isAvailable: true,
        ottReleaseDate: new Date('2020-03-01'),
        lastUpdated: new Date()
      }
    ]
  },

  // 9. Suzume (Anime, Modern Masterpiece)
  {
    title: 'Suzume',
    slug: 'suzume',
    tmdbId: 926393,
    poster: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    overview: 'A 17-year-old girl named Suzume helps a mysterious young man close mystical doors unleashing devastation across ruins throughout Japan.',
    releaseDate: new Date('2022-11-11'),
    releaseYear: 2022,
    runtime: 122,
    genres: ['Animation', 'Drama', 'Fantasy'],
    languages: ['Japanese', 'Hindi', 'English'],
    country: 'Japan',
    certification: 'PG',
    director: 'Makoto Shinkai',
    directorInfo: {
      name: 'Makoto Shinkai',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Makoto_Shinkai_at_Berlinale_2023.jpg/330px-Makoto_Shinkai_at_Berlinale_2023.jpg',
      bio: 'Renowned modern anime filmmaker acclaimed for evocative themes of connection, memory, and breathtaking celestial landscapes.'
    },
    productionCompanies: ['CoMix Wave Films', 'Story Inc.', 'Toho'],
    industry: 'anime',
    releaseStatus: 'streaming',
    featured: false,
    trending: true,
    popular: true,
    topRated: false,
    ratingSummary: {
      imdbRating: 7.7,
      tmdbRating: 7.8,
      averageAudienceRating: 8.9,
      reviewCount: 290,
      ratingDistribution: { 1: 2, 2: 2, 3: 4, 4: 8, 5: 14, 6: 28, 7: 65, 8: 85, 9: 50, 10: 32 },
      positivePercentage: 86,
      negativePercentage: 4,
    },
    cast: [
      { name: 'Nanoka Hara', character: 'Suzume Iwato (voice)', role: 'Lead Voice', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Nanoka_Hara_at_Berlinale_2023.jpg/330px-Nanoka_Hara_at_Berlinale_2023.jpg' },
      { name: 'Hokuto Matsumura', character: 'Souta Munakata (voice)', role: 'Lead Voice', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hokuto_Matsumura_at_Berlinale_2023.jpg/330px-Hokuto_Matsumura_at_Berlinale_2023.jpg' },
      { name: 'Eri Fukatsu', character: 'Tamaki Iwato (voice)', role: 'Supporting Voice', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Eri_Fukatsu_at_Busan_International_Film_Festival_2010.jpg/330px-Eri_Fukatsu_at_Busan_International_Film_Festival_2010.jpg' }
    ],
    crew: [
      { name: 'Makoto Shinkai', role: 'Director, Writer & Creator', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Makoto_Shinkai_at_Berlinale_2023.jpg/330px-Makoto_Shinkai_at_Berlinale_2023.jpg' },
      { name: 'Radwimps', role: 'Music & Original Soundtrack', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Radwimps_in_2019.jpg/330px-Radwimps_in_2019.jpg' }
    ],
    trailers: [
      { title: 'Suzume Official English Subbed Trailer', youtubeKey: 'FsTe_rhyv_A', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [],
    cityShowtimes: [],
    streamingAvailability: [
      {
        platform: 'Netflix',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 199,
        currency: '₹',
        url: 'https://www.netflix.com',
        isAvailable: true,
        ottReleaseDate: new Date('2024-03-06'),
        lastUpdated: new Date()
      }
    ]
  },

  // 10. Avatar: Fire and Ash (Upcoming Hollywood Epic)
  {
    title: 'Avatar: Fire and Ash',
    slug: 'avatar-fire-and-ash',
    tmdbId: 83533,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/95/Avatar_Fire_and_Ash_poster.jpeg',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    overview: 'The third installment in James Cameron’s revolutionary Avatar franchise, introducing the aggressive Ash People—a fire-dwelling clan of Na’vi who inhabit the volatile volcanic regions of Pandora.',
    releaseDate: new Date('2025-12-19'),
    releaseYear: 2025,
    runtime: 190,
    genres: ['Science Fiction', 'Action', 'Adventure', 'Fantasy'],
    languages: ['English'],
    country: 'United States',
    certification: 'PG-13',
    director: 'James Cameron',
    directorInfo: {
      name: 'James Cameron',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/James_Cameron_by_Gage_Skidmore.jpg/330px-James_Cameron_by_Gage_Skidmore.jpg',
      bio: 'Pioneering Oscar-winning director known for revolutionizing cinematic technology, underwater exploration, and world-building.'
    },
    productionCompanies: ['Lightstorm Entertainment', '20th Century Studios'],
    industry: 'hollywood',
    releaseStatus: 'upcoming',
    featured: true,
    trending: true,
    popular: true,
    topRated: false,
    ratingSummary: {
      imdbRating: 0,
      tmdbRating: 0,
      averageAudienceRating: 0,
      reviewCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
      positivePercentage: 0,
      negativePercentage: 0,
    },
    cast: [
      { name: 'Sam Worthington', character: 'Jake Sully', role: 'Lead Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sam_Worthington_2013.jpg/330px-Sam_Worthington_2013.jpg' },
      { name: 'Zoe Saldaña', character: 'Neytiri', role: 'Lead Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Zoe_Saldana_at_the_2024_Cannes_Film_Festival.jpg/330px-Zoe_Saldana_at_the_2024_Cannes_Film_Festival.jpg' },
      { name: 'Sigourney Weaver', character: 'Kiri', role: 'Supporting Cast', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Sigourney_Weaver_at_the_Venice_Film_Festival_2024.jpg/330px-Sigourney_Weaver_at_the_Venice_Film_Festival_2024.jpg' },
      { name: 'Stephen Lang', character: 'Colonel Miles Quaritch', role: 'Lead Antagonist', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Stephen_Lang_by_Gage_Skidmore_2.jpg/330px-Stephen_Lang_by_Gage_Skidmore_2.jpg' },
      { name: 'Kate Winslet', character: 'Ronal', role: 'Supporting Cast', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kate_Winslet_at_the_2023_Toronto_International_Film_Festival.jpg/330px-Kate_Winslet_at_the_2023_Toronto_International_Film_Festival.jpg' }
    ],
    crew: [
      { name: 'James Cameron', role: 'Director, Writer & Producer', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/James_Cameron_by_Gage_Skidmore.jpg/330px-James_Cameron_by_Gage_Skidmore.jpg' },
      { name: 'Jon Landau', role: 'Producer', department: 'Production', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jon_Landau_2019.jpg/330px-Jon_Landau_2019.jpg' },
      { name: 'Simon Franglen', role: 'Original Music', department: 'Sound', profileImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80' }
    ],
    trailers: [
      { title: 'Avatar: Fire and Ash Title Announcement & Concept Reveal', youtubeKey: 'O_8Q7Z0aKz0', isOfficial: true, type: 'Teaser' }
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/9/95/Avatar_Fire_and_Ash_poster.jpeg',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [],
    cityShowtimes: [],
    streamingAvailability: []
  },

  // 11. Kalki 2898 AD: Part 2 (Upcoming Sci-Fi Epic)
  {
    title: 'Kalki 2898 AD: Part 2',
    slug: 'kalki-2898-ad-part-2',
    tmdbId: 76341,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    overview: 'The climactic chapter of the dystopian mythological saga. Supreme Yaskin harnesses the divine power of the unborn child serum, initiating the total war between the Complex and the rebel city of Shambhala.',
    releaseDate: new Date('2026-05-08'),
    releaseYear: 2026,
    runtime: 180,
    genres: ['Science Fiction', 'Action', 'Fantasy'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    country: 'India',
    certification: 'UA',
    director: 'Nag Ashwin',
    directorInfo: {
      name: 'Nag Ashwin',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Nag_Ashwin_at_Mahanati_audio_launch.jpg/330px-Nag_Ashwin_at_Mahanati_audio_launch.jpg',
      bio: 'Ambitious visionary Indian filmmaker seamlessly blending ancient Hindu mythology with futuristic dystopian sci-fi cyberpunk worlds.'
    },
    productionCompanies: ['Vyjayanthi Movies'],
    industry: 'south_indian',
    releaseStatus: 'upcoming',
    featured: true,
    trending: true,
    popular: false,
    topRated: false,
    ratingSummary: {
      imdbRating: 0,
      tmdbRating: 0,
      averageAudienceRating: 0,
      reviewCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
      positivePercentage: 0,
      negativePercentage: 0,
    },
    cast: [
      { name: 'Prabhas', character: 'Bhairava / Karna', role: 'Lead Actor', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Prabhas_at_Saaho_event.jpg/330px-Prabhas_at_Saaho_event.jpg' },
      { name: 'Amitabh Bachchan', character: 'Ashwatthama', role: 'Immortal Warrior', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Amitabh_Bachchan_2015.jpg/330px-Amitabh_Bachchan_2015.jpg' },
      { name: 'Kamal Haasan', character: 'Supreme Yaskin', role: 'Main Antagonist', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kamal_Haasan_at_Vikram_event.jpg/330px-Kamal_Haasan_at_Vikram_event.jpg' },
      { name: 'Deepika Padukone', character: 'SUM-80 / Sumathi', role: 'Lead Actress', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Deepika_Padukone_at_Cannes_2022.jpg/330px-Deepika_Padukone_at_Cannes_2022.jpg' },
      { name: 'Disha Patani', character: 'Roxie', role: 'Supporting Cast', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Disha_Patani_at_GQ_Men_of_the_Year_Awards_2022.jpg/330px-Disha_Patani_at_GQ_Men_of_the_Year_Awards_2022.jpg' }
    ],
    crew: [
      { name: 'Nag Ashwin', role: 'Director & Screenplay', department: 'Directing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Nag_Ashwin_at_Mahanati_audio_launch.jpg/330px-Nag_Ashwin_at_Mahanati_audio_launch.jpg' },
      { name: 'C. Aswani Dutt', role: 'Producer', department: 'Production', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/C._Aswani_Dutt.jpg/330px-C._Aswani_Dutt.jpg' },
      { name: 'Santhosh Narayanan', role: 'Music Composer', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Santhosh_Narayanan_at_an_event.jpg/330px-Santhosh_Narayanan_at_an_event.jpg' }
    ],
    trailers: [
      { title: 'Kalki 2898 AD Part 2 Teaser Announcement', youtubeKey: 'y1-w1pgo87A', isOfficial: true, type: 'Teaser' }
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80'
    ],
    ticketPricing: [],
    cityShowtimes: [],
    streamingAvailability: []
  },

  // 12. Spider-Man: Across the Spider-Verse
  {
    title: 'Spider-Man: Across the Spider-Verse',
    slug: 'spider-man-across-the-spider-verse',
    tmdbId: 569094,
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    overview: 'After reuniting with Gwen Stacy, Brooklyn’s full-time friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.',
    releaseDate: new Date('2023-06-02'),
    releaseYear: 2023,
    runtime: 140,
    genres: ['Animation', 'Action', 'Adventure', 'Science Fiction'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    country: 'United States',
    certification: 'PG',
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    directorInfo: {
      name: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
      profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Joaquim_Dos_Santos_by_Gage_Skidmore.jpg/330px-Joaquim_Dos_Santos_by_Gage_Skidmore.jpg',
      bio: 'Celebrated creative trio pushing the visual boundaries of comic book artistry and multidisciplinary animation.'
    },
    productionCompanies: ['Columbia Pictures', 'Sony Pictures Animation', 'Marvel Entertainment'],
    industry: 'hollywood',
    releaseStatus: 'streaming',
    featured: false,
    trending: true,
    popular: true,
    topRated: true,
    ratingSummary: {
      imdbRating: 8.6,
      tmdbRating: 8.4,
      averageAudienceRating: 9.3,
      reviewCount: 395,
      ratingDistribution: { 1: 1, 2: 2, 3: 3, 4: 5, 5: 9, 6: 15, 7: 40, 8: 90, 9: 130, 10: 100 },
      positivePercentage: 91,
      negativePercentage: 3,
    },
    cast: [
      { name: 'Shameik Moore', character: 'Miles Morales (voice)', role: 'Lead Voice', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Shameik_Moore_by_Gage_Skidmore.jpg/330px-Shameik_Moore_by_Gage_Skidmore.jpg' },
      { name: 'Hailee Steinfeld', character: 'Gwen Stacy (voice)', role: 'Lead Voice', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Hailee_Steinfeld_at_the_2023_Golden_Globes.jpg/330px-Hailee_Steinfeld_at_the_2023_Golden_Globes.jpg' },
      { name: 'Oscar Isaac', character: 'Miguel O\'Hara (voice)', role: 'Supporting Voice', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Oscar_Isaac_at_the_2022_Comic-Con.jpg/330px-Oscar_Isaac_at_the_2022_Comic-Con.jpg' },
      { name: 'Daniel Kaluuya', character: 'Hobie Brown / Spider-Punk (voice)', role: 'Supporting Voice', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Daniel_Kaluuya_at_the_2021_Oscars.jpg/330px-Daniel_Kaluuya_at_the_2021_Oscars.jpg' }
    ],
    crew: [
      { name: 'Phil Lord & Christopher Miller', role: 'Screenplay & Producer', department: 'Writing', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Phil_Lord_%26_Christopher_Miller_by_Gage_Skidmore.jpg/330px-Phil_Lord_%26_Christopher_Miller_by_Gage_Skidmore.jpg' },
      { name: 'Daniel Pemberton', role: 'Original Score', department: 'Sound', profileImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Daniel_Pemberton.jpg/330px-Daniel_Pemberton.jpg' }
    ],
    trailers: [
      { title: 'Spider-Man: Across the Spider-Verse Official Trailer #2', youtubeKey: 'cqGjhVJWtEg', isOfficial: true, type: 'Trailer' }
    ],
    images: [
      'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
      'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg'
    ],
    ticketPricing: [],
    cityShowtimes: [],
    streamingAvailability: [
      {
        platform: 'Netflix',
        logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=100&q=80',
        type: 'subscription',
        price: 199,
        currency: '₹',
        url: 'https://www.netflix.com',
        isAvailable: true,
        ottReleaseDate: new Date('2023-10-31'),
        lastUpdated: new Date()
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenkai_dev';
    await mongoose.connect(mongoUri);
    console.log(`[Seed ZENKAI] Connected to database: ${mongoUri}`);

    await Movie.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('[Seed ZENKAI] Cleared existing movies, users, and reviews');

    // Create Admin User & Test User with ZENKAI domains
    const adminUser = await User.create({
      name: 'ZENKAI Admin',
      email: 'admin@zenkai.com',
      password: 'Admin@12345Password!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      bio: 'Chief Film & Music Curator at ZENKAI Entertainment.',
    });

    const reviewerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'user@zenkai.com',
      password: 'User@12345Password!',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      bio: 'Cinema buff and live music festival enthusiast.',
    });

    const criticUser = await User.create({
      name: 'Rohan Mehra',
      email: 'critic@zenkai.com',
      password: 'Critic@12345Password!',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      bio: 'Lead critic for ZENKAI Cinema & Music Review.',
    });

    console.log('[Seed ZENKAI] Created default users:');
    console.log('   Admin: admin@zenkai.com / Admin@12345Password!');
    console.log('   User:  user@zenkai.com / User@12345Password!');

    const createdMovies = await Movie.insertMany(curatedMovies);
    console.log(`[Seed ZENKAI] Successfully inserted ${createdMovies.length} curated movies!`);

    const oppenheimer = createdMovies.find((m) => m.slug === 'oppenheimer');
    const dune = createdMovies.find((m) => m.slug === 'dune-part-two');
    const fail12 = createdMovies.find((m) => m.slug === '12th-fail');

    const sampleReviews = [
      {
        movie: oppenheimer._id,
        user: reviewerUser._id,
        rating: 10,
        title: 'A towering cinematic achievement and a masterclass in biographical storytelling',
        content: 'Cillian Murphy gives the performance of a lifetime. The pacing during the Trinity test sequence left the entire theatre breathless with absolute silence. Ludwig Göransson’s score drives the film forward with relentless anxiety and philosophical weight.',
        helpfulCount: 42,
        isCriticReview: false,
      },
      {
        movie: oppenheimer._id,
        user: criticUser._id,
        rating: 9,
        title: 'Christopher Nolan’s most human and chilling spectacle yet',
        content: 'Rather than romanticizing technological power, Nolan examines the internal torment of Prometheus unbound. Robert Downey Jr. matches Murphy stride for stride in a razor-sharp political duel.',
        helpfulCount: 28,
        isCriticReview: true,
        criticName: 'Rohan Mehra',
        criticOutlet: 'ZENKAI Staff Critic',
      },
      {
        movie: dune._id,
        user: reviewerUser._id,
        rating: 10,
        title: 'Sci-fi cinema on a scale unseen since The Lord of the Rings',
        content: 'Denis Villeneuve has crafted a visual and auditory wonder. The sand worm rides, the gladiatorial arena on Giedi Prime in stark monochrome, and Zimmer’s earth-shattering bass must be experienced on the biggest IMAX screen possible.',
        helpfulCount: 65,
        isCriticReview: false,
      },
      {
        movie: fail12._id,
        user: reviewerUser._id,
        rating: 10,
        title: 'Deeply inspirational, honest, and profoundly moving',
        content: '12th Fail represents Indian cinema at its most sincere. Vikrant Massey completely disappears into Manoj Kumar Sharma’s struggles, creating an emotional triumph that resonates with anyone who has ever dared to restart against all odds.',
        helpfulCount: 88,
        isCriticReview: false,
      }
    ];

    await Review.insertMany(sampleReviews);

    reviewerUser.watchlist.push(createdMovies[9]._id);
    reviewerUser.favourites.push(oppenheimer._id);
    reviewerUser.watched.push(oppenheimer._id, dune._id, fail12._id);
    await reviewerUser.save();

    console.log('[Seed ZENKAI] Database initialization complete for zenkai_dev!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed ZENKAI] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
