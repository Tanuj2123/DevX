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
        enum:{
            values:["male","female","others"],
            message:`{VALUE} is not valid gender`
        },
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

userSchema.pre("save",async function(){
    const user = this;

    const hashedPassword = await bcrypt.hash(user.password,10);

    user.password = hashedPassword;
})

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;