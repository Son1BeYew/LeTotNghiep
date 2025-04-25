const Register = require("../models/Register");

const createRegister = async (req, res) => {
  try {
    const { mssv, fullName, lop, khoa, nganh } = req.body;

    const existing = await Register.findOne({ mssv });
    if (existing) {
      return res.status(400).json({ message: "MSSV đã tồn tại!!!" });
    }

    const newRegister = new Register({ mssv, fullName, lop, khoa, nganh });
    await newRegister.save();

    res.status(201).json({ message: "Đăng ký thành công!!!", data: newRegister });
  } catch (err) {
    console.error("Lỗi khi tạo sinh viên:", err); // ⚠️ thêm dòng này để hiện lỗi chi tiết
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
  
const getRegisterByMSSV = async (req, res) => {
  try {
    const { mssv } = req.params;
    const student = await Register.findOne({ mssv });
    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
const deleteRegister = async (req, res) => {
  try {
    const { mssv } = req.params;
    const deletedInfo = await Register.findOneAndDelete({ mssv });
    if (!deletedInfo) {
      return res.status(404).json({ message: "Không tồn tại" });
    }
    res.json({ message: "Đã xóa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRegister, getRegisterByMSSV, deleteRegister };
