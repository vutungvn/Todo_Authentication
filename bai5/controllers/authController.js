import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/token.js";

// Mô phỏng Database người dùng
const mockUsers = [
  {
    id: "usr_101",
    username: "tung",
    passwordHash: bcrypt.hashSync("123456", 10),
    role: "STUDENT",
  },
];

// Mô phỏng Database lưu trữ các Refresh Token hợp lệ (để kiểm tra xem token đã bị thu hồi chưa)
let refreshTokensDb = [];

/**
 * 1. API POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        message: "Vui lòng nhập tài khoản và mật khẩu",
      });
    }

    const user = mockUsers.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        status: 401,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    // Tạo cặp token
    const { accessToken, refreshToken } = generateTokens(user);

    // Lưu Refresh Token (dạng chuỗi thô) vào Database để quản lý trạng thái
    refreshTokensDb.push(refreshToken);

    // Trả về theo định dạng Response như thiết kế
    return res.status(200).json({
      status: 200,
      message: "LOGIN_SUCCESSFUL",
      data: {
        accessToken: `Bearer ${accessToken}`,
        refreshToken: `Bearer ${refreshToken}`,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Lỗi máy chủ nội bộ" });
  }
};

/**
 * 2. API POST /api/auth/refresh-token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: tokenInput } = req.body;

    if (!tokenInput) {
      return res.status(401).json({
        status: 401,
        message: "Refresh Token là bắt buộc!",
      });
    }

    // Tách chuỗi nếu client gửi kèm tiền tố "Bearer "
    const rawRefreshToken = tokenInput.startsWith("Bearer ")
      ? tokenInput.split(" ")[1]
      : tokenInput;

    // Bước A: Kiểm tra xem Refresh Token có tồn tại trong Database không
    const tokenExists = refreshTokensDb.includes(rawRefreshToken);
    if (!tokenExists) {
      return res.status(403).json({
        status: 403,
        message: "Refresh Token không hợp lệ hoặc đã bị thu hồi!",
      });
    }

    // Bước B: Verify chữ ký và hạn dùng của Refresh Token
    jwt.verify(
      rawRefreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, decodedUser) => {
        if (err) {
          // Token hết hạn -> Xóa khỏi DB để giải phóng
          refreshTokensDb = refreshTokensDb.filter(
            (t) => t !== rawRefreshToken,
          );
          return res.status(403).json({
            status: 403,
            message: "Refresh Token hết hạn, vui lòng đăng nhập lại!",
          });
        }

        // Bước C: Ký (sign) Access Token mới
        const newAccessToken = jwt.sign(
          {
            userId: decodedUser.userId,
            username: decodedUser.username,
            role: decodedUser.role,
          },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" },
        );

        // Trả về Access Token mới theo chuẩn giao diện UI/Postman
        return res.status(200).json({
          status: 200,
          message: "SUCCESS",
          data: {
            accessToken: newAccessToken,
          },
        });
      },
    );
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Lỗi máy chủ nội bộ" });
  }
};
