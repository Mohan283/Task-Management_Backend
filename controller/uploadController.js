exports.uploadFile = (req, res) => {
  try {
    // SINGLE FILE UPLOAD
    if (req.file) {
      return res.status(200).json({
        message: "File uploaded successfully",
        file: {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
        },
      });
    }

    // MULTIPLE FILE UPLOAD
    if (req.files && req.files.length > 0) {
      const files = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));

      return res.status(200).json({
        message: "Files uploaded successfully",
        files,
      });
    }

    // NO FILE
    return res.status(400).json({ message: "No file uploaded" });

  } catch (error) {
    console.error("Upload controller error:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
};
