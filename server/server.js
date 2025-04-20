require("dotenv").config();

let express = require("express");
let cors = require("cors");
let authRoutes = require("./routes/authRoutes");
let userRoutes = require("./routes/userRoutes");
let connectDB = require("./config/db");
const registerRoutes = require("./routes/registerRoutes");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", registerRoutes);
connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started `);
});
