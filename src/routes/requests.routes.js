const express = require("express");
const autenticateUser = require("../middlewares/auth.middleware");
const UserModel = require("../models/user.model");
const ConnectionModel = require("../models/connection.model");

const router = express.Router();



router.post("/send/:status/:toUserId",autenticateUser,async (req,res)=>{
    
    try {
        const {toUserId,status} = req.params;
        const fromUserId = req.userId;

        if(fromUserId === toUserId){
            return res.status(400).json({
                message:"Invalid Request"
            });
        }

        const allowedStatus = ["interested","ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid Status type:"+status
            });
        }
        const fromUser = await UserModel.findOne({_id:fromUserId});

        if(!fromUser){
            return res.status(400).json({
                message:"User doesnt Exist"
            });
        }

        const toUser = await UserModel.findOne({_id:toUserId});

        if(!toUser){
            return res.status(404).json({
                message:"User doesnt Exist"
            }); 
        }

        const isExisitingConnection = await ConnectionModel.findOne({
            $or:[
                {fromUserId:fromUserId,toUserId:toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        });

       

        if(isExisitingConnection){
            return res.status(400).json({
                message:"Request already sent"
            });
        }

        

        const connection = new ConnectionModel({
            fromUserId,
            toUserId,
            status
        })

        const data = await connection.save();

        return res.status(201).json({
            message:fromUser.name+" "+status+" in "+toUser.name,
            data
        });
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
});



module.exports = router;