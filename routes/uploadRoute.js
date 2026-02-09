const express = require("express");
const router = express.Router();
const {
  uploadProfileImage,
  uploadTaskAttachments,
} = require("../controller/uploadController");

// ---------------- PROFILE IMAGE ----------------
router.post("/upload-profile", uploadProfileImage);

// ---------------- TASK ATTACHMENTS ----------------
router.post("/create-task", uploadTaskAttachments);

module.exports = router;
