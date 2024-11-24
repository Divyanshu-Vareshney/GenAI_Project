import sendMail from '../Middlewares/sendMail.js';
import User from '../Model/User.js';
import jwt from 'jsonwebtoken'
export const loginUser=async(req,res)=>{
    try {
        const {email}=req.body;
        let user=await User.findOne({email});
        if(!user){
            user = await User.create({
                email
            })
        }
        const otp=Math.floor(Math.random()*1000000);
        const verifyToken=await jwt.sign({user,otp},process.env.SECRET_KEY,{expiresIn:"5m"});
        await sendMail(email,"GenAI OTP",otp);
        res.status(201).json({
            success:true,
            message:"OTP Sent Successfully",
            verifyToken
        })
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
        
    }
}
export const verifyUser=async(req,res)=>{
try {
    const {otp,verifyToken}=req.body;
    const verify=jwt.verify(verifyToken,process.env.SECRET_KEY);
    if(!verify){
        return res.status(400).json({
            message:"Otp expired",
            success:false
        })
    }
    if(verify.otp!==otp){
        return res.status(400).json({
            message:"Wrong Otp Entered",
            success:false
        })
    }
    const token=jwt.sign({_id:verify.user._id},process.env.JWT_SEC,{expiresIn:"5d"});

    res.json({
        message:"Logged in Successfully",
        user:verify.user,
        token
    })
} catch (error) {
    res.status(500).json({
        message:error.message
    })
}
}

export const myProfile=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id);
        res.json(user);
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

