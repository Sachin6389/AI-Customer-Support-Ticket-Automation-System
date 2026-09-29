import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },

          quantity: {
            type: Number,
            required: true,
            min: 1,
          },

          price: {
            type: Number,
            required: true,
            min: 0,
          },
         
        },
      ],
      required: true,
    },

    Offer: {
      type: Object,
      default: {},
    },

    actualAmount: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        "Order Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Order Placed",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe", "Razorpay"],
      required: true,
    },

    payment: {
      type: Boolean,
      default: false,
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);


export const Order = mongoose.model("Order", orderSchema);