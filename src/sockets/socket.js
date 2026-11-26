const socket = require("socket.io");
const ChatModel = require("../models/chat.model");
const ConnectionModel = require("../models/connection.model");


const initializeSocket = (server)=>{

    const io = socket(server,{
        cors:{
            origin:"http://localhost:5173"
        }
    })

    io.on("connection",(socket)=>{
        //handle events
        socket.on("joinChat",({userId,toUserId})=>{
            const roomId = [userId,toUserId].sort().join("_");


            socket.join(roomId);
        })

        socket.on("sendMessage",async ({senderName,userId,toUserId,message})=>{
            const roomId = [userId,toUserId].sort().join("_");
            
            try {

                const areUsersFriends = await ConnectionModel.findOne({
                     $or: [
                        { fromUserId: userId, toUserId: toUserId },
                        { fromUserId: toUserId, toUserId: userId }
                    ],
                    status: "accepted"
                });

                if(!areUsersFriends){
                    socket.emit("messageError",{
                        message:"You must be friends to chat"
                    });
                }

                let chat = await ChatModel.findOne({participants:{
                    $all:[userId,toUserId]
                }});

                if(!chat){
                    chat = new ChatModel({
                        participants:[userId,toUserId],
                        messages:[]
                    })
                }
                
                chat.messages.push({
                    senderId:userId,
                    message:message
                });

                await chat.save();

                io.to(roomId).emit("messageRecieved",{senderName,id:userId,message});
            } catch (error) {
                io.to(roomId).emit("error",{
                    message:error.message
                })
            }
        })

        socket.on("disconnect",()=>{

        })
    })
}

module.exports = initializeSocket;