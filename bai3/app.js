import express from "express";
import dotenv from "dotenv";
import { login } from "./controllers/authController.js";

dotenv.config();

const app = express();
app.use(express.json());

// Endpoint đăng nhập: POST /api/auth/login
app.post("/api/auth/login", login);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server JWT Auth đang chạy tại http://localhost:${PORT}`);
});
