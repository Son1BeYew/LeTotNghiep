const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const {
  authenticateUser,
} = require("../middleware/authMiddleware");
const {
  createInvitation,
  getMyInvitation,
  getAllInvitations,
  updateInvitation,
  deleteInvitationByUserId,
  searchInvitationByUsername,  
} = require("../controllers/ThuMoiController");

router.post("/", authenticateUser, upload.single("image"), createInvitation);
router.get("/me", authenticateUser, getMyInvitation);
router.put("/:userId", authenticateUser, upload.single("image"), updateInvitation);
router.delete("/:userId", authenticateUser, deleteInvitationByUserId);
router.get("/all",authenticateUser,getAllInvitations);
router.get("/search", authenticateUser, searchInvitationByUsername);

module.exports = router;
