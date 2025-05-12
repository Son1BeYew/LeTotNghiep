const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    req.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Xác thực thất bại", error: err });
  }
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  next();
};

module.exports = { authenticateUser, authorizeRole };
