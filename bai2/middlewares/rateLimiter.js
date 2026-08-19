import rateLimit from "express-rate-limit";

// Middleware chặn Brute-force cho API Login (Max 5 lần / 15 phút)
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Khoảng thời gian: 15 phút
  max: 5, // Giới hạn tối đa 5 request mỗi IP trong windowMs
  message: {
    status: 429,
    error: "Too Many Requests",
    message: "Bạn đã thử đăng nhập quá 5 lần. Vui lòng thử lại sau 15 phút!",
  },
  standardHeaders: true, // Trả về thông tin RateLimit-* trong Response Header
  legacyHeaders: false, // Tắt các header X-RateLimit-* cũ
});
