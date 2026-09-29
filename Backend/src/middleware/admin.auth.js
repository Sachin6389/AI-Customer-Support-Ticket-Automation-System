import jwt from "jsonwebtoken"
import { asyncHandler } from "../utiles/AsyncHandler.js"
import { Apiresponse } from "../utiles/ApiResponse.js"

export const adminAuth = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const token = req.body?.token || req.query?.token || req.headers.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader);
        
        if (!token || token === "undefined" || token === "null") {
            return res.status(401).json(new Apiresponse(401, null, "Admin authentication token is missing. Please log in again."));
        }

        const secret = process.env.ACCES_TOKEN_SECRET || "farmiax_access_token_secret_jwt_key_2026_super_secure";
        const decodetoken = jwt.verify(token, secret);
        
        if (!decodetoken) {
            return res.status(401).json(new Apiresponse(401, null, "Invalid admin token"));
        }

        req.admin = decodetoken;
        next();
    } catch (error) {
        return res.status(401).json(new Apiresponse(401, null, "Admin session expired or invalid token. Please log in again."));
    }
});