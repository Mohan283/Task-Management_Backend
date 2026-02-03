const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // ✅ ADD THIS
const {
  registerUser,
  loginUser,
  getUser,
  update,
  delById,
  getMe,
} = require("../controller/userController");

const authMiddleware = require('../middleware/authMiddleware');
const { dbRegister,getDbData,getOneDbData,dbUpdate,dbDelById } = require("../usertaskcontroller/userTaskController");

// ✅ Register with profile image
router.post(
  "/user-register",
  upload.single("profileImage"), // ✅ VERY IMPORTANT
  registerUser
);

// Login (no file upload → JSON is fine)
router.post("/login", loginUser);

// 🔐 protected
router.get("/me", authMiddleware, getMe);

router.get("/allUser", getUser);
router.put("/update-user/:id", update);
router.delete("/delete-user/:id", delById);

//Database
router.post("/database",dbRegister)
router.get("/allDbData", getDbData);
router.get("/singleDbData/:id", getOneDbData);
router.put("/update-database/:id", dbUpdate);
router.delete("/delete-database/:id", dbDelById);

module.exports = router;
