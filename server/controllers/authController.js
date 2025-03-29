const User = require("../models/users");
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.find({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
