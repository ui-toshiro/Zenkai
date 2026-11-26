import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

// @desc Get Admin Dashboard statistics
// @route GET /api/v1/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const [movieCount, userCount, reviewCount, flaggedReviewCount] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ status: 'flagged' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        movieCount,
        userCount,
        reviewCount,
        flaggedReviewCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get flagged reviews for moderation
// @route GET /api/v1/admin/flagged-reviews
export const getFlaggedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reported: true })
      .populate('movie', 'title poster slug')
      .populate('user', 'name email avatar')
      .sort({ reportCount: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Moderate a review (approve, hide, or delete)
// @route PUT /api/v1/admin/reviews/:id/moderate
export const moderateReview = async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve', 'hide', 'delete'
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (action === 'delete') {
      const movieId = review.movie;
      await review.deleteOne();
      // recalculate ratings
      const reviews = await Review.find({ movie: movieId, status: 'approved' });
      const avg = reviews.length > 0 ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)) : 0;
      await Movie.findByIdAndUpdate(movieId, {
        'ratingSummary.averageAudienceRating': avg,
        'ratingSummary.reviewCount': reviews.length,
      });
      return res.status(200).json({ success: true, message: 'Review permanently deleted' });
    }

    if (action === 'approve') {
      review.status = 'approved';
      review.reported = false;
      review.reportCount = 0;
      await review.save();
      return res.status(200).json({ success: true, message: 'Review approved and cleared' });
    }

    if (action === 'hide') {
      review.status = 'hidden';
      await review.save();
      return res.status(200).json({ success: true, message: 'Review hidden from public feed' });
    }

    res.status(400).json({ success: false, message: 'Invalid action' });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle Movie Featured or Trending
// @route PUT /api/v1/admin/movies/:id/toggle-feature
export const toggleMovieFeature = async (req, res, next) => {
  try {
    const { field } = req.body; // 'featured', 'trending', 'popular'
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    if (field === 'featured') movie.featured = !movie.featured;
    if (field === 'trending') movie.trending = !movie.trending;
    if (field === 'popular') movie.popular = !movie.popular;

    await movie.save();
    res.status(200).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};
