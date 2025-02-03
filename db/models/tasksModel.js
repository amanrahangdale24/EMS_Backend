const mongoose = require("mongoose"); 
const taskSchema = mongoose.Schema({
    taskTitle: { 
        type: String, 
        required: true 
    },
    taskDescription: { 
        type: String, 
        required: true 
    },
    taskDate: { 
        type: Date, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    active: { 
        type: Boolean, 
        default: false 
    },
    newTask: { 
        type: Boolean, 
        default: true 
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
    failed: { 
        type: Boolean, 
        default: false 
    },
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "users" 
    }, // Reference to employee
}, { timestamps: true });

const taskModel = new mongoose.model("tasks", taskSchema);
module.exports = taskModel