const mongoose = require("mongoose");

const ThuMoi = new mongoose.Schema({
  fullname: { type: String, required: true },
  imagePath: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  trangThai: {
    type: String,
    enum: ['Đã đăng ký', 'Chưa đăng ký'],
    default: 'Chưa đăng ký'
  }
});



module.exports = mongoose.model("ThuMoi", ThuMoi);
