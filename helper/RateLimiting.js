import rateLimit from "express-rate-limit";

// General rate limiting for all routes
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 110,
});

// Rate limiting specifically for Cloudinary-related routes
export const cloudinaryLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
});
