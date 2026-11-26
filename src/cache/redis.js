const {createClient} = require("redis");

const client = createClient({
     username: process.env.REDIS_CLOUD_USERNAME,
    password: process.env.REDIS_CLOUD_PASSWORD,
    socket: {
        host: process.env.REDIS_CLOUD_HOST,
        port: process.env.REDIS_CLOUD_PORT
    }
});

client.on("error",(error)=>{
    console.log("Redis Error occured: ",error)
});

client.on("connect",()=>{
    console.log("Connected to redis babu Successfully");
})


async function createConnection(){
    await client.connect();
}

createConnection();

module.exports = client;