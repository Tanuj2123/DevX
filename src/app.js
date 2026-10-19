const express = require("express");
const bcrpyt = require("bcryptjs");
const UserModel = require("./models/user.model");

const app = express();

app.use(express.json())


app.get("/",(req,res)=>{
    res.send("<h1>Hello World<h1>")
})

app.post("/signup", async (req,res)=>{
    const {name,email,password,age,gender} = req.body;

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
        user
    });
})

app.post("/login",async (req,res)=>{
    const {email,password} = req.body;

    try {
        if(!email || !password){
            throw new Error("email and password are required");
        }

        const user = await UserModel.findOne({email:email}).select("+password");
        if(!user){
            throw new Error("Invalid Crendentials 1");
        }
        
        const hashedPassword = await bcrpyt.compare(password,user.password);
       

        if(!hashedPassword){
            throw new Error("Invalid Credentials");
        }

        return res.status(200).json({
            message:"user loggedin Sucessfully"
        })
        
    } catch(error) {
        res.status(400).json({
            message:error.message
        })
    }
})

app.get("/users", async (req,res)=>{

    const users = await UserModel.find({});

    res.status(200).json({
        message:"Users fetched Succesfully",
        users
    });

})

app.delete("/user",async (req,res)=>{
    const user = await UserModel.deleteOne({email:req.body.email});

    res.status(200).json({
        message:"user deleted successfully",
        user
    });
})


module.exports=app