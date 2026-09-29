import {Router} from "express";
import {OrderByID,Cashondelivery,getOrders,getuserorder,updatestatus,updateorderrecord , stripepayment,
  verifyStripePayment,} from "../controlers/order.controler.js";
import { verifyjwt } from "../middleware/auth.middleware.js";

const orderRouter=Router()
orderRouter.route("/cashondelivery").post(Cashondelivery)
orderRouter.route("/stripe-payment").post(stripepayment)
orderRouter.route("/verify-stripe-payment").post(verifyStripePayment)
orderRouter.route("/getorders").get(getOrders)
orderRouter.route("/getuserorders").post(verifyjwt,getuserorder)
orderRouter.route("/updatestatus").patch(updatestatus)
orderRouter.route("/updateorderrecord").delete(updateorderrecord)
orderRouter.route("/getsingleorder/:orderId").get(OrderByID)
export default orderRouter