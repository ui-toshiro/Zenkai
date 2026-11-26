import express from 'express';
import {
  getMusicDiscovery,
  getAllMusicEvents,
  getMusicEvent,
  createMusicEvent,
  updateMusicEvent,
  deleteMusicEvent,
} from '../controllers/musicEventController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/discovery', getMusicDiscovery);
router.get('/events', getAllMusicEvents);
router.get('/events/:idOrSlug', optionalProtect, getMusicEvent);

// Admin management
router.post('/events', protect, adminOnly, createMusicEvent);
router.put('/events/:id', protect, adminOnly, updateMusicEvent);
router.delete('/events/:id', protect, adminOnly, deleteMusicEvent);

export default router;
