const cron = require("node-cron");
const {subDays,startOfDay,endOfDay} = require("date-fns");
const ConnectionModel = require("../models/connection.model");
const sendEmail = require("../services/emailService");


cron.schedule("0 8 * * *",async ()=>{
    const yesterday = subDays(new Date(),1);

    const startTime = startOfDay(yesterday);
    const endTime = endOfDay(yesterday);

    try {
        const pendingRequests = await ConnectionModel.find({
            status:"interested",
            createdAt:{
                $gte:startTime,
                $lt:endTime
            }
        }).populate("toUserId","email");

        const emails = new Set();

        pendingRequests.map((request)=> emails.add(request?.toUserId?.email));

        const emailTasks = [...emails].map((email) =>
            sendEmail(
                email,
            "Pending Requests!!",
            "You have received connection requests while you are away! You can check them out!!",
            "<h1>Hurray!! New Connection Request</h1>"
        ));

        const results = await Promise.allSettled(emailTasks);
    } catch (error) {
        console.log(error);
    }
})


