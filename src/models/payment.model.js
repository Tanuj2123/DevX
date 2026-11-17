const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    paymentId:{
        type:String,
    },
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    reciept:{
        type:String,
        required:true
    },
    notes:{
        name:{
            type:String,
        },
        email:{
            type:String,
        },
        membershipType:{
            type:String
        }
    }
},{timestamps:true});



const PaymentModel = mongoose.model("Payment",paymentSchema);



module.exports = PaymentModel;