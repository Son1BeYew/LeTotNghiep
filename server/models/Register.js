const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  mssv: { type: String, required: true, unique: true },
  fullName: { type: String },
  lop: { type: String },
  khoa: { type: String},
  nganh: { type: String },
});


module.exports = mongoose.model("Register", registerSchema);
