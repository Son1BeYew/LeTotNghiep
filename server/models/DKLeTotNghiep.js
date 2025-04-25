const mongoose = require("mongoose");

const DKLeTotNghiepSchema = new mongoose.Schema({
  mssv: { type: String, required: true, unique: true },
  hovaten: { type: String },
  lop: { type: String },
  khoa: { type: String},
  nganh: { type: String },
  image: { type: Buffer },
});


module.exports = mongoose.model("DKLeTotNghiep", DKLeTotNghiepSchema);
