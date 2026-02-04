const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");
const path = require("path");

const authRoute = require("../routes/authRoute");
const taskRoute = require("../routes/taskRoute");
const userRoute = require("../routes/userRoute");
const uploadRoute = require("../routes/uploadRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

mongoose.connect(process.env.MONGO_DB)
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error:", err));

app.use("/auth", authRoute);
app.use("/task", taskRoute);
app.use("/user", userRoute);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/upload", uploadRoute);

// ✅ health check (CRITICAL)
app.get("/", (req, res) => {
  res.json({ status: "API running on Vercel" });
});

module.exports = serverless(app);
