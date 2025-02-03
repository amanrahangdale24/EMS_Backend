const express = require("express");
const router = express.Router();

const taskModel = require('../db/models/tasksModel');
const userModel = require('../db/models/userModel');


// create task; 
router.post("/create", async (req, res) => {
    try {
        const { taskTitle, taskDescription, taskDate, category, employeeName } = req.body;

        // Find Employee by Name
        const employee = await userModel.findOne({ name: employeeName, role: "employee" });
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found!"
            });
        }

        // Create Task
        const newTask = new taskModel({
            taskTitle,
            taskDescription,
            taskDate,
            category,
            employeeId: employee._id, // Store Employee ID
            newTask: true
        });

        await newTask.save();

        // Update Employee Task Count (newTask++)
        const user = await userModel.findById(employee._id);
        user.taskNumbers.newTask += 1; // Increase newTask count by 1
        await user.save();

        res.status(201).json({
            message: "Task assigned successfully!",
            status: "true", 
            task: newTask
        });
    } catch (error) {
        res.status(500).json({
            message: "Error assigning task", error
        });
    }
})


// employee specific task 
router.get('/get/:employeeId',async(req,res)=>{
   
        const employeeId = req.params.employeeId; 
        const employeeTasks = await taskModel.find({employeeId}); 
        if(!employeeTasks){
            return res.json({
                message:"No tasks Assigned"
            })
        }
        res.status(200).json({
            tasks: employeeTasks, 
            message:"Tasks fetched",
            status: "true", 
        })
    
})
module.exports = router; 



router.post('/acceptTask', async (req, res) => {
    try {
        const { taskId, employeeId } = req.body;

        console.log("Received taskId:", taskId);
        console.log("Received employeeId:", employeeId);

        // Check if employeeId is defined
        if (!employeeId) {
            return res.status(400).json({ status: false, message: "Employee ID is required" });
        }

        // Find and update the task
        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            {   
                active: true,
                newTask: false,
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ status: false, message: "Task not found" });
        }

        // Increment the active task count in User model
        const updatedUser = await userModel.findByIdAndUpdate(
            employeeId.trim(),  // 🔥 Ensure there are no leading/trailing spaces
            {
                $inc: { 
                    "taskNumbers.active": 1,  
                    "taskNumbers.newTask": -1 
                }
            },
            { new: true }
        );

        console.log("Updated User:", updatedUser); // 🔥 Debugging log

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found in database" });
        }

        res.status(200).json({
            status: true,
            message: "Task accepted successfully",
            updatedTask,
            updatedUser
        });
    } catch (error) {
        console.error("Error accepting task:", error);
        res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
});


router.post("/markCompleted", async(req,res)=>{
    try {
        const { taskId, employeeId } = req.body;

        // Update Task Model: Mark as completed
        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            { active: false, completed: true }, // ✅ Mark task completed
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ status: false, message: "Task not found" });
        }

        // Update User Model: Adjust task count
        const updatedUser = await userModel.findByIdAndUpdate(
            employeeId,
            {
                $inc: { 
                    "taskNumbers.active": -1,    // ✅ Decrement Active Task Count
                    "taskNumbers.completed": 1   // ✅ Increment Completed Task Count
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        res.status(200).json({
            status: true,
            message: "Task marked as completed successfully",
            updatedTask,
            updatedUser
        });
    } catch (error) {
        console.error("Error marking task as completed:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
})

router.post("/markFailed", async(req,res)=>{
    try {
        const { taskId, employeeId } = req.body;

        // Update Task Model: Mark as failed
        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            { active: false, failed: true }, // ✅ Mark task failed
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ status: false, message: "Task not found" });
        }

        // Update User Model: Adjust task count
        const updatedUser = await userModel.findByIdAndUpdate(
            employeeId,
            {
                $inc: { 
                    "taskNumbers.active": -1,   // ✅ Decrement Active Task Count
                    "taskNumbers.failed": 1     // ✅ Increment Failed Task Count
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        res.status(200).json({
            status: true,
            message: "Task marked as failed successfully",
            updatedTask,
            updatedUser
        });
    } catch (error) {
        console.error("Error marking task as failed:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
})