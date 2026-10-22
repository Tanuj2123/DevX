const validator = require("validator");

const validateSignUpData = (name,email,password,age,gender)=>{


    if(!name || !email || !password || !age || !gender){
        throw new Error("Enter all the required fields");
    }

    if(age<18){
        throw new Error("Invalid Age");
    }

    if(!validator.isEmail(email)){
        throw new Error("Invalid Email");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }

    if(!["male","female","others"].includes(gender)){
        throw new Error("Invalid Gender");
    }
}

module.exports = validateSignUpData;