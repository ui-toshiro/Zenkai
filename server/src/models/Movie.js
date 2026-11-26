import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tmdbId: {
      type: Number,
      index: true,
      sparse: true,
    },
    poster: {
      type: String,
      required: true,
    },
    backdrop: {
      type: String,
      default: '',
    },
    alternativePosters: [
      {
        url: { type: String, required: true },
        filePath: { type: String, default: '' },
        aspectRatio: { type: Number, default: 0.667 },
        voteAverage: { type: Number, default: 0 },
        language: { type: String, default: 'en' },
      },
    ],
    overview: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    releaseYear: {
      type: Number,
      index: true,
    },
    runtime: {
      type: Number, // in minutes
      default: 120,
    },
    genres: {
      type: [String],
      default: [],
      index: true,
    },
    languages: {
      type: [String],
      default: ['English'],
      index: true,
    },
    country: {
      type: String,
      default: 'United States',
    },
    certification: {
      type: String,
      default: 'PG-13',
    },
    director: {
      type: String,
      required: true,
      index: true,
    },
    directorInfo: {
      name: { type: String, default: '' },
      profileImage: { type: String, default: '' },
      bio: { type: String, default: '' },
    },
    productionCompanies: {
      type: [String],
      default: [],
    },
    industry: {
      type: String,
      enum: ['hollywood', 'bollywood', 'south_indian', 'anime', 'international'],
      default: 'hollywood',
      index: true,
    },
    releaseStatus: {
      type: String,
      enum: ['now_showing', 'upcoming', 'released', 'streaming'],
      default: 'released',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    trending: {
      type: Boolean,
      default: false,
      index: true,
    },
    popular: {
      type: Boolean,
      default: false,
      index: true,
    },
    topRated: {
      type: Boolean,
      default: false,
      index: true,
    },
    ratingSummary: {
      imdbRating: { type: Number, default: 0 },
      tmdbRating: { type: Number, default: 0 },
      averageAudienceRating: { type: Number, default: 0, index: true },
      reviewCount: { type: Number, default: 0 },
      ratingDistribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
        6: { type: Number, default: 0 },
        7: { type: Number, default: 0 },
        8: { type: Number, default: 0 },
        9: { type: Number, default: 0 },
        10: { type: Number, default: 0 },
      },
      positivePercentage: { type: Number, default: 0 },
      negativePercentage: { type: Number, default: 0 },
    },
    cast: [
      {
        name: { type: String, required: true },
        character: { type: String, default: '' },
        role: { type: String, default: 'Lead Actor' },
        profileImage: { type: String, default: '' },
      },
    ],
    crew: [
      {
        name: { type: String, required: true },
        role: { type: String, default: 'Crew' },
        department: { type: String, default: 'Production' },
        profileImage: { type: String, default: '' },
      },
    ],
    trailers: [
      {
        title: { type: String, default: 'Official Trailer' },
        youtubeKey: { type: String, required: true },
        isOfficial: { type: Boolean, default: true },
        type: { type: String, default: 'Trailer' },
      },
    ],
    images: {
      type: [String],
      default: [],
    },
    ticketPricing: [
      {
        cinema: { type: String, required: true },
        city: { type: String, default: 'All Major Cities' },
        format: { type: String, default: '2D / IMAX' },
        price: { type: Number, required: true },
        currency: { type: String, default: '₹' },
        bookingUrl: { type: String, default: '' },
        isAvailable: { type: Boolean, default: true },
        lastUpdated: { type: Date, default: Date.now },
      },
    ],
    cityShowtimes: [
      {
        city: { type: String, required: true, index: true },
        theatres: [
          {
            cinema: { type: String, required: true },
            theatreChain: { type: String, default: 'PVR INOX' },
            theatreType: { type: String, default: 'IMAX 2D' },
            address: { type: String, default: '' },
            distance: { type: String, default: '' },
            cancellationAvailable: { type: Boolean, default: true },
            showDates: [
              {
                date: { type: String, required: true },
                label: { type: String, default: 'Today' },
                shows: [
                  {
                    time: { type: String, required: true },
                    format: { type: String, default: 'IMAX 2D' },
                    language: { type: String, default: 'English' },
                    status: {
                      type: String,
                      enum: ['available', 'filling_fast', 'almost_full', 'sold_out'],
                      default: 'available',
                    },
                    seatCategories: [
                      {
                        category: { type: String, default: 'Normal' },
                        price: { type: Number, required: true },
                        currency: { type: String, default: '₹' },
                        availableSeats: { type: Number, default: 45 },
                      },
                      {
                        category: { type: String, default: 'Executive' },
                        price: { type: Number, required: true },
                        currency: { type: String, default: '₹' },
                        availableSeats: { type: Number, default: 22 },
                      },
                      {
                        category: { type: String, default: 'Recliner / VIP' },
                        price: { type: Number, required: true },
                        currency: { type: String, default: '₹' },
                        availableSeats: { type: Number, default: 8 },
                      },
                    ],
                    bookingUrl: { type: String, default: 'https://in.bookmyshow.com' },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    streamingAvailability: [
      {
        platform: { type: String, required: true },
        logo: { type: String, default: '' },
        type: {
          type: String,
          enum: ['subscription', 'rent', 'buy', 'free'],
          default: 'subscription',
        },
        price: { type: Number },
        currency: { type: String, default: '₹' },
        url: { type: String, default: '' },
        isAvailable: { type: Boolean, default: true },
        ottReleaseDate: { type: Date },
        lastUpdated: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound text search index for fast and accurate search across title, director, cast, and genres
MovieSchema.index({
  title: 'text',
  director: 'text',
  'cast.name': 'text',
  genres: 'text',
  overview: 'text',
});

export default mongoose.model('Movie', MovieSchema);
