const {createClient} = require("redis");
const {createNodeRedisClient} =  require("bullmq");

const redisClient = createClient({
     username: process.env.REDIS_CLOUD_USERNAME,
    password: process.env.REDIS_CLOUD_PASSWORD,
    socket: {
        host: process.env.REDIS_CLOUD_HOST,
        port: process.env.REDIS_CLOUD_PORT
    }
});

const connection = createNodeRedisClient(redisClient);

redisClient.on("error",(error)=>{
    console.log("Redis Error occured: ",error)
});

redisClient.on("connect",()=>{
    console.log("Connected to redis babu Successfully");
})


async function createConnection(){
    if(!redisClient.isOpen)
     await redisClient.connect();
}

createConnection();

module.exports = {redisClient,connection};