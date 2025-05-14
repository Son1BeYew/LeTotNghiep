const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.login = async (req, res) => {
  try {
    console.log("Yêu cầu:", req.body);

    const { username, password } = req.body;
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });
    console.log("User :", user);
    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy người dùng !!!" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Mật khẩu không hợp lệ" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công !!!",
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập :", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};
