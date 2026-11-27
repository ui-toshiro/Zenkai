// In-memory sliding window rate limiter for security-sensitive endpoints

const ipRequestMap = new Map();

/**
 * Creates a rate limiting middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 mins)
 * @param {number} options.max - Max requests allowed in the window (default: 10)
 * @param {string} options.message - Error message returned on rate limit
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 10,
  message = 'Too many requests from this IP. Please try again after 15 minutes.',
} = {}) => {
  return (req, res, next) => {
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      'unknown';

    const now = Date.now();
    const cutoff = now - windowMs;

    // Get existing timestamps and clean up expired ones
    const timestamps = ipRequestMap.get(clientIp) || [];
    const recent = timestamps.filter((t) => t > cutoff);

    if (recent.length >= max) {
      const retryAfterSeconds = Math.ceil((recent[0] + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSeconds,
      });
    }

    recent.push(now);
    ipRequestMap.set(clientIp, recent);

    // Garbage collection if map grows large
    if (ipRequestMap.size > 10000) {
      for (const [ip, ts] of ipRequestMap.entries()) {
        const filtered = ts.filter((t) => t > cutoff);
        if (filtered.length === 0) {
          ipRequestMap.delete(ip);
        } else {
          ipRequestMap.set(ip, filtered);
        }
      }
    }

    next();
  };
};

// Pre-configured rate limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

export const apiGlobalLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // 300 req/min
  message: 'High traffic rate limit reached. Please slow down.',
});
