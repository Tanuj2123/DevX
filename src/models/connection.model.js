const mongoose = require("mongoose");



const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepeted","rejected"],
            message:`{VALUE} is not valid status`
        },
        required:true
    }
},{ timestamps:true});

connectionSchema.index({fromUserId:1,toUserId:1});

const ConnectionModel = mongoose.model("Connection",connectionSchema);


module.exports = ConnectionModel;