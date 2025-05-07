const DKLeTotNghiep = require("../models/DKLeTotNghiep");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.createDKLeTotNghiep = async (req, res) => {
  try {
    const { MSSV, tenSinhVien, lop, tenKhoa, chuyenNganh } = req.body;

    const existed = await DKLeTotNghiep.findOne({ mssv: MSSV });
    if (existed) {
      return res.status(400).json({ message: "Bạn đã đăng ký rồi!" });
    }

    const newDK = new DKLeTotNghiep({
      mssv: MSSV,
      hovaten: tenSinhVien,
      lop: lop,
      khoa: tenKhoa,
      nganh: chuyenNganh,
    });

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

exports.getSingleDKLeTotNghiep = async (req, res) => {
  try {
    const { mssv } = req.params;
    const student = await DKLeTotNghiep.findOne({ mssv });

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    let imageBase64 = student.image
      ? `data:image/jpeg;base64,${student.image.toString("base64")}`
      : "";

    res.json({
      data: {
        mssv: student.mssv,
        hovaten: student.hovaten,
        lop: student.lop,
        khoa: student.khoa,
        nganh: student.nganh,
        image: imageBase64,
      },
    });
  } catch (error) {
    console.error("Lỗi getSingleDKLeTotNghiep:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getAllDKLeTotNghiep = async (req, res) => {
  try {
    const students = await DKLeTotNghiep.find();

    const studentList = students.map((student) => ({
      mssv: student.mssv,
      hovaten: student.hovaten,
      lop: student.lop,
      khoa: student.khoa,
      nganh: student.nganh,
      image: student.image
        ? `data:image/jpeg;base64,${student.image.toString("base64")}`
        : "",
    }));

    res.json(studentList);
  } catch (error) {
    console.error("Lỗi getAllDKLeTotNghiep:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.updateDKLeTotNghiep = async (req, res) => {
  try {
    const mssv = req.params.mssv;
    const student = await DKLeTotNghiep.findOne({ mssv });

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên." });
    }

    // Cập nhật
    student.hovaten = req.body.hovaten || student.hovaten;
    student.lop = req.body.lop || student.lop;
    student.khoa = req.body.khoa || student.khoa;
    student.nganh = req.body.nganh || student.nganh;
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

exports.deleteDKLeTotNghiep = async (req, res) => {
  try {
    const { mssv } = req.params;
    const result = await DKLeTotNghiep.findOneAndDelete({ mssv });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sinh viên để xóa!" });
    }

    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    console.error("Lỗi xóa sinh viên:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};
