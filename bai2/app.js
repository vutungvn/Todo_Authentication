import express from "express";
import { loginRateLimiter } from "./middlewares/rateLimiter.js";

const app = express();
app.use(express.json());

// Controller xử lý đăng nhập giả định
const handleLogin = (req, res) => {
  const { username, password } = req.body;

  // Giả lập kiểm tra tài khoản
  if (username === "admin" && password === "123456") {
    return res.status(200).json({
      status: "success",
      message: "Đăng nhập thành công!",
    });
  }

  return res.status(401).json({
    status: "error",
    message: "Tài khoản hoặc mật khẩu không chính xác",
  });
};

// Gắn loginRateLimiter trước controller đăng nhập
app.post("/api/auth/login", loginRateLimiter, handleLogin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
