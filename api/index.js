const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("../config/db");

const authRoute = require("../routes/authRoute");
const taskRoute = require("../routes/taskRoute");
const userRoute = require("../routes/userRoute");
const uploadRoute = require("../routes/uploadRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------
// CORS setup
// -----------------------
const allowedOrigins = [
  "http://localhost:5173", // React dev server
  "https://task-management-frontend-ten-omega.vercel.app" // Vercel frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// -----------------------
// DB connection
// -----------------------
let isConnected = false;
async function init() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

app.use(async (req, res, next) => {
  try {
    await init();
    next();
  } catch (err) {
    console.error("DB init error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// -----------------------
// Routes
// -----------------------
app.use("/auth", authRoute);
app.use("/task", taskRoute);
app.use("/user", userRoute);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/upload", uploadRoute);

app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

module.exports = app;