require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const DKLeTotNghiepRoutes = require("./routes/DKLeTotNghiepRoutes");
const thuMoiRoutes = require("./routes/ThuMoiRoutes");

const connectDB = require("./config/db");

const app = express();
app.use(cors());

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/DKLeTotNghiep", DKLeTotNghiepRoutes);
app.use("/api/thumoi", thuMoiRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
const uploadsPath = path.join(__dirname, "..", "uploads");

app.use("/uploads", express.static(uploadsPath));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started `);
});
