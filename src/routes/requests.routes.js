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

router.post("/review/:status/:requestId",autenticateUser,async (req,res)=>{
    const userId = req.userId;
    const {status,requestId} = req.params;

    try {
        const user = await UserModel.findOne({_id:userId});

        if(!user){
            return res.status(404).json({
                message:"user not found"
            });
        }

        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status: "+status
            });
        }

        const connectionRequest = await ConnectionModel.findOne({_id:requestId,
            toUserId:userId,status:"interested"});

        if(!connectionRequest){
            return res.status(404).json({
                message:"Request does not exist"
            });
        }

        connectionRequest.status = status;

        const fromUser = await UserModel.findOne({_id:connectionRequest.fromUserId});

        const data = await connectionRequest.save();

        res.status(200).json({
            message:user.name+" "+status+" "+fromUser.name+"'s request" ,
            data
        }); 
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }

})



module.exports = router;