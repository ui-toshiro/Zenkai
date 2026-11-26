import fs from 'fs';

// Helper to make showtimes for all 14 cities
function generateAllCitiesShowtimes() {
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
                { time: '10:15 AM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 280, currency: '₹', availableSeats: 52 }, { category: 'Executive', price: 420, currency: '₹', availableSeats: 28 }, { category: 'Recliner / VIP', price: 750, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '01:45 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 320, currency: '₹', availableSeats: 14 }, { category: 'Executive', price: 480, currency: '₹', availableSeats: 8 }, { category: 'Recliner / VIP', price: 850, currency: '₹', availableSeats: 2 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' },
                { time: '05:30 PM', format: 'IMAX 2D', language: 'Original / Hindi', status: 'almost_full', seatCategories: [{ category: 'Normal', price: 380, currency: '₹', availableSeats: 4 }, { category: 'Executive', price: 550, currency: '₹', availableSeats: 3 }, { category: 'Recliner / VIP', price: 950, currency: '₹', availableSeats: 0 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-mumbai' }
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
        }
      ]
    },
    {
      city: 'Lucknow',
      theatres: [
        {
          cinema: 'PVR: Phoenix Palassio Mall, Amar Shaheed Path',
          theatreChain: 'PVR INOX',
          theatreType: 'IMAX with Laser & LUXE',
          address: 'Sector 7, Gomti Nagar Extension, Lucknow',
          distance: '2.8 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '10:30 AM', format: 'IMAX 2D', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 220, currency: '₹', availableSeats: 60 }, { category: 'Executive', price: 340, currency: '₹', availableSeats: 35 }, { category: 'Recliner / VIP', price: 650, currency: '₹', availableSeats: 14 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '02:15 PM', format: 'IMAX 2D', language: 'Hindi / English', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 260, currency: '₹', availableSeats: 22 }, { category: 'Executive', price: 380, currency: '₹', availableSeats: 14 }, { category: 'Recliner / VIP', price: 700, currency: '₹', availableSeats: 5 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '06:45 PM', format: 'LUXE VIP', language: 'Hindi / English', status: 'almost_full', seatCategories: [{ category: 'Normal', price: 290, currency: '₹', availableSeats: 8 }, { category: 'Executive', price: 420, currency: '₹', availableSeats: 4 }, { category: 'Recliner / VIP', price: 800, currency: '₹', availableSeats: 2 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '09:30 PM', format: 'IMAX 2D', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 250, currency: '₹', availableSeats: 40 }, { category: 'Executive', price: 360, currency: '₹', availableSeats: 20 }, { category: 'Recliner / VIP', price: 680, currency: '₹', availableSeats: 8 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' }
              ]
            },
            {
              date: '2026-11-24',
              label: 'Tomorrow',
              shows: [
                { time: '11:00 AM', format: 'IMAX 2D', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 200, currency: '₹', availableSeats: 65 }, { category: 'Executive', price: 320, currency: '₹', availableSeats: 40 }, { category: 'Recliner / VIP', price: 600, currency: '₹', availableSeats: 16 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '03:45 PM', format: 'IMAX 2D', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 240, currency: '₹', availableSeats: 45 }, { category: 'Executive', price: 360, currency: '₹', availableSeats: 25 }, { category: 'Recliner / VIP', price: 650, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' }
              ]
            }
          ]
        },
        {
          cinema: 'Cinépolis: One Awadh Center Mall, Gomti Nagar',
          theatreChain: 'Cinépolis',
          theatreType: 'VIP & Dolby Atmos',
          address: 'Vibhuti Khand, Gomti Nagar, Lucknow',
          distance: '4.5 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:00 PM', format: 'Dolby Atmos 2D', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 190, currency: '₹', availableSeats: 55 }, { category: 'Executive', price: 290, currency: '₹', availableSeats: 30 }, { category: 'Recliner / VIP', price: 550, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '04:30 PM', format: 'VIP 2D', language: 'Hindi / English', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 230, currency: '₹', availableSeats: 18 }, { category: 'Executive', price: 340, currency: '₹', availableSeats: 10 }, { category: 'Recliner / VIP', price: 620, currency: '₹', availableSeats: 4 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '08:15 PM', format: 'VIP 2D', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 220, currency: '₹', availableSeats: 38 }, { category: 'Executive', price: 330, currency: '₹', availableSeats: 20 }, { category: 'Recliner / VIP', price: 600, currency: '₹', availableSeats: 8 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' }
              ]
            }
          ]
        },
        {
          cinema: 'Wave Cinemas: Wave Mall, Vibhuti Khand',
          theatreChain: 'Wave Cinemas',
          theatreType: 'Dolby Digital 2D',
          address: 'TC 54, Vibhuti Khand, Gomti Nagar, Lucknow',
          distance: '5.2 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:15 PM', format: '2D', language: 'Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 160, currency: '₹', availableSeats: 70 }, { category: 'Executive', price: 240, currency: '₹', availableSeats: 40 }, { category: 'Recliner / VIP', price: 480, currency: '₹', availableSeats: 15 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' },
                { time: '05:45 PM', format: '2D', language: 'Hindi', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 200, currency: '₹', availableSeats: 20 }, { category: 'Executive', price: 280, currency: '₹', availableSeats: 12 }, { category: 'Recliner / VIP', price: 520, currency: '₹', availableSeats: 4 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-lucknow' }
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
                { time: '10:45 AM', format: 'IMAX 2D', language: 'English / Kannada', status: 'available', seatCategories: [{ category: 'Normal', price: 260, currency: '₹', availableSeats: 55 }, { category: 'Executive', price: 390, currency: '₹', availableSeats: 30 }, { category: 'Recliner / VIP', price: 680, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' },
                { time: '02:15 PM', format: 'IMAX 2D', language: 'English / Kannada', status: 'filling_fast', seatCategories: [{ category: 'Normal', price: 300, currency: '₹', availableSeats: 19 }, { category: 'Executive', price: 450, currency: '₹', availableSeats: 10 }, { category: 'Recliner / VIP', price: 780, currency: '₹', availableSeats: 4 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-bengaluru' }
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
                { time: '11:00 AM', format: 'Large Screen PCX', language: 'Telugu / Hindi', status: 'available', seatCategories: [{ category: 'Normal', price: 200, currency: '₹', availableSeats: 80 }, { category: 'Executive', price: 320, currency: '₹', availableSeats: 45 }, { category: 'Recliner / VIP', price: 550, currency: '₹', availableSeats: 15 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-hyderabad' }
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
                { time: '10:30 AM', format: 'Dolby Atmos', language: 'Tamil / Original', status: 'available', seatCategories: [{ category: 'Normal', price: 190, currency: '₹', availableSeats: 65 }, { category: 'Executive', price: 280, currency: '₹', availableSeats: 38 }, { category: 'Recliner / VIP', price: 480, currency: '₹', availableSeats: 14 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-chennai' }
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
      city: 'Chandigarh',
      theatres: [
        {
          cinema: 'PVR: Elante Mall, Industrial Area Phase 1',
          theatreChain: 'PVR INOX',
          theatreType: 'PVR LUXE & 4DX',
          address: '178-178A, Industrial Area Phase 1, Chandigarh',
          distance: '3.1 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '12:30 PM', format: '4DX', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 220, currency: '₹', availableSeats: 50 }, { category: 'Executive', price: 350, currency: '₹', availableSeats: 25 }, { category: 'Recliner / VIP', price: 650, currency: '₹', availableSeats: 10 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-chandigarh' }
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
          cinema: 'PVR: Treasure Island Mall, MG Road',
          theatreChain: 'PVR INOX',
          theatreType: 'Dolby Atmos 2D',
          address: '11, MG Road, South Tukoganj, Indore',
          distance: '2.4 km away',
          cancellationAvailable: true,
          showDates: [
            {
              date: '2026-11-23',
              label: 'Today',
              shows: [
                { time: '01:15 PM', format: 'Dolby Atmos', language: 'Hindi / English', status: 'available', seatCategories: [{ category: 'Normal', price: 190, currency: '₹', availableSeats: 55 }, { category: 'Executive', price: 300, currency: '₹', availableSeats: 30 }, { category: 'Recliner / VIP', price: 550, currency: '₹', availableSeats: 12 }], bookingUrl: 'https://in.bookmyshow.com/explore/movies-indore' }
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

console.log('generateAllCitiesShowtimes helper ready');
