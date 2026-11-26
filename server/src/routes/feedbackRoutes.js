import express from 'express';
import {
  submitFeedback,
  getAllFeedback,
  getFeedbackStats,
  updateFeedbackStatus,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public submission
router.post('/', submitFeedback);

// Admin moderation
router.get('/', protect, adminOnly, getAllFeedback);
router.get('/stats', protect, adminOnly, getFeedbackStats);
router.put('/:id', protect, adminOnly, updateFeedbackStatus);
router.delete('/:id', protect, adminOnly, deleteFeedback);

export default router;
