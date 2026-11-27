import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
