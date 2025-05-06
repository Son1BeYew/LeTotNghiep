const User = require("../models/users");

exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
   
    res.json({
      data: {
        username: user.username,
        password: user.password,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    let newUser = new User({ username, password, email });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json({ message: "Tài khoản đã được xóa!!!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
