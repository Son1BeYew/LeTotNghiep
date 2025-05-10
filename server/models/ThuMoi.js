const mongoose = require("mongoose");

const ThuMoiSchema = new mongoose.Schema({
  fullname: { type: String },
  image: { type: Buffer },
});


module.exports = mongoose.model("ThuMoi", ThuMoiSchema);
