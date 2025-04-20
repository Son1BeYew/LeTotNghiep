const express = require("express");
const router = express.Router();
const { createRegister,getRegisterByMSSV } = require("../controllers/registerController");

router.post("/", createRegister);
router.get("/:mssv", getRegisterByMSSV);

module.exports = router;
