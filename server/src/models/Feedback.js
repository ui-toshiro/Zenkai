import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'Anonymous Visitor',
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Feedback category is required'],
      enum: [
        'UI/UX Improvements',
        'New Features',
        'Bug Reports',
        'Performance',
        'General Suggestions',
      ],
      default: 'General Suggestions',
      index: true,
    },
    suggestion: {
      type: String,
      required: [true, 'Suggestion text is required'],
      trim: true,
      minlength: [5, 'Suggestion must be at least 5 characters'],
      maxlength: [3000, 'Suggestion cannot exceed 3000 characters'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'in_progress', 'resolved'],
      default: 'new',
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
    deviceInfo: {
      type: String,
      default: '',
    },
    ip: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model('Feedback', FeedbackSchema);
