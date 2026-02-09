const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoute = require("./routes/authRoute");
const taskRoute = require("./routes/taskRoute");
const userRoute = require("./routes/userRoute");
const uploadRoute = require("./routes/uploadRoute");

const app = express();

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://task-management-frontend-eight-ruby.vercel.app/"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
