import express from 'express';
import {
  getAllArtists,
  getArtist,
  createArtist,
  updateArtist,
  proxyArtistImage,
  syncArtists,
} from '../controllers/artistController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific utility routes (must precede /:idOrSlug)
router.get('/proxy-image', proxyArtistImage);
router.post('/sync-media', syncArtists);

router.get('/', getAllArtists);
router.get('/:idOrSlug', optionalProtect, getArtist);

// Admin
router.post('/', protect, adminOnly, createArtist);
router.put('/:id', protect, adminOnly, updateArtist);

export default router;
