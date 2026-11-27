const {connection} = require("../cache/redis");
const {Queue} = require("bullmq")

const emailQueue = new Queue("email-queue",{connection});


const sendOTP = async (email)=>{
    const job = await emailQueue.add("send-otp",{email});
}

const sendWelcomeEmail = async (email)=>{
    await emailQueue.add("welcome-email",{email});
}

module.exports = {sendOTP,sendWelcomeEmail}