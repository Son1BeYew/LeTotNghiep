const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  createInvitation,
  getAllInvitations,
  getMyInvitation,
} = require("../controllers/ThuMoiController");

router.post("/", authenticateUser, upload.single("image"), createInvitation);
router.get("/me", authenticateUser, getMyInvitation);

router.get(
  "/all",
  authenticateUser,
  authorizeRole(["admin"]),
  getAllInvitations
);

module.exports = router;
