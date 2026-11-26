const crypto = require("crypto");

const generateOtp = ()=>{
    const otp = crypto.randomInt(100000,1000000);
    return otp;
}

module.exports = generateOtp;