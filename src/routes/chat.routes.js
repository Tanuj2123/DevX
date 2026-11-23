
const express = require("express");
const autenticateUser = require("../middlewares/auth.middleware");
const ChatModel = require("../models/chat.model");

const router = express.Router();


router.get("/:chatId",autenticateUser,async(req,res)=>{

    try {
        const {chatId} = req.params;
        console.log(chatId);
        const [userId,toUserId] = chatId.split("_");

        console.log(userId,toUserId);

        if(userId!=req.userId && toUserId!=req.userId){
            return res.status(403).json({
                message:"Forbidden"
            });
        }

        let chat = await ChatModel.findOne({
            participants:{
                $all:[userId,toUserId]
            }
        }).populate("messages.senderId","name");

        if(!chat){
           chat = new ChatModel({
            participants:[userId,toUserId],
            messages:[]
           });

           await chat.save();
        }

        return res.status(200).json({
            success:true,
            message:"Chats fetched Successfully",
            chat
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
})



module.exports = router;