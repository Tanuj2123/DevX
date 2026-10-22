const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

userSchema.methods.getJWT = function(){
    try {
        const token = jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:"1d"});

        return token;
    } catch (error) {
        throw new Error(error.message);
    }
}

userSchema.methods.validatePassword = async function(password){
    const isValidPassword = await bcrypt.compare(password,this.password);
    return isValidPassword;
}

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;