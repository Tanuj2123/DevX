const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    age:{
        type:Number,
        min:18,
        required:true
    },
    gender:{
        type:String,
        enum:["male","female","others"],
        required:true
    }
},{timestamps:true});

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;