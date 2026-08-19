import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { login } from "./controllers/authController.js";

dotenv.config();

const app = express();
app.use(express.json());

// Public Route (Không cần token)
app.post("/api/auth/login", login);

// Protected Routes (Yêu cầu Token hợp lệ)
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Auth Guard đang chạy tại http://localhost:${PORT}`);
});
