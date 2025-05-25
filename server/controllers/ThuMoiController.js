const path = require("path");
const fs = require("fs");
const Invitation = require("../models/ThuMoi");
const User = require("../models/users");

const createInvitation = async (req, res) => {
  try {
    const { fullname, trangThai } = req.body;
    const imagePath = req.file.path;

    const existing = await Invitation.findOne({ user: req.user.id });
    if (existing)
      return res.status(400).json({ message: "Đã tạo thư mời rồi" });

    const invitation = new Invitation({
      fullname,
      imagePath,
      user: req.user.id,
      trangThai: trangThai || "Chưa đăng ký",
    });

    await invitation.save();

    res.status(201).json({
      message: "Tạo thành công",
      invitation: {
        fullname: invitation.fullname,
        imagePath: "uploads/" + path.basename(invitation.imagePath),
        trangThai: invitation.trangThai,
      },
    });
  } catch (error) {
    console.error("Lỗi tạo thư mời:", error); // 👈 Ghi log để dễ debug
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getAllInvitations = async (req, res) => {
  try {
    const users = await User.find();
    const invitations = await Invitation.find().populate("user");

    const result = users.map((user) => {
      const match = invitations.find(
        (inv) => inv.user && inv.user._id && inv.user._id.equals(user._id)
      );

      return {
        username: user.username,
        email: user.email,
        hasInvitation: !!match,
        invitation: match
          ? {
              fullname: match.fullname,
              imagePath: "uploads/" + path.basename(match.imagePath),
              trangThai: match.trangThai,
              createdAt: match.createdAt,
              user: {
                _id: match.user._id,
              },
            }
          : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Lỗi getAllInvitations:", error);
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
    const { userId } = req.params;
    const { fullname } = req.body;

    const invitation = await Invitation.findOne({ user: userId });
    if (!invitation)
      return res.status(404).json({ message: "Không tìm thấy thư mời." });

    if (req.file) {
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

const deleteInvitationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const invitation = await Invitation.findOneAndDelete({ user: userId });

    if (!invitation)
      return res
        .status(404)
        .json({ message: "Không tìm thấy thư mời để xóa." });

    if (fs.existsSync(invitation.imagePath)) {
      fs.unlinkSync(invitation.imagePath);
    }

    res.json({ message: "Xóa thư mời thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const searchInvitationByUsername = async (req, res) => {
  try {
    const username = req.query.username || req.params.username;
    if (!username || typeof username !== "string") {
      return res
        .status(400)
        .json({ message: "Thiếu hoặc sai định dạng username" });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const invitation = await Invitation.findOne({ user: user._id });
    if (!invitation) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thư mời của người dùng này" });
    }

    res.json({
      username: user.username,
      email: user.email,
      fullname: invitation.fullname,
      imagePath: "uploads/" + path.basename(invitation.imagePath),
      invitation: invitation,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = {
  createInvitation,
  getMyInvitation,
  getAllInvitations,
  updateInvitation,
  deleteInvitationByUserId,
  searchInvitationByUsername,
};
