const User = require("../models/users");

// Lấy danh sách users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Tạo user mới
exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  const newUser = new User({ username, email, password, role });
  await newUser.save();
  res.json({ message: "User created!", user: newUser });
};

exports.updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ message: "User updated!", user: updatedUser });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted!" });
};
