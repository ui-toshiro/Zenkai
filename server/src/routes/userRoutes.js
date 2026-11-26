import express from 'express';
import {
  getWatchlist,
  toggleWatchlist,
  toggleFavourites,
  toggleWatched,
  toggleSavedEvent,
  toggleEventReminder,
  toggleFavouriteArtist,
  recordRecentlyViewed,
  getUserProfileData,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Movie collections
router.get('/watchlist', getWatchlist);
router.post('/watchlist/:movieId', toggleWatchlist);
router.post('/favourites/:movieId', toggleFavourites);
router.post('/watched/:movieId', toggleWatched);

// Music collections
router.post('/saved-events/:eventId', toggleSavedEvent);
router.post('/event-reminders/:eventId', toggleEventReminder);
router.post('/favourite-artists/:artistId', toggleFavouriteArtist);

// History and Profile Data
router.post('/recently-viewed', recordRecentlyViewed);
router.get('/profile-data', getUserProfileData);

export default router;
