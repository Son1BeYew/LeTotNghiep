const path = require("path");
const fs = require("fs");
const Invitation = require("../models/ThuMoi");
const User = require("../models/users");

const createInvitation = async (req, res) => {
  try {
    const { fullname } = req.body;
    const imagePath = req.file.path;

    const existing = await Invitation.findOne({ user: req.user.id });
    if (existing) return res.status(400).json({ message: "Đã tạo thư mời rồi" });

    const invitation = new Invitation({
      fullname,
      imagePath,
      user: req.user.id,
    });
    await invitation.save();

    res.status(201).json({
      message: "Tạo thành công",
      invitation: {
        fullname: invitation.fullname,
        imagePath: "uploads/" + path.basename(invitation.imagePath),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getAllInvitations = async (req, res) => {
  try {
    const users = await User.find();
    const invitations = await Invitation.find().populate("user");

    const result = users.map((user) => {
  const match = invitations.find(
    (i) => i.user && i.user._id && i.user._id.equals(user._id)
  );

  return {
    username: user.username,
    email: user.email,
    hasInvitation: !!match,
    invitation: match || null,
  };
});


    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getMyInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findOne({ user: req.user.id });

    if (!invitation) {
      return res.status(404).json({ message: "Chưa có thư mời nào." });
    }
    res.json({
      fullname: invitation.fullname,
      imagePath: "uploads/" + require("path").basename(invitation.imagePath),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const updateInvitation = async (req, res) => {
  try {
    const { fullname } = req.body;
    const invitation = await Invitation.findOne({ user: req.user.id });

    if (!invitation) return res.status(404).json({ message: "Không tìm thấy thư mời." });

    if (req.file) {
      // Xóa ảnh cũ nếu có
      if (fs.existsSync(invitation.imagePath)) {
        fs.unlinkSync(invitation.imagePath);
      }
      invitation.imagePath = req.file.path;
    }

    invitation.fullname = fullname || invitation.fullname;
    await invitation.save();

    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const deleteInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findOneAndDelete({ user: req.user.id });

    if (!invitation) return res.status(404).json({ message: "Không tìm thấy thư mời để xóa." });

    // Xóa ảnh
    if (fs.existsSync(invitation.imagePath)) {
      fs.unlinkSync(invitation.imagePath);
    }

    res.json({ message: "Xóa thư mời thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = {
  createInvitation,
  getAllInvitations,
  getMyInvitation,
  updateInvitation,
  deleteInvitation,
};
