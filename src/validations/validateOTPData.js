const validator = require("validator");


const validateOTPData = (email,otp)=>{
    if(!validator.isEmail(email)){
        return false;
    }

    if(otp<100000 || otp>1000000){
        return false;
    }

    return true;
}


module.exports = validateOTPData;