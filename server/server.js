const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(cors());
// Đọc dữ liệu JSON từ request
app.use(express.json());
app.use("/api/auth", authRoutes);
mongoose
  .connect("mongodb://127.0.0.1:27017/graduate")
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
