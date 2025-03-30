const rateLimit = require("express-rate-limit");

// Create a limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 5 requests per windowMs
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Optional: Add a more permissive limiter for signup
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 7, // limit each IP to 3 account creations per hour
  message: {
    message: "Too many accounts created, please try again after an hour",
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

module.exports = { loginLimiter, signupLimiter };
