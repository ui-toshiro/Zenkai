import express from 'express';
import {
  getDiscoverySections,
  getTheatricalCategories,
  searchMovies,
  getUpcomingMovies,
  getMovie,
  getRecommendations,
  getTicketCities,
  searchIndianCities,
  validateIndianCity,
  searchMoviesByCity,
  getMovieShowtimes,
  proxyImage,
  syncMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Theatrical categories & discovery (Must be declared before :idOrSlug)
router.get('/theatrical/categories', getTheatricalCategories);
router.get('/discovery', getDiscoverySections);
router.get('/upcoming', getUpcomingMovies);
router.get('/search', searchMovies);

// Ticket & City Availability endpoints (Must be declared before :idOrSlug)
router.get('/cities/search', searchIndianCities);
router.get('/cities/validate', validateIndianCity);
router.get('/tickets/cities', getTicketCities);
router.get('/tickets/search', searchMoviesByCity);
router.get('/proxy-image', proxyImage);
router.post('/sync-media', protect, adminOnly, syncMovies);

// Specific Movie endpoints
router.get('/:idOrSlug/showtimes', getMovieShowtimes);
router.get('/:idOrSlug', optionalProtect, getMovie);
router.get('/:id/recommendations', getRecommendations);

// Admin movie management
router.post('/', protect, adminOnly, createMovie);
router.put('/:id', protect, adminOnly, updateMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

export default router;
