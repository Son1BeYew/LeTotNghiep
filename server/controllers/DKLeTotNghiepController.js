const DKLeTotNghiep = require("../models/DKLeTotNghiep");
const multer = require("multer");

const storage = multer.memoryStorage(); // Lưu ảnh vào RAM
const upload = multer({ storage: storage });

exports.upload = upload.single("image"); // Middleware xử lý file

// Tạo đăng ký lễ tốt nghiệp
exports.createDKLeTotNghiep = async (req, res) => {
  try {
    const { MSSV, tenSinhVien, tenKhoa, chuyenNganh } = req.body;
    console.log("Body:", req.body);
    console.log("File:", req.file);

    // ✅ Sửa lỗi ở đây (dùng mssv thường, trùng schema)
    const existed = await DKLeTotNghiep.findOne({ mssv: MSSV });
    if (existed) {
      return res.status(400).json({ success: false, message: "Sinh viên đã đăng ký!" });
    }

    const newDK = new DKLeTotNghiep({
      mssv: MSSV,
      hovaten: tenSinhVien,
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

// Lấy thông tin đăng ký theo MSSV
exports.getDKLeTotNghiepByMSSV = async (req, res) => {
  try {
    const { MSSV } = req.params;
    const info = await DKLeTotNghiep.findOne({ mssv: MSSV });

    if (!info) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sinh viên!" });
    }

    const imageBase64 = info.image ? `data:image/jpeg;base64,${info.image.toString("base64")}` : null;

    res.json({
      success: true,
      data: {
        mssv: info.mssv,
        hovaten: info.hovaten,
        khoa: info.khoa,
        nganh: info.nganh,
        image: imageBase64,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// Xóa đăng ký
exports.deleteDKLeTotNghiep = async (req, res) => {
  try {
    const { MSSV } = req.params;
    const result = await DKLeTotNghiep.findOneAndDelete({ mssv: MSSV });

    if (!result) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sinh viên để xóa!" });
    }

    res.json({ success: true, message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};
