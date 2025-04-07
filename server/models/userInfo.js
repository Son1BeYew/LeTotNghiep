let mongoose = require("mongoose");
var userInfoSchemal = new mongoose.Schema({
  username: String,
  unique: true,
  tenSinhVien: String,
});
