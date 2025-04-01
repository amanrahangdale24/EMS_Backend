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
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Enable credentials sharing (cookies, etc.)
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
