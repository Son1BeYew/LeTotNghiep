const express = require("express");
const router = express.Router();
const controller = require("../controllers/DKLeTotNghiepController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", controller.getAllDKLeTotNghiep);
router.get("/:mssv", controller.getSingleDKLeTotNghiep);
router.post("/", upload.single("image"), controller.createDKLeTotNghiep);
router.put("/:mssv", upload.single("image"), controller.updateDKLeTotNghiep); // ✅ thêm upload ở đây
router.delete("/:mssv", controller.deleteDKLeTotNghiep);

module.exports = router;
