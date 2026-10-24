const express = require("express");
const CookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const profileRouter = require("./routes/profile.routes");

const app = express();


/**
 * - global middlewares
 */
app.use(express.json());
app.use(CookieParser());


/**
 * - app routes
 */
app.use("/auth",authRouter);
app.use("/profile",profileRouter);






module.exports=app