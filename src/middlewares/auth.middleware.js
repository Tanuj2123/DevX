const jwt = require("jsonwebtoken");

const autenticateUser = (req,res,next)=>{

    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        });
    }

    try {
        const decodedObj = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decodedObj.userId;
        next();
    } catch (error) {
        res.status(401).json({
            message:error.message
        })
    }


}

module.exports = autenticateUser;