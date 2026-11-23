require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const http = require("http");
const initializeSocket = require("./src/sockets/socket");

const server = http.createServer(app);
initializeSocket(server);

connectDB().then(()=>{
    server.listen(6969,()=>{
    console.log("connected to server babu succesffuly on port 6969");
    })
}).catch((error)=>{
    console.log("ERROR: "+error.message);
})