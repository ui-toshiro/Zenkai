import express from 'express';
import {
  getMovieReviews,
  createOrUpdateReview,
  deleteReview,
  toggleHelpfulVote,
  reportReview,
} from '../controllers/reviewController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/movie/:movieId', optionalProtect, getMovieReviews);
router.post('/', protect, createOrUpdateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, toggleHelpfulVote);
router.post('/:id/report', protect, reportReview);

export default router;
