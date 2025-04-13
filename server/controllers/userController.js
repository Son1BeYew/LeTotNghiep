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
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    let newUser = new User(req.body);
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

    res.json({ message: "User đã bị xóa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
