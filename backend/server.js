require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
// CONNECT  DB
connectDB();

//Middleware to handle cors //frontend and backend communication
app.use(
cors({
    origin:process.env.CLIENT_URL || "*",
    methods: ["GET" ,"POST" , "PUT" , "DELETE"],
    allowedHeaders: ["Content-Type" , "Authorization"],
})
);



// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/tasks", taskRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listeing at ${PORT}`));