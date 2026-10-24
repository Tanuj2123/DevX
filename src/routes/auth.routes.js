const express = require("express");
const validateSignUpData = require("../validations/signup.validate");
const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const autenticateUser = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * - POST /auth/signup - Register User
 * @param {name,email,password,age,gender}
*/
router.post("/signup", async (req,res)=>{
    try {
        const {name,email,password,age,gender} = req.body;

        validateSignUpData(name,email,password,age,gender);
        

        const hashedPassword = await bcrypt.hash(password,10);

        const user = {
            name,email,
            password:hashedPassword,
            age,gender
        }

        const newUser = new UserModel(user);

        await newUser.save();

        res.status(201).json({
            message:"user created successfully",
            newUser
        });
    } catch (error) {
        res.status(400).json({
            "message":error.message
        })
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

        res.cookie("token",token);

        return res.status(200).json({
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

