const mongoose = require("mongoose");

const ThuMoi = new mongoose.Schema({
  fullname: { type: String, required: true },
  imagePath: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ThuMoi", ThuMoi);
