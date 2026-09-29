import { ApiError } from "../utiles/ApiError.js";
import { asyncHandler } from "../utiles/AsyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

 export const verifyjwt  =  asyncHandler(async (req, res, next) => {
  try {
    const Token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();
      
      
      
    if (!Token) {
      throw new ApiError(401, "Unautherized request");
    }
    
    const decodetoken = jwt.verify(Token, process.env.ACCES_TOKEN_SECRET);
    const user = await User.findById(decodetoken?.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Ivalide Access token");
    }

    req.user = user;
    next();
  } catch (error) {
    const statecode = error?.statusCode || 500;
    return res
      .status(statecode)
      .json(new ApiError(statecode, null,error?.message || "Something went wrong in auth middleware"));
      
  }
});