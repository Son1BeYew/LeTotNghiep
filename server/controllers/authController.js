const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("123", 10) },
  { id: 2, username: "user", password: bcrypt.hashSync("123", 10) },
];

const login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user)
    return res.status(400).json({ message: "Tài khoản không tồn tại!" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    "SECRET_KEY",
    { expiresIn: "1h" }
  );

  res.json({ message: "Đăng nhập thành công!", token });
};

module.exports = { login };
