require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");


connectDB().then(()=>{
    app.listen(6969,()=>{
    console.log("connected to server babu succesffuly on port 6969");
    })
}).catch(()=>{
    console.log("error occured");
})