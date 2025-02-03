const mongoose = require('mongoose'); 

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    email:{
        type:String, 
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["admin","employee"],
        required:true
    },
    taskNumbers: {
        newTask: { type: Number, default: 0 },
        active: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
    }
})

module.exports = new mongoose.model("users", userSchema); 