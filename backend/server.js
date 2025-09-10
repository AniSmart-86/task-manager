require("dotenv").config();

const express = require("express");
const cors = require('cors');
const path = require("path");
const connectDB = require("./config/db");
const router = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const reportRouter = require("./routes/reportRoutes");

const app = express();

// middleware to handle cors
app.use(
    cors({
        origin: ["https://task-manager-olive-beta-72.vercel.app", "http://localhost:5173"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Database
connectDB();

// Middleware
app.use(express.json());


// Routes
app.use("/api/auth", router);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/reports", reportRouter);


// upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}` ))