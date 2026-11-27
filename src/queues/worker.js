const {Worker} = require("bullmq")
const {connection, redisClient} = require("../cache/redis");
const sendEmail = require("../services/emailService");


const emailWorker = new Worker("email-queue",
    async (Job)=>{
        if(Job.name === "send-otp"){
            const {email} = Job.data;
            const {otp} = JSON.parse(await redisClient.get(email));
            await sendEmail(email,"DevX:Verify Your email","You Are going to be a part of the the devX family",`<h1>${otp}</h1>`);
        }
        else if(Job.name === "welcome-email"){
            const {email} = Job.data;
            await sendEmail(email,"Welcome to DevX","You Are now a part of the the devX family","<h2>Connect to the World With DevX</h2>");
        }
    },
    {connection}
)


emailWorker.on("failed",(err)=>{
    console.log("BuLL ERROR" + err)
})