import mongoose from 'mongoose';

const MusicEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['concert', 'festival', 'tour', 'live_gig'],
      default: 'concert',
      index: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      index: true,
    },
    artistName: {
      type: String,
      required: true,
      index: true,
    },
    performingArtists: [
      {
        name: { type: String, required: true },
        role: { type: String, default: 'Headline Artist' },
        artistRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
        image: { type: String, default: '' },
      },
    ],
    poster: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
      index: true,
    },
    time: {
      type: String,
      default: '7:00 PM onwards',
    },
    venue: {
      name: { type: String, required: true },
      address: { type: String, default: '' },
      city: { type: String, required: true, index: true },
      state: { type: String, default: '' },
      country: { type: String, default: 'India', index: true },
      mapUrl: { type: String, default: '' },
    },
    genres: {
      type: [String],
      default: ['Pop'],
      index: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'past', 'sold_out', 'postponed', 'rescheduled', 'filling_fast'],
      default: 'upcoming',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFestival: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTour: {
      type: Boolean,
      default: false,
      index: true,
    },
    isRecentlyAnnounced: {
      type: Boolean,
      default: false,
      index: true,
    },
    isInternational: {
      type: Boolean,
      default: false,
      index: true,
    },
    ticketPricing: [
      {
        category: { type: String, required: true }, // e.g. Early Bird, General Admission, VIP Lounge, Fan Pit
        price: { type: Number, required: true },
        currency: { type: String, default: '₹' },
        description: { type: String, default: '' },
        isAvailable: { type: Boolean, default: true },
        bookingUrl: { type: String, default: 'https://in.bookmyshow.com' },
      },
    ],
    promotionalVideo: {
      type: String, // YouTube embed key
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

MusicEventSchema.index({
  title: 'text',
  artistName: 'text',
  description: 'text',
  'venue.name': 'text',
  'venue.city': 'text',
  genres: 'text',
});

export default mongoose.model('MusicEvent', MusicEventSchema);
