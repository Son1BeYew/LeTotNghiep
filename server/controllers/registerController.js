const Register = require("../models/Register");

const createRegister = async (req, res) => {
  try {
    const { mssv, fullName, lop, khoa, nganh } = req.body;

    const existing = await Register.findOne({ mssv });
    if (existing) {
      return res.status(400).json({ message: "MSSV đã tồn tại." });
    }

    const newRegister = new Register({ mssv, fullName, lop, khoa, nganh });
    await newRegister.save();

    res.status(201).json({ message: "Đăng ký thành công!", data: newRegister });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = { createRegister };
