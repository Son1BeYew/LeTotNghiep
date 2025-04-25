const express = require("express");
const router = express.Router();

const {
  upload,
  createDKLeTotNghiep,
  getDKLeTotNghiepByMSSV,
  deleteDKLeTotNghiep
} = require("../controllers/DKLeTotNghiepController");

router.post("/", upload, createDKLeTotNghiep);
router.get("/:MSSV", getDKLeTotNghiepByMSSV);
router.delete("/:MSSV", deleteDKLeTotNghiep);

module.exports = router;
