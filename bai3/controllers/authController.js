import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/token.js";

// Mô phỏng Database lưu người dùng (mật khẩu đã qua hash bcrypt)
// Mật khẩu gốc của tài khoản này là: 123456
const mockUsers = [
  {
    id: "usr_101",
    email: "student@example.com",
    passwordHash: bcrypt.hashSync("123456", 10),
    role: "STUDENT",
  },
];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng cung cấp email và mật khẩu",
      });
    }

    // 2. Tìm người dùng theo email
    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // 3. Đối chiếu mật khẩu bằng bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // 4. Khởi tạo cặp Access Token và Refresh Token
    const { accessToken, refreshToken } = generateTokens(user);

    // 5. Trả về kết quả
    return res.status(200).json({
      status: "success",
      message: "Đăng nhập thành công",
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ nội bộ",
    });
  }
};
