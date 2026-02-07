const cloudinary = require("../config/cloudinary");

exports.uploadFile = async (req, res) => {
  try {
    // 🔹 SINGLE FILE
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "uploads" }
      );

      return res.status(200).json({
        message: "File uploaded successfully",
        file: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      });
    }

    // 🔹 MULTIPLE FILES
    if (req.files && req.files.length > 0) {
      const uploadedFiles = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "uploads" }
        );

        uploadedFiles.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      return res.status(200).json({
        message: "Files uploaded successfully",
        files: uploadedFiles,
      });
    }

    return res.status(400).json({ message: "No file uploaded" });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};
