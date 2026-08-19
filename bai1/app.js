import express from "express";
import dotenv from "dotenv";

// Nạp các biến môi trường từ file .env vào process.env
dotenv.config();

const app = express();
app.use(express.json());

// Đọc giá trị từ process.env
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

// Route kiểm tra cấu hình
app.get("/api/config-check", (req, res) => {
  res.json({
    status: "success",
    data: {
      port: PORT,
      mongoUri,
      jwtAccessExpiresIn,
      jwtRefreshExpiresIn,
      // Kiểm tra biến đã nạp thành công chưa (không trả về secret key thực)
      jwtAccessSecretLoaded: Boolean(jwtAccessSecret),
      jwtRefreshSecretLoaded: Boolean(jwtRefreshSecret),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại địa chỉ: http://localhost:${PORT}`);
});
