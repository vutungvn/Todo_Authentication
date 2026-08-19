import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // 1. Trích xuất Authorization Header từ Request
  const authHeader = req.headers["authorization"];

  // Header chuẩn có dạng: "Bearer "
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Nếu không tìm thấy Token -> Từ chối lập tức (401 Unauthorized)
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Không tìm thấy Access Token. Truy cập bị từ chối!",
    });
  }

  // 3. Tiến hành xác minh (Verify) Token với Secret Key
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decodedUser) => {
    if (err) {
      // Token sai chữ ký, hết hạn hoặc bị sửa đổi
      return res.status(401).json({
        status: "error",
        message: "Token không hợp lệ hoặc đã hết hạn!",
      });
    }

    // 4. Token hợp lệ: Lưu thông tin đã giải mã vào req.user
    req.user = decodedUser;

    // 5. Cho phép chuyển giao tiếp cho Controller tiếp theo
    next();
  });
};
