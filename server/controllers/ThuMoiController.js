const path = require("path");
const fs = require("fs");
const Invitation = require("../models/ThuMoi");
const User = require("../models/users");
const { send } = require("process");
const nodemailer = require("nodemailer");

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
    console.error("Lỗi tạo thư mời:", error);
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

    // Trả về thông tin người dùng ngay cả khi không có thư mời
    res.json({
      username: user.username,
      email: user.email,
      invitation: invitation
        ? {
            fullname: invitation.fullname,
            imagePath: "uploads/" + path.basename(invitation.imagePath),
            trangThai: invitation.trangThai,
            createdAt: invitation.createdAt,
            user: {
              _id: invitation.user,
            },
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
const sendInvitationEmail = async (req, res) => {
  const { mssv, email, imageUrl } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "son111333na@gmail.com",
        pass: "zpyd klms gcbv lpbh",
      },
    });

    const mailOptions = {
      from: "son111333na@gmail.com",
      to: email,
      subject: "Thư mời lễ tốt nghiệp",
      html: `
        <h3>Thư mời lễ tốt nghiệp</h3>
        <p>Chào sinh viên MSSV: <strong>${mssv}</strong>,</p>
        <p>Bạn được mời tham dự lễ tốt nghiệp vào <strong>13:00, 18/06/2025</strong> tại HUTECH.</p>
        <p>Địa điểm: E3-05.01</p>
        <br/>
        <img src="${imageUrl}" alt="Thư mời" style="max-width: 100%; height: auto;" />
        <p>
  <a href="https://www.google.com/maps/place/HUTECH+-+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87+TP.HCM+(Sai+Gon+Campus)/@10.8469089,106.7384658,14z/data=!4m20!1m13!4m12!1m4!2m2!1d106.7375271!2d10.8398881!4e1!1m6!1m2!1s0x317527c3debb5aad:0x5fb58956eb4194d0!2zxJDhuqFpIEjhu41jIEh1dGVjaCBLaHUgRSwgU29uZyBIw6BuaCBYYSBM4buZIEjDoCBO4buZaSwgSGnhu4dwIFBow7osIFRo4bunIMSQ4bupYywgSOG7kyBDaMOtIE1pbmg!2m2!1d106.785373!2d10.8550427!3m5!1s0x317528a459cb43ab:0x6c3d29d370b52a7e!8m2!3d10.8016175!4d106.7144559!16s%2Fg%2F124xvbfmg?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" style="color: purple; font-weight: bold;">
    Chỉ đường tới lễ tốt nghiệp (Google Maps)
  </a>
</p>

      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Thư mời đã được gửi!" });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ message: "Lỗi khi gửi email!" });
  }
};

module.exports = {
  createInvitation,
  getMyInvitation,
  getAllInvitations,
  updateInvitation,
  deleteInvitationByUserId,
  searchInvitationByUsername,
  sendInvitationEmail,
};
