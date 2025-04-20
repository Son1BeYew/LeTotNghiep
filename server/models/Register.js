const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  mssv: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: String,
  lop: String,
  khoa: String,
  nganh: String,
});

module.exports = mongoose.model("Register", registerSchema);
