const express = require("express");
const router = express.Router();
const userModel = require("../db/models/userModel");

// Fetch all employees excluding admins
router.get("/employees", async (req, res) => {
    try {
        const employees = await userModel.find({ role: "employee" })
            .select("name email taskNumbers"); // Fetch only necessary fields

        if (!employees.length) {
            return res.status(404).json({
                status: false,
                message: "No employees found!",
            });
        }

        res.status(200).json({
            status: true,
            employees
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({
            status: false,
            message: "Server error",
        });
    }
});

module.exports = router;
