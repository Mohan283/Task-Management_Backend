const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { taskRegister } = require("./taskController"); // your DB logic

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use cloud or local storage
const USE_CLOUD = process.env.USE_CLOUD === "true";

// Ensure local uploads folder exists
if (!USE_CLOUD && !fs.existsSync(path.join(__dirname, "../uploads"))) {
  fs.mkdirSync(path.join(__dirname, "../uploads"), { recursive: true });
}

// ---------------- PROFILE IMAGE ----------------
const uploadProfileImage = (req, res) => {
  const upload = require("../middleware/upload").single("image");

  upload(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    if (USE_CLOUD) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profiles" },
        (err, result) => {
          if (err) return res.status(500).json({ message: "Cloud upload failed", err });
          res.json({ imageUrl: result.secure_url });
        }
      );
      stream.end(req.file.buffer);
    } else {
      const filePath = path.join(__dirname, "../uploads", req.file.originalname);
      fs.writeFileSync(filePath, req.file.buffer);
      res.json({ imageUrl: `/uploads/${req.file.originalname}` });
    }
  });
};

// ---------------- TASK ATTACHMENTS ----------------
const uploadTaskAttachments = (req, res) => {
  const upload = require("../middleware/upload").array("attachments", 5);

  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    try {
      let attachments = [];

      if (USE_CLOUD) {
        attachments = await Promise.all(
          req.files.map(
            (file) =>
              new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: "task-attachments" },
                  (err, result) => {
                    if (err) reject(err);
                    else
                      resolve({
                        originalName: file.originalname,
                        fileType: file.mimetype,
                        filePath: result.secure_url,
                      });
                  }
                );
                stream.end(file.buffer);
              })
          )
        );
      } else {
        attachments = req.files.map((file) => {
          const filePath = path.join(
            __dirname,
            "../uploads",
            file.originalname
          );

          fs.writeFileSync(filePath, file.buffer);

          return {
            originalName: file.originalname,
            fileType: file.mimetype,
            filePath: `/uploads/${file.originalname}`,
          };
        });
      }

      const task = await taskRegister(req.body, attachments, req.params.id);

      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({
        message: "Task creation failed",
        error: err.message,
      });
    }
  });
};


module.exports = {
  uploadProfileImage,
  uploadTaskAttachments,
};
