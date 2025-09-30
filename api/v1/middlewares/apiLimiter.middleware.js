const rateLimit = require("express-rate-limit");

// Giới hạn 5 request / 1 phút cho login
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { code: 429, message: "Quá nhiều lần truy cập, vui lòng thử lại sau." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter
}