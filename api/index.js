const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const connectDB = require("../config/db");

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

connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.use("/auth", authRoute);
app.use("/task", taskRoute);
app.use("/user", userRoute);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/upload", uploadRoute);

// ✅ health check
app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

// ✅ IMPORTANT: export app directly
module.exports = app;
