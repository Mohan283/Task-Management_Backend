const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const app = express();
const { default: mongoose } = require('mongoose');
const cors= require('cors')
const authRoute = require('./routes/authRoute')
const taskRoute = require('./routes/taskRoute')
const userRoute= require('./routes/userRoute')
const uploadRoute= require('./routes/uploadRoute')
const session =require("express-session") ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(
  session({
    name: "admin.sid",
    secret: "adminSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true only in HTTPS
      sameSite: "lax"
    }
  })
);
PORT = process.env.PORT;
MONGO= process.env.MONGO_DB;

mongoose.connect(MONGO)
.then(()=>
{
    console.log("Database is connected successfully");
    
})
.catch((err)=>
{
    console.error("Connection error", err);
    
})

app.use('/auth', authRoute)
app.use('/task', taskRoute)
app.use('/user', userRoute)

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Connect image routes
app.use("/upload", uploadRoute);



module.exports = app;