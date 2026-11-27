const express = require("express");
const CookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const profileRouter = require("./routes/profile.routes");
const requestRouter = require("./routes/requests.routes");
const userRouter = require("./routes/user.routes");
const paymentRouter = require("./routes/payment.routes");
const chatRouter = require("./routes/chat.routes");
const cors = require("cors")
const app = express();
require("./jobs/sendRequestRemianders");
require("./queues/worker");


/**
 * - global middlewares
 */
app.use(express.json());
app.use(CookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));


/**
 * - app routes
 */
app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
app.use("/user",userRouter);
app.use("/payment",paymentRouter);
app.use("/chat",chatRouter);





module.exports=app