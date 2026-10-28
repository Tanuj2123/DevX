const express = require("express");
const autenticateUser = require("../middlewares/auth.middleware");
const UserModel = require("../models/user.model");
const ConnectionModel = require("../models/connection.model");

const router = express.Router();

router.get("/requests/pending",autenticateUser,async (req,res)=>{


    try {
        const user = await UserModel.findOne({_id:req?.userId});


        const pendingConnections = await ConnectionModel.find({toUserId:user._id,status:"interested"}).populate("fromUserId",["name","age","gender"]);
        


        return res.status(200).json({
            message:"requests fetched Successfully",
            pendingConnections
        });
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
});

router.get("/connections",autenticateUser,async (req,res)=>{

    const userId = req.userId;

    try {
        const user = await UserModel.findOne({_id:userId});

        const connections = await ConnectionModel.find({
            $or:[
                {fromUserId:userId,status:"accepted"},
                {toUserId:userId,status:"accepted"}
            ]
        }).populate("fromUserId",["name","age","gender"]).populate("toUserId",["name","age","gender"]);

        //const data = connections.map((connection)=> connection.fromUserId);
        /**
         *  dont hardcode fromuser!!! if loggedIn user is fromuser return touser as an entry
         *  of connections and viceversa
        */


        const data = connections.map((connection)=> {
            if(connection.fromUserId._id.equals(userId)){
                return connection.toUserId
            }
            else return connection.fromUserId
        });

        return res.status(200).json({
            message:"Connections fetched Successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            message:error.message
        });
    }
})



module.exports = router;