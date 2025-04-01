const mongoose = require('mongoose'); 

function connectToDB(){
    try {
        mongoose.connect(process.env.MONGO_PUBLIC_URL).then(()=>{
            console.log("connected to DB")
        })
    } catch (error) {
        console.log("error occurred while connectiong to db") ;
    }
}

module.exports = connectToDB;