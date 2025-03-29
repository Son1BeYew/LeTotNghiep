const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
router.post("/login", authController.login);
router.get("/login", authController.login);
router.post("/login", authController.login);
router.post("/login", authController.login);
module.exports = router;
