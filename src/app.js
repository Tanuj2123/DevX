const express = require("express");
const bcrpyt = require("bcryptjs");
const UserModel = require("./models/user.model");
const validateSignUpData = require("./validations/validate.signup");
const jwt = require("jsonwebtoken");
const CookieParser = require("cookie-parser");
const autenticateUser = require("./middlewares/auth");

const app = express();

app.use(express.json())
app.use(CookieParser());

app.get("/",(req,res)=>{
    res.send("<h1>Hello World<h1>")
})

app.post("/signup", async (req,res)=>{
    try {
        const {name,email,password,age,gender} = req.body;

        validateSignUpData(name,email,password,age,gender);
        

        const hashedPassword = await bcrpyt.hash(password,10);

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

app.post("/login",async (req,res)=>{
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

app.get("/user", autenticateUser,async (req,res)=>{
    
    const user = await UserModel.findOne({_id:req.user});

    if(!user){
        return res.status(404).json({
            message:"user not found"
        });
    }

    res.status(200).json({
        message:"user Found",
        user
    });
})

app.delete("/user",autenticateUser,async (req,res)=>{
    const user = await UserModel.deleteOne({_id:req.user});

    res.status(200).json({
        message:"user deleted successfully",
        user
    });
})


module.exports=app