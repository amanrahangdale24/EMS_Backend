
const jwt = require('jsonwebtoken'); 

function auth(req,res,next){
    const token = req.cookies.token;
    console.log(token); 

    if(!token){
        return res.status(404).json({
            message: "Kindly Login"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; 
        return next(); 

    }catch(error){
        return res.status(404).json({
            message: "Kindly Login"
        })
    }
}

module.exports = auth; 