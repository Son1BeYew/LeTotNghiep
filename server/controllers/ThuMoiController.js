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
  try {
    const { userId, imageBase64 } = req.body;

    if (!userId || !imageBase64) {
      return res.status(400).json({ message: "Thiếu userId hoặc ảnh" });
    }

    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "Người dùng không tồn tại hoặc không có email" });
    }

    const invitation = await Invitation.findOne({ user: userId });
    if (!invitation) {
      return res.status(404).json({ message: "Người dùng chưa có thư mời" });
    }

    // Tạo transporter Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duongtanhuy2004@gmail.com",
        pass: "yndt fwxi yecz xhzh",
      },
    });

    const base64Data = imageBase64.split(";base64,").pop();

    const mailOptions = {
  from: '"Phòng Công nghệ Thông tin HUTECH" <duongtanhuy2004@gmail.com>',
  to: user.email,
  subject: "Thư mời tham dự nghiệp nghiệp 2025",
  html: `
    <p><strong>Xin chào</strong> ${invitation.fullname} - ${user.username}</p>
    <p>Trường Đại Học Công Nghệ TP.HCM(HUTECH) trân trọng chúc mừng bạn đã hoàn thành chương trình đào tạo và đủ điều kiện tốt nghiệp. Nhà trường trân trọng kính mời bạn tham dự lễ tốt nghiệp năm 2025. </p>
    <p>
      📍<strong>Địa điểm: E3-05.01, HUTECH - Thủ Đức Campus</strong><br>
      <a 
        href="https://www.google.com/maps/place/HUTECH+-+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87+TP.HCM+(Sai+Gon+Campus)/@10.8469089,106.7384658,14z/data=!4m20!1m13!4m12!1m4!2m2!1d106.7375271!2d10.8398881!4e1!1m6!1m2!1s0x317527c3debb5aad:0x5fb58956eb4194d0!2zxJDhuqFpIEjhu41jIEh1dGVjaCBLaHUgRSwgU29uZyBIw6BuaCBYYSBM4buZIEjDoCBO4buZaSwgSGnhu4dwIFBow7osIFRo4bunIMSQ4bupYywgSOG7kyBDaMOtIE1pbmg!2m2!1d106.785373!2d10.8550427!3m5!1s0x317528a459cb43ab:0x6c3d29d370b52a7e!8m2!3d10.8016175!4d106.7144559!16s%2Fg%2F124xvbfmg?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D"
        target="_blank" 
        style="color: blue; font-weight: bold; text-decoration: underline;"
      >
         Xem tại đây.
      </a>
    </p>
    <p>Mọi thắc mắc xin vui lòng liên hệ:</p>
        <p>📞 <strong>Phòng công tác sinh viên - SĐT</strong>: 0819 500 591 - 028 3512 0785</p>
        <p>📧 <strong>Email</strong>: congtacsinhvien@hutech.edu.vn</p>

        Một lần nữa, nhà trường xin chúc mừng bạn và mong được đón tiếp bạn trong buổi lễ quan trọng này!

        <p>Trân trọng!!!</p>
    <img src="${imageBase64}" alt="Thư mời tốt nghiệp" style="max-width: 200px; height: auto; border: 1px solid #ccc; margin-top: 10px;" />
  `,
  attachments: [
    {
      filename: "thu-moi.png",
      content: base64Data,
      encoding: "base64",
    },
  ],
};


    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Đã gửi thư mời cho sinh viên!" });
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
