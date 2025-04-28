const DKLeTotNghiep = require("../models/DKLeTotNghiep");
const multer = require("multer");

const storage = multer.memoryStorage(); // Lưu ảnh vào RAM
const upload = multer({ storage: storage });

exports.upload = upload.single("image"); // Middleware xử lý file

// Tạo đăng ký lễ tốt nghiệp
exports.createDKLeTotNghiep = async (req, res) => {
  try {
    const { MSSV, tenSinhVien, lop, tenKhoa, chuyenNganh } = req.body;
    console.log("Body:", req.body);
    console.log("File:", req.file);

    // ✅ Sửa lỗi ở đây (dùng mssv thường, trùng schema)
    const existed = await DKLeTotNghiep.findOne({ mssv: MSSV });
    if (existed) {
      return res.status(400).json({ message: "Sinh viên đã đăng ký!" });
    }

    const newDK = new DKLeTotNghiep({
      mssv: MSSV,
      hovaten: tenSinhVien,
      lop: lop,
      khoa: tenKhoa,
      nganh: chuyenNganh,
    });

    if (req.file) {
      newDK.image = req.file.buffer; // Lưu ảnh dạng Buffer
    }

    await newDK.save();
    res.status(201).json({ success: true, message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};
// API lấy 1 sinh viên theo MSSV
exports.getSingleDKLeTotNghiep = async (req, res) => {
  try {
    const { mssv } = req.params;
    const student = await DKLeTotNghiep.findOne({ mssv });

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    let imageBase64 = "";
    if (student.image) {
      imageBase64 = `data:image/jpeg;base64,${student.image.toString("base64")}`;
    }

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

exports.getAllDKLeTotNghiep = async (req, res) => {
  try {
    const students = await DKLeTotNghiep.find();

    const studentList = students.map(student => {
      let imageBase64 = "";
      if (student.image) {
        imageBase64 = `data:image/jpeg;base64,${student.image.toString("base64")}`;
      }

      return {
        mssv: student.mssv,
        hovaten: student.hovaten,
        lop: student.lop,
        khoa: student.khoa,
        nganh: student.nganh,
        image: imageBase64,
      };
    });

    res.json(studentList);
  } catch (error) {
    console.error("Lỗi getAllDKLeTotNghiep:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// Cập nhật sinh viên theo MSSV
exports.updateDKLeTotNghiep = async (req, res) => {
  try {
    const mssv = req.params.mssv;
    const student = await DKLeTotNghiep.findOne({ mssv });

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    // Cập nhật các trường
    student.hovaten = req.body.hovaten || student.hovaten;
    student.lop = req.body.lop || student.lop;
    student.khoa = req.body.khoa || student.khoa;
    student.nganh = req.body.nganh || student.nganh;

    // Nếu upload ảnh mới, cập nhật ảnh
    if (req.file) {
      student.image = req.file.buffer;
    }

    await student.save();

    res.json({ message: "Cập nhật sinh viên thành công." });
  } catch (error) {
    console.error("Lỗi updateStudentByMSSV:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.deleteDKLeTotNghiep = async (req, res) => {
  try {
    const { mssv } = req.params; // sửa lại thành mssv, không phải MSSV
    const result = await DKLeTotNghiep.findOneAndDelete({ mssv: mssv });

    if (!result) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sinh viên để xóa!" });
    }

    res.json({ success: true, message: "Xóa thành công!" });
  } catch (error) {
    console.error("Lỗi xóa sinh viên:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};
