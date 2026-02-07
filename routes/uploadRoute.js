const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadFile } = require("../controller/uploadController");

// 🔹 SINGLE upload (profile image)
router.post(
  "/single",
  upload.single("image"),
  uploadFile
);

// 🔹 MULTIPLE upload (attachments)
router.post(
  "/multiple",
  upload.array("files", 10),
  uploadFile
);

module.exports = router;