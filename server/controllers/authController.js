const bcrypt = require("bcryptjs");
const { poolPromise } = require("../config/db");

const login = async (req, res) => {
  let { username, password } = req.body;
  console.log("Kiểm tra đăng nhập cho:", username);

  try {
    const pool = await poolPromise;
    username =
      username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

    const result = await pool
      .request()
      .input("username", username)
      .query("SELECT * FROM Account WHERE Username = @username");

    console.log(" Kết quả:", result.recordset);

    if (result.recordset.length === 0) {
      console.log("Không tìm thấy tài khoản!");
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu!" });
    }
    const user = result.recordset[0];
    console.log("Mật khẩu trong Database:", user.Password);
    const passwordMatch = await bcrypt.compare(password, user.Password);
    console.log("Kết quả so sánh mật khẩu:", passwordMatch);

    if (!passwordMatch) {
      console.log("Mật khẩu không đúng!");
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu!" });
    }

    console.log("Đăng nhập thành công!");
    res.json({ message: "Đăng nhập thành công!", user });
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi server: " + err.message });
  }
};

module.exports = { login };
