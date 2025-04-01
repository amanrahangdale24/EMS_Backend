const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Import Routes
const accountRoutes = require('./routes/account.route');
const taskRoutes = require('./routes/tasks.route');
const employeeRoutes = require('./routes/employee.route');

// Database Connection
const connectDB = require('./db/config/connection');
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.includes('.netlify.app') || origin.includes('.vercel.app')) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow necessary headers
  }));

// Routes
app.use('/user', accountRoutes);
app.use('/task', taskRoutes);
app.use('/emp', employeeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const port = process.env.PORT || 4044;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
