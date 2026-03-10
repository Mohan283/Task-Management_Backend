const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const session = require("express-session");

const authRoute = require("./routes/authRoute");
const taskRoute = require("./routes/taskRoute");
const userRoute = require("./routes/userRoute");
const uploadRoute = require("./routes/uploadRoute");
const path = require('path')

const app = express();


const isProduction = process.env.NODE_ENV === "production";
/* ---------------- CORS ---------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://task.zerotorqcreative.com"
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysupersecretkey",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: isProduction,                // true in production
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax"
    }
  })
);

app.set("trust proxy", 1);

// DB (cached)
let isConnected = false;
app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    next();
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.use("/auth", authRoute);
app.use("/task", taskRoute);
app.use("/user", userRoute);
app.use("/upload", uploadRoute);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
