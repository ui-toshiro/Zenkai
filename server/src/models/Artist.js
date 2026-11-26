import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      default: '',
    },
    tmdbPersonId: {
      type: Number,
      default: null,
      index: true,
    },
    musicbrainzId: {
      type: String,
      default: null,
    },
    profileImages: [
      {
        url: { type: String, required: true },
        source: { type: String, default: 'tmdb' },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    genres: {
      type: [String],
      default: [],
      index: true,
    },
    bio: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    category: {
      type: String,
      enum: ['indian_singer', 'international_singer', 'band', 'dj_electronic', 'indie', 'trending'],
      default: 'indian_singer',
      index: true,
    },
    monthlyListeners: {
      type: String,
      default: '10M+',
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPopular: {
      type: Boolean,
      default: true,
    },
    albums: [
      {
        title: { type: String, required: true },
        year: { type: Number, default: 2024 },
        cover: { type: String, default: '' },
        totalTracks: { type: Number, default: 10 },
      },
    ],
    latestRelease: {
      title: { type: String, default: '' },
      releaseDate: { type: String, default: '' },
      type: { type: String, default: 'Single' },
      url: { type: String, default: '' },
    },
    pastPerformances: [
      {
        eventName: { type: String, required: true },
        year: { type: Number, default: 2024 },
        venue: { type: String, default: '' },
        city: { type: String, default: '' },
      },
    ],
    relatedArtists: [
      {
        name: { type: String, required: true },
        image: { type: String, default: '' },
        slug: { type: String, default: '' },
        genres: { type: [String], default: [] },
      },
    ],
    featuredVideo: {
      type: String, // YouTube embed ID
      default: '',
    },
    popularTracks: [
      {
        title: { type: String, required: true },
        duration: { type: String, default: '3:30' },
        album: { type: String, default: '' },
        spotifyUrl: { type: String, default: '' },
        youtubeUrl: { type: String, default: '' },
      },
    ],
    socialLinks: {
      spotify: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

ArtistSchema.index({ name: 'text', bio: 'text', genres: 'text' });

export default mongoose.model('Artist', ArtistSchema);
