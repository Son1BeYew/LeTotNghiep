const express = require("express");
const router = express.Router();
const {
  createRegister,
  getRegisterByMSSV,
  deleteRegister,
} = require("../controllers/registerController");

router.post("/", createRegister);
router.get("/:mssv", getRegisterByMSSV);
router.delete("/:mssv", deleteRegister);
module.exports = router;
