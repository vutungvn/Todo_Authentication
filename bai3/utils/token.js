import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
  // Payload chỉ chứa các thông tin cơ bản, KHÔNG chứa thông tin nhạy cảm
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // Tạo Access Token (tuổi thọ ngắn)
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

  // Tạo Refresh Token (tuổi thọ dài)
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

  return { accessToken, refreshToken };
};
