import Feedback from '../models/Feedback.js';

// Simple in-memory rate limiting map for spam prevention (IP -> array of timestamps)
const ipSubmissionTracker = new Map();

// Helper to clean up timestamps older than 1 hour
const cleanupOldSubmissions = (timestamps, windowMs = 3600000) => {
  const cutoff = Date.now() - windowMs;
  return timestamps.filter((t) => t > cutoff);
};

// @desc Submit visitor feedback or suggestion
// @route POST /api/v1/feedback
// @access Public (no account required)
export const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, category, suggestion, rating } = req.body;

    // Client IP for rate-limiting
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    // Anti-spam rate limiting: Max 8 submissions per hour per IP
    const now = Date.now();
    const existingTimestamps = ipSubmissionTracker.get(clientIp) || [];
    const recentSubmissions = cleanupOldSubmissions(existingTimestamps);

    if (recentSubmissions.length >= 8) {
      return res.status(429).json({
        success: false,
        message: 'Submission limit reached. Please wait a while before submitting more feedback.',
      });
    }

    if (!suggestion || suggestion.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed suggestion of at least 5 characters.',
      });
    }

    const validCategories = [
      'UI/UX Improvements',
      'New Features',
      'Bug Reports',
      'Performance',
      'General Suggestions',
    ];

    const selectedCategory = validCategories.includes(category)
      ? category
      : 'General Suggestions';

    const feedback = await Feedback.create({
      name: name && name.trim() ? name.trim().slice(0, 100) : 'Anonymous Visitor',
      email: email && email.trim() ? email.trim().slice(0, 150) : '',
      category: selectedCategory,
      suggestion: suggestion.trim().slice(0, 3000),
      rating: rating && rating >= 1 && rating <= 5 ? parseInt(rating, 10) : 5,
      deviceInfo: req.headers['user-agent']?.slice(0, 200) || '',
      ip: clientIp,
    });

    // Record submission timestamp for IP
    recentSubmissions.push(now);
    ipSubmissionTracker.set(clientIp, recentSubmissions);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback and suggestion have been submitted successfully.',
      feedback: {
        _id: feedback._id,
        name: feedback.name,
        category: feedback.category,
        status: feedback.status,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all submitted feedback with filtering & pagination
// @route GET /api/v1/feedback
// @access Private/Admin
export const getAllFeedback = async (req, res, next) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search && typeof search === 'string' && search.trim()) {
      const escapedSearch = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const regex = new RegExp(escapedSearch, 'i');
      filter.$or = [
        { suggestion: regex },
        { name: regex },
        { email: regex },
        { adminNotes: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, feedbackList] = await Promise.all([
      Feedback.countDocuments(filter),
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      count: feedbackList.length,
      feedback: feedbackList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get feedback statistics for admin dashboard
// @route GET /api/v1/feedback/stats
// @access Private/Admin
export const getFeedbackStats = async (req, res, next) => {
  try {
    const [total, newCount, reviewedCount, inProgressCount, resolvedCount] =
      await Promise.all([
        Feedback.countDocuments(),
        Feedback.countDocuments({ status: 'new' }),
        Feedback.countDocuments({ status: 'reviewed' }),
        Feedback.countDocuments({ status: 'in_progress' }),
        Feedback.countDocuments({ status: 'resolved' }),
      ]);

    const categoryAggregation = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const categoryBreakdown = {};
    categoryAggregation.forEach((c) => {
      categoryBreakdown[c._id] = c.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        new: newCount,
        reviewed: reviewedCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update feedback status and add admin notes
// @route PUT /api/v1/feedback/:id
// @access Private/Admin
export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    if (status) feedback.status = status;
    if (adminNotes !== undefined) feedback.adminNotes = adminNotes;

    await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete feedback entry
// @route DELETE /api/v1/feedback/:id
// @access Private/Admin
export const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
