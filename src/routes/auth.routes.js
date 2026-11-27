const express = require("express");
const validateSignUpData = require("../validations/signup.validate");
const UserModel = require("../models/user.model");
const autenticateUser = require("../middlewares/auth.middleware");
const sendEmail = require("../services/emailService");
const {redisClient} = require("../cache/redis");
const generateOtp = require("../utils/generateOtp");
const validateOTPData = require("../validations/validateOTPData");
const bcrypt = require("bcryptjs");
const { sendOTP, sendWelcomeEmail } = require("../queues/queue");

const router = express.Router();

/**
 * - POST /auth/signup - Register User
 * @param {name,email,password,age,gender}
*/
router.post("/signup", async (req,res)=>{
    try {
        const {name,email,password,age,gender,photoUrl} = req.body;

        validateSignUpData(name,email,password,age,gender);

        const isAlreadyExist = await UserModel.findOne({email:email});

        if(isAlreadyExist){
            return res.status(400).json({
                success:false,
                message:"User Already Exist! Please Login"
            });
        } 
        const hashedPassword = await bcrypt.hash(password,10);
        const otp = generateOtp();
        const user = {
            name,email,
            password:hashedPassword,
            age,
            gender,
            photoUrl,
            isPremium:false,
            otp
        }


        await redisClient.set(email,JSON.stringify(user),{EX:120});

        await sendOTP(email);


        res.status(200).json({
            success:true,
            message:"User validation Successfull",
        });
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})


router.post("/verifyEmail", async (req,res)=>{

    try {
        const {email,otp} = req.body;

        if(!validateOTPData(email,otp)){
            return res.status(400).json({
                success:false,
                message:"Enter Valid Data"
            });
        }

        const user = await redisClient.get(email);
        const data = JSON.parse(user);

        if(!data){
            return res.status(400).json({
                success:false,
                message:"Otp Expired"
            });
        }
        
        if(email !== data.email){
            return res.status(400).json({
                success:false,
                message:"Invalid request"
            });
        }

        if(data?.otp !== Number(otp)){
            return res.status(400).json({
                success:false,
                message:"Incorrect OTP"
            });
        }

        const {name,password,age,gender,photoUrl,isPremium} = data;

        const newUser = new UserModel({
            name,
            email,
            password,age,gender,photoUrl,isPremium
        });

        await newUser.save();

        const token = newUser.getJWT();

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"lax"
        })
        //await sendEmail(email,"Welcome to DevX","You Are now a part of the the devX family","<h2>Connect to the World With DevX</h2>");
        sendWelcomeEmail(email);

        return res.status(200).json({
            success:true,
            message:"User created Successfully",
            userData:{
                name,age,gender,photoUrl,isPremium
            }
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }

})



/**
 * - POST /auth/login - Login User
 * @param {email}
 * @param {password}
*/
router.post("/login",async (req,res)=>{
    const {email,password} = req.body;

    try {
        if(!email || !password){
            throw new Error("email and password are required");
        }

        const user = await UserModel.findOne({email:email}).select("+password");
        if(!user){
            throw new Error("Invalid Crendentials");
        }
        
        const isValidPassword = await user.validatePassword(password);


        if(!isValidPassword){
            throw new Error("Invalid Credentials");
        }

        const token = user.getJWT();

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"lax"
        });

        

        const data = {
            _id:user._id,
            age:user.age,
            email:user.email,
            gender:user.gender,
            name:user.name,
            photoUrl:user?.photoUrl,
            isPremium:user?.isPremium
        }

        return res.status(200).json({
            success:true,
            user:data,
            message:"user loggedin Sucessfully"
        })
        
    } catch(error) {
        res.status(400).json({
            message:error.message
        })
    }
})

/**
 * - POST /auth/logout - Logout user
*/
router.post("/logout",autenticateUser, async (req,res)=>{
    res.clearCookie("token").status(200).json({message:"User Logged Out Successfully"});
})


module.exports = router;

