import mongoose from "mongoose";

const complainSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        complain: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "escalated",
                "resolved",
                "closed"
            ],
            default: "pending"
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
                "critical"
            ],
            default: "medium"
        },

        reason: {
            type: String,
            default: null
        },

        tokenId: {
            type: String,
            unique: true,
            sparse: true
        },

        escalatedToHuman: {
            type: Boolean,
            default: false
        },

        escalatedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);


export const Complain = mongoose.model(
    "Complain",
    complainSchema
);