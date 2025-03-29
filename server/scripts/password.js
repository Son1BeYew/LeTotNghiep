const bcrypt = require("bcryptjs");
const { poolPromise } = require("../config/db");
async function hashPassword() {
  try {
    const pool = await poolPromise;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123", salt);
    console.log(" Mật khẩu đã mã hóa:", hashedPassword);
    await pool
      .request()
      .input("hashedPassword", hashedPassword)
      .query(
        "UPDATE Account SET Password = @hashedPassword WHERE Username = 'user1' "
      );
    console.log("Mật khẩu đã được cập nhật vào database!");
  } catch (error) {
    console.error("Lỗi khi mã hóa mật khẩu:", error);
  }
}
hashPassword();
