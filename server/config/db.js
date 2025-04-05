const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Kết nối đến Mongoose ");
  } catch (error) {
    process.exit(1);
    console.log("Kết nối thất bại");
  }
};
module.exports = connectDB;
