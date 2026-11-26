import express from 'express';
import {
  getAdminStats,
  getFlaggedReviews,
  moderateReview,
  toggleMovieFeature,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/flagged-reviews', getFlaggedReviews);
router.put('/reviews/:id/moderate', moderateReview);
router.put('/movies/:id/toggle-feature', toggleMovieFeature);

export default router;
