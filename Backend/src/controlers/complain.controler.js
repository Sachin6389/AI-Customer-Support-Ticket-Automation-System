import { ApiError } from "../utiles/ApiError.js";
import { Apiresponse } from "../utiles/ApiResponse.js";
import { asyncHandler } from "../utiles/AsyncHandler.js";

import mongoose from "mongoose";
import crypto from "crypto";

import { Complain } from "../models/complain.model.js";
import { User } from "../models/user.model.js";


// ============================================================
// CREATE COMPLAINT
// ============================================================

const CreateComplain = asyncHandler(async (req, res) => {
    try {
        const { userId, complain } = req.body;

        // Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }

        // Check user
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Validate complaint
        if (
            !complain ||
            typeof complain !== "string" ||
            complain.trim() === ""
        ) {
            throw new ApiError(400, "Complaint cannot be empty");
        }

        const createcomplain = await Complain.create({
            user: userId,
            complain: complain.trim(),
        });

        return res.status(201).json(
            new Apiresponse(
                201,
                createcomplain,
                "Complaint successfully registered"
            )
        );

    } catch (error) {

        const status = error.statusCode || 500;

        return res.status(status).json(
            new Apiresponse(
                status,
                null,
                error.message || "Failed to register complaint"
            )
        );
    }
});


// ============================================================
// HUMAN ESCALATION
// ============================================================

const escalateComplaint = asyncHandler(async (req, res) => {
    try {

        const {
            userId,
            complaint,
            reason,
            priority = "medium"
        } = req.body;


        // ----------------------------------------------------
        // Validate userId
        // ----------------------------------------------------

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }


        // ----------------------------------------------------
        // Check user exists
        // ----------------------------------------------------

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }


        // ----------------------------------------------------
        // Validate complaint
        // ----------------------------------------------------

        if (
            !complaint ||
            typeof complaint !== "string" ||
            complaint.trim() === ""
        ) {
            throw new ApiError(
                400,
                "Valid complaint is required"
            );
        }


        // ----------------------------------------------------
        // Validate priority
        // ----------------------------------------------------

        const allowedPriority = [
            "low",
            "medium",
            "high",
            "critical"
        ];

        if (!allowedPriority.includes(priority)) {
            throw new ApiError(
                400,
                "Invalid priority"
            );
        }


        // ----------------------------------------------------
        // Generate escalation token
        // ----------------------------------------------------

        const tokenId = `ESC-${Date.now()}-${crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase()}`;


        // ----------------------------------------------------
        // Create complaint
        // ----------------------------------------------------

        const escalation = await Complain.create({
            user: userId,

            complain: complaint.trim(),

            status: "escalated",

            reason: reason
                ? reason.trim()
                : "AI agent could not resolve the complaint",

            priority,

            tokenId,

            escalatedToHuman: true,

            escalatedAt: new Date()
        });


        // ----------------------------------------------------
        // Response
        // ----------------------------------------------------

        return res.status(201).json(
            new Apiresponse(
                201,
                {
                    complaintId: escalation._id,
                    tokenId: escalation.tokenId,
                    status: escalation.status,
                    priority: escalation.priority,
                    reason: escalation.reason,
                    escalatedToHuman: true
                },
                "Complaint successfully escalated to human support"
            )
        );

    } catch (error) {

        const status = error.statusCode || 500;

        return res.status(status).json(
            new Apiresponse(
                status,
                null,
                error.message ||
                    "Something went wrong during human escalation"
            )
        );
    }
});


// ============================================================
// UPDATE COMPLAINT STATUS
// ============================================================

const UpdateStatusComplain = asyncHandler(async (req, res) => {

    try {

        const {
            complainId,
            status
        } = req.body;


        if (!complainId || !status) {
            throw new ApiError(
                400,
                "complainId and status are required"
            );
        }


        if (!mongoose.Types.ObjectId.isValid(complainId)) {
            throw new ApiError(
                400,
                "Invalid complain ID"
            );
        }


        const allowedStatus = [
            "pending",
            "processing",
            "escalated",
            "resolved",
            "closed"
        ];


        if (!allowedStatus.includes(status)) {
            throw new ApiError(
                400,
                "Invalid complaint status"
            );
        }


        const complain = await Complain.findByIdAndUpdate(
            complainId,
            {
                status
            },
            {
               returnDocument: "after" 
            }
        );


        if (!complain) {
            throw new ApiError(
                404,
                "Complaint not found"
            );
        }


        return res.status(200).json(
            new Apiresponse(
                200,
                complain,
                "Complaint status updated successfully"
            )
        );

    } catch (error) {

        const status = error.statusCode || 500;

        return res.status(status).json(
            new Apiresponse(
                status,
                null,
                error.message ||
                    "Something went wrong while updating complaint status"
            )
        );
    }
});


// ============================================================
// DELETE COMPLAINT
// ============================================================

const DeleteComplain = asyncHandler(async (req, res) => {

    try {

        const { complainId } = req.body;


        if (!complainId) {
            throw new ApiError(
                400,
                "ComplainId is required"
            );
        }


        if (!mongoose.Types.ObjectId.isValid(complainId)) {
            throw new ApiError(
                400,
                "Invalid Complain ID"
            );
        }


        // FIX:
        // Previously you were using Order.findByIdAndDelete()
        const response = await Complain.findByIdAndDelete(
            complainId
        );


        if (!response) {
            throw new ApiError(
                404,
                "Complaint not found"
            );
        }


        return res.status(200).json(
            new Apiresponse(
                200,
                response,
                "Complaint deleted successfully"
            )
        );

    } catch (error) {

        const status = error.statusCode || 500;

        return res.status(status).json(
            new Apiresponse(
                status,
                null,
                error.message ||
                    "Something went wrong while deleting complaint"
            )
        );
    }
});


// ============================================================
// GET ALL COMPLAINTS
// ============================================================

const getComplain = asyncHandler(async (req, res) => {

    try {

        const complaints = await Complain.find({})
            .populate(
                "user",
                "-password -refreshToken -accessToken -cartData -wishlist"
            )
            .sort({
                createdAt: -1
            });


        if (!complaints || complaints.length === 0) {
            throw new ApiError(
                200,
                "No complaints found"
            );
        }


        return res.status(200).json(
            new Apiresponse(
                200,
                complaints,
                "All complaints fetched successfully"
            )
        );

    } catch (error) {

        const status = error.statusCode || 500;

        return res.status(status).json(
            new Apiresponse(
                status,
                null,
                error.message ||
                    "Something went wrong while fetching complaints"
            )
        );
    }
});
const getUserComplain = asyncHandler(async (req, res) => {

    try {
        const userId =
               req.query.userId ||
               req.body?.userId ||
               req.params?.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }


        const complaints = await Complain.find( {user:userId}).sort({
                createdAt: -1
            });


        if (!complaints || complaints.length === 0) {
            throw new ApiError(
                200,
                [],
                "No complaints found"
            );
        }


        return res.status(200).json(
            new Apiresponse(
                200,
                complaints,
                "All complaints fetched successfully"
            )
        );

    } catch (error) {
        

        const status = error.statusCode || 500;

        return res.status(status).json(
            new Apiresponse(
                status,
                error.message ,
                    "Something went wrong while fetching complaints"
            )
        );
    }
});

// ============================================================
// EXPORT
// ============================================================

export {
    getUserComplain,
    CreateComplain,
    UpdateStatusComplain,
    DeleteComplain,
    getComplain,
    escalateComplaint
};