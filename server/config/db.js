const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected Mongoose ");
  } catch (error) {
    process.exit(1);
    console.log("Connected Failed");
  }
};
module.exports = connectDB;
