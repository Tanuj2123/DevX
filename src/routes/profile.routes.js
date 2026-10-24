const express = require("express");
const UserModel = require("../models/user.model");
const autenticateUser = require("../middlewares/auth.middleware");
const bcrypt = require("bcryptjs")
const validator = require("validator");
const validateProfileUpdateData = require("../validations/profileUpdate.validate");

const router = express.Router();

/**
 * - GET /profile - get userProfile
*/
router.get("/", autenticateUser,async (req,res)=>{
    
    const user = await UserModel.findOne({_id:req.userId});

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

/**
 * - PATCH /profile - update userProfile
*/
router.patch("/",autenticateUser,async (req,res)=>{

    try {
        if(!validateProfileUpdateData(req)){
            return res.status(400).json({
                message:"Invalid Updates"
            });
        }

        const payload = req.body;              
        
        
        const user = await UserModel.findOne({_id:req.userId});
        

        const updatedUser = await UserModel.updateOne({_id:user._id},{
            ...payload
        });

        res.status(200).json({
            message:"User Updated Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        });
    }
})

/**
 * - PATCH /profile/updatePassword - update userPassword
*/
router.patch("/updatePassword",autenticateUser,async (req,res)=>{
    const {oldPassword,newPassword} = req.body;


    if(!oldPassword || !newPassword){
        return res.status(400).json({
            message:"Credentials Required"
        });
    }
    try {   
        const user = await UserModel.findOne({_id:req.userId}).select("+password");

        const isValidPassword = await user.validatePassword(oldPassword);

        if(!isValidPassword){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }

        if(oldPassword === newPassword){
            return res.status(400).json({
                message:"New Password and Old Password cannot be same"
            });
        }

        if(!validator.isStrongPassword(newPassword)){
            return res.status(400).json({
                message:"Enter a Strong Password"
            });
        }

        const newPasswordHash = await bcrypt.hash(newPassword,10);

        user.password = newPasswordHash;

        await user.save();

        res.status(200).json({
            message:"Password Updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }

})

/**
 * - DELETE /profile - delete userProfile
*/
router.delete("/",autenticateUser,async (req,res)=>{
    const user = await UserModel.deleteOne({_id:req.user});

    res.status(200).json({
        message:"user deleted successfully",
        user
    });
})


module.exports  =router