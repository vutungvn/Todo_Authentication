import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route GET /api/users/profile - Đã được bảo vệ bởi authenticateToken
router.get("/profile", authenticateToken, (req, res) => {
  // req.user chứa dữ liệu đã decode từ token (userId, email, role, ...)
  return res.status(200).json({
    status: "success",
    message: "Lấy thông tin trang cá nhân thành công!",
    data: {
      user: req.user,
    },
  });
});

export default router;
