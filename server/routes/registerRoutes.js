const express = require("express");
const router = express.Router();
const { createRegister } = require("../controllers/registerController");

router.post("/", createRegister);

module.exports = router;
