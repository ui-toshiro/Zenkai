import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a star rating from 1 to 10'],
      min: 1,
      max: 10,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Please write your review thoughts'],
      trim: true,
      maxlength: 2000,
    },
    isCriticReview: {
      type: Boolean,
      default: false,
    },
    criticName: {
      type: String,
      default: '',
    },
    criticOutlet: {
      type: String,
      default: '',
    },
    helpfulVotes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    helpfulCount: {
      type: Number,
      default: 0,
      index: true,
    },
    reported: {
      type: Boolean,
      default: false,
      index: true,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    reportReasons: [
      {
        reason: String,
        reportedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['approved', 'flagged', 'hidden'],
      default: 'approved',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per movie
ReviewSchema.index({ movie: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);
