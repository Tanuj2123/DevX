const express = require("express");
const router = express.Router();
const paymentInstance = require("../services/paymentService");
const autenticateUser = require("../middlewares/auth.middleware");
const PaymentModel = require("../models/payment.model");
const UserModel = require("../models/user.model");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')


router.post("/createOrder",autenticateUser,async(req,res)=>{

    try {
        const {membershipType} = req.body;
        if(!["silver","gold"].includes(membershipType.toLowerCase().trim())){
            return res.status(400).json({
                success:false,
                message:"Invalid membershipType: "+ membershipType
            })
        }

        const user = await UserModel.findOne({_id:req.userId});
        const {name,email} = user


        const order = await paymentInstance.orders.create({
          amount:(membershipType.toLowerCase().trim()==="silver"?9:19)*100,
          currency:"INR",
          receipt:"reciept#1",
          notes:{
            name:name,
            email:email,
            membershipType:membershipType
          }
        });


        const payment = new PaymentModel({
            userId:user._id,
            orderId:order.id,
            status:order.status,
            amount:order.amount,
            currency:order.currency,
            reciept:order.receipt,
            notes:order.notes
        });


        const savedPayment = await payment.save();

        return res.status(201).json({
            success:true,
            ...savedPayment.toJSON(),
            keyId:process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        });
    }
})

router.post("/webhook", async (req,res)=>{
    try {

        const webhookSignature = req.get("X-Razorpay-Signature");
       const isValidWebhook =  validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)

        if(!isValidWebhook){
            return res.status(401).json({
                message:"Invalid Signature"
            });
        }

        const paymentDetails = req.body.payload.payment.entity;

        const {status,order_id,id} = paymentDetails;

        const payment = await PaymentModel.findOne({orderId:order_id});

        payment.status = status
        payment.paymentId = id;

        await payment.save();

        const user = await UserModel.findOne({_id:payment.userId});

        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;

        await user.save();

        return res.status(200).json({
            message:"webhook Recieved Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message:error.message
        });
    }
})

router.get("/verify",autenticateUser,async (req,res)=>{
    try {
        const user = await UserModel.findOne({_id:req.userId});


        return res.status(200).json({
            isPremium:user.isPremium
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
})






module.exports = router;