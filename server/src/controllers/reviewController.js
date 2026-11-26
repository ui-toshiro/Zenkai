import Review from '../models/Review.js';
import Movie from '../models/Movie.js';

// Helper to recalculate movie rating summary
const recalculateMovieRatings = async (movieId) => {
  const reviews = await Review.find({ movie: movieId, status: 'approved' });

  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, {
      'ratingSummary.averageAudienceRating': 0,
      'ratingSummary.reviewCount': 0,
      'ratingSummary.ratingDistribution': { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
      'ratingSummary.positivePercentage': 0,
      'ratingSummary.negativePercentage': 0,
    });
    return;
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };
  let totalRating = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  reviews.forEach((r) => {
    totalRating += r.rating;
    const roundedRating = Math.min(10, Math.max(1, Math.round(r.rating)));
    distribution[roundedRating] = (distribution[roundedRating] || 0) + 1;
    if (r.rating >= 7) positiveCount++;
    if (r.rating <= 4) negativeCount++;
  });

  const average = Number((totalRating / reviews.length).toFixed(1));
  const positivePercentage = Math.round((positiveCount / reviews.length) * 100);
  const negativePercentage = Math.round((negativeCount / reviews.length) * 100);

  await Movie.findByIdAndUpdate(movieId, {
    'ratingSummary.averageAudienceRating': average,
    'ratingSummary.reviewCount': reviews.length,
    'ratingSummary.ratingDistribution': distribution,
    'ratingSummary.positivePercentage': positivePercentage,
    'ratingSummary.negativePercentage': negativePercentage,
  });
};

// @desc Get reviews for a movie with sorting
// @route GET /api/v1/reviews/movie/:movieId
export const getMovieReviews = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { sortBy = 'recent', filter = 'all' } = req.query;

    const query = { movie: movieId, status: 'approved' };
    if (filter === 'critic') {
      query.isCriticReview = true;
    } else if (filter === 'audience') {
      query.isCriticReview = false;
    }

    let sort = {};
    if (sortBy === 'highest') {
      sort = { rating: -1, createdAt: -1 };
    } else if (sortBy === 'lowest') {
      sort = { rating: 1, createdAt: -1 };
    } else if (sortBy === 'helpful') {
      sort = { helpfulCount: -1, createdAt: -1 };
    } else {
      sort = { createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('user', 'name avatar role')
      .sort(sort);

    const formattedReviews = reviews.map((r) => {
      const reviewObj = r.toObject();
      reviewObj.hasVotedHelpful = req.user
        ? r.helpfulVotes.some((v) => v.user?.toString() === req.user._id.toString())
        : false;
      return reviewObj;
    });

    res.status(200).json({
      success: true,
      count: formattedReviews.length,
      reviews: formattedReviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create or update user review
// @route POST /api/v1/reviews
export const createOrUpdateReview = async (req, res, next) => {
  try {
    const { movieId, rating, title, content, isCriticReview, criticName, criticOutlet } = req.body;

    if (!movieId || !rating || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movie ID, star rating (1-10), and review text',
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    if (movie.releaseStatus === 'upcoming' && new Date(movie.releaseDate) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This movie has not yet been released. Audience reviews open upon theatrical or OTT release!',
      });
    }

    let review = await Review.findOne({ movie: movieId, user: req.user._id });

    if (review) {
      review.rating = Number(rating);
      review.title = title || '';
      review.content = content;
      if (req.user.role === 'admin' && isCriticReview) {
        review.isCriticReview = true;
        review.criticName = criticName || req.user.name;
        review.criticOutlet = criticOutlet || 'ZENKAI Staff Critic';
      }
      await review.save();
    } else {
      review = await Review.create({
        movie: movieId,
        user: req.user._id,
        rating: Number(rating),
        title: title || '',
        content,
        isCriticReview: req.user.role === 'admin' && isCriticReview ? true : false,
        criticName: criticName || '',
        criticOutlet: criticOutlet || '',
      });
    }

    await recalculateMovieRatings(movieId);

    if (!req.user.watched.includes(movieId)) {
      req.user.watched.push(movieId);
      await req.user.save();
    }

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar role');

    res.status(200).json({
      success: true,
      message: 'Review saved successfully',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete review
// @route DELETE /api/v1/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this review',
      });
    }

    const movieId = review.movie;
    await review.deleteOne();

    await recalculateMovieRatings(movieId);

    res.status(200).json({
      success: true,
      message: 'Review removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Vote a review as helpful
// @route POST /api/v1/reviews/:id/helpful
export const toggleHelpfulVote = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const alreadyVotedIndex = review.helpfulVotes.findIndex(
      (v) => v.user?.toString() === req.user._id.toString()
    );

    let hasVotedHelpful = false;

    if (alreadyVotedIndex > -1) {
      review.helpfulVotes.splice(alreadyVotedIndex, 1);
      hasVotedHelpful = false;
    } else {
      review.helpfulVotes.push({ user: req.user._id, createdAt: new Date() });
      hasVotedHelpful = true;
    }

    review.helpfulCount = review.helpfulVotes.length;
    await review.save();

    res.status(200).json({
      success: true,
      helpfulCount: review.helpfulCount,
      hasVotedHelpful,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Report a review
// @route POST /api/v1/reviews/:id/report
export const reportReview = async (req, res, next) => {
  try {
    const { reason = 'Inappropriate content' } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    review.reported = true;
    review.reportCount = (review.reportCount || 0) + 1;
    review.reportReasons.push({
      reason,
      reportedBy: req.user._id,
      reportedAt: new Date(),
    });

    if (review.reportCount >= 3) {
      review.status = 'flagged';
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review has been reported for moderation review. Thank you for keeping ZENKAI safe.',
    });
  } catch (error) {
    next(error);
  }
};
