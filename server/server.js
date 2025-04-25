require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const registerRoutes = require("./routes/registerRoutes");
const DKLeTotNghiepRoutes = require("./routes/DKLeTotNghiepRoutes");
const connectDB = require("./config/db");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/registers", registerRoutes);
app.use("/api/DKLeTotNghiep", DKLeTotNghiepRoutes);
connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started `);
});
