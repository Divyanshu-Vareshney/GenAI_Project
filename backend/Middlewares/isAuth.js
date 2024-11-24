import jwt from "jsonwebtoken";
import User from "../Model/User.js";

export const isAuth=async(req,res,next)=>{
try {
    const token=req.headers.token;
    if(!token){
        return res.status(400).json({
            success:false,
            message:"Login First"
        })
    }
    const decode=jwt.verify(token,process.env.JWT_SEC);
    req.user=await User.findById(decode._id);
    next();

    
} catch (error) {
    res.status(500).json({
        message:"Login First"
    })
}
}