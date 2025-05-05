const DKLeTotNghiep = require("../models/DKLeTotNghiep");
const multer = require("multer");

const storage = multer.memoryStorage(); // Lưu ảnh vào RAM
const upload = multer({ storage: storage });

// Tạo đăng ký lễ tốt nghiệp
exports.createDKLeTotNghiep = async (req, res) => {
  try {
    const { MSSV, tenSinhVien, lop, tenKhoa, chuyenNganh } = req.body;

    // Kiểm tra MSSV đã tồn tại chưa
    const existed = await DKLeTotNghiep.findOne({ mssv: MSSV });
    if (existed) {
      return res.status(400).json({ message: "Bạn đã đăng ký rồi!" });
    }

    // Tạo mới sinh viên
    const newDK = new DKLeTotNghiep({
      mssv: MSSV,
      hovaten: tenSinhVien,
      lop: lop,
      khoa: tenKhoa,
      nganh: chuyenNganh,
    });

    // Nếu có ảnh thì lưu vào buffer
    if (req.file) {
      newDK.image = req.file.buffer;
    }

    await newDK.save();
    res.status(201).json({ success: true, message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// Lấy thông tin 1 sinh viên theo MSSV
exports.getSingleDKLeTotNghiep = async (req, res) => {
  try {
    const { mssv } = req.params;
    const student = await DKLeTotNghiep.findOne({ mssv });

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    // Chuyển ảnh thành base64 nếu có
    let imageBase64 = student.image ? `data:image/jpeg;base64,${student.image.toString("base64")}` : "";

    res.json({
      data: {
        mssv: student.mssv,
        hovaten: student.hovaten,
        lop: student.lop,
        khoa: student.khoa,
        nganh: student.nganh,
        image: imageBase64,
      }
    });
  } catch (error) {
    console.error("Lỗi getSingleDKLeTotNghiep:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// Lấy tất cả sinh viên
exports.getAllDKLeTotNghiep = async (req, res) => {
  try {
    const students = await DKLeTotNghiep.find();

    const studentList = students.map(student => ({
      mssv: student.mssv,
      hovaten: student.hovaten,
      lop: student.lop,
      khoa: student.khoa,
      nganh: student.nganh,
      image: student.image ? `data:image/jpeg;base64,${student.image.toString("base64")}` : "",
    }));

    res.json(studentList);
  } catch (error) {
    console.error("Lỗi getAllDKLeTotNghiep:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// Cập nhật thông tin sinh viên theo MSSV
exports.updateDKLeTotNghiep = async (req, res) => {
  try {
    const mssv = req.params.mssv;
    const student = await DKLeTotNghiep.findOne({ mssv });

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    // Cập nhật các trường thông tin
    student.hovaten = req.body.hovaten || student.hovaten;
    student.lop = req.body.lop || student.lop;
    student.khoa = req.body.khoa || student.khoa;
    student.nganh = req.body.nganh || student.nganh;

    // Cập nhật ảnh nếu có
    if (req.file) {
      student.image = req.file.buffer;
    }

    await student.save();
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi update:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// Xóa sinh viên theo MSSV
exports.deleteDKLeTotNghiep = async (req, res) => {
  try {
    const { mssv } = req.params;
    const result = await DKLeTotNghiep.findOneAndDelete({ mssv });

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên để xóa!" });
    }

    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    console.error("Lỗi xóa sinh viên:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};
