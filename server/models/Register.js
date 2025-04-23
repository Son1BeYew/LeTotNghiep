const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  mssv: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    unique: true,
  },
  lop: {
    type: String,
    required: true,
    unique: true,
  },
  khoa: {
    type: String,
    required: true,
    unique: true,
  },
  nganh: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("Register", registerSchema);
