import { asyncHandler } from "../utiles/AsyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import { Apiresponse } from "../utiles/ApiResponse.js";

import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

import mongoose from "mongoose";

import {
  getRedis,
  setRedis,
  deleteRedis,
} from "../utiles/cache.js";

import redisKeys from "../utiles/rediskey.js";


// ============================================================
// REDIS WISHLIST KEY
// ============================================================

const getWishlistRedisKey = (userId) => {
  return redisKeys.wishlist(userId);
};


// ============================================================
// ADD PRODUCT TO WISHLIST
// ============================================================

const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // --------------------------------------------------------
    // Validate Product ID
    // --------------------------------------------------------

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new ApiError(
        400,
        "Invalid ProductId"
      );
    }

    // --------------------------------------------------------
    // Check product exists
    // --------------------------------------------------------

    const product =
      await Product.findById(productId);

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    // --------------------------------------------------------
    // Find user
    // --------------------------------------------------------

    const user =
      await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    // --------------------------------------------------------
    // Check if product already exists
    //
    // wishlist normally contains ObjectIds.
    // Compare using productId instead of product document.
    // --------------------------------------------------------

    const alreadyExists =
      user.wishlist.some(
        (item) =>
          item.toString() === productId.toString()
      );

    if (alreadyExists) {
      throw new ApiError(
        400,
        "Product already in wishlist"
      );
    }

    // --------------------------------------------------------
    // Add product ID
    // --------------------------------------------------------

    user.wishlist.push(productId);

    await user.save();

    // --------------------------------------------------------
    // Get populated wishlist
    // --------------------------------------------------------

    const updatedUser =
      await User.findById(userId)
        .populate("wishlist")
        .lean();

    const wishlist =
      updatedUser?.wishlist || [];

    // --------------------------------------------------------
    // Update Redis
    // TTL = 24 hours
    // --------------------------------------------------------

    await setRedis(
      getWishlistRedisKey(userId),
      wishlist,
      86400
    );

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.status(201).json(
      new Apiresponse(
        201,
        wishlist,
        "Product added to wishlist"
      )
    );

  } catch (error) {

    const status =
      error.statusCode || 500;

    return res.status(status).json(
      new Apiresponse(
        status,
        null,
        error.message ||
          "Failed to add product to wishlist"
      )
    );
  }
});


// ============================================================
// GET WISHLIST
// ============================================================

const getWishlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const redisKey =
      getWishlistRedisKey(userId);

    // --------------------------------------------------------
    // 1. Check Redis
    // --------------------------------------------------------

    const cachedWishlist =
      await getRedis(redisKey);

    if (cachedWishlist !== null) {

      console.log(
        "Wishlist fetched from Redis"
      );

      return res.status(200).json(
        new Apiresponse(
          200,
          cachedWishlist,
          "Wishlist fetched successfully"
        )
      );
    }

    // --------------------------------------------------------
    // 2. Redis MISS
    // Fetch from MongoDB
    // --------------------------------------------------------

    console.log(
      "Wishlist fetched from MongoDB"
    );

    const user =
      await User.findById(userId)
        .populate("wishlist")
        .lean();

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    const wishlist =
      user.wishlist || [];

    // --------------------------------------------------------
    // 3. Save wishlist in Redis
    // TTL = 24 hours
    // --------------------------------------------------------

    await setRedis(
      redisKey,
      wishlist,
      86400
    );

    // --------------------------------------------------------
    // 4. Response
    // --------------------------------------------------------

    return res.status(200).json(
      new Apiresponse(
        200,
        wishlist,
        "Wishlist fetched successfully"
      )
    );

  } catch (error) {

    const status =
      error.statusCode || 500;

    return res.status(status).json(
      new Apiresponse(
        status,
        null,
        error.message ||
          "Failed to fetch wishlist"
      )
    );
  }
});


// ============================================================
// REMOVE PRODUCT FROM WISHLIST
// ============================================================

const removeWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // --------------------------------------------------------
    // Validate Product ID
    // --------------------------------------------------------

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new ApiError(
        400,
        "Invalid product ID"
      );
    }

    // --------------------------------------------------------
    // Check user
    // --------------------------------------------------------

    const user =
      await User.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    // --------------------------------------------------------
    // Remove product
    // --------------------------------------------------------

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            wishlist: productId,
          },
        },
        {
          new: true,
        }
      );

    if (!updatedUser) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    // --------------------------------------------------------
    // Get populated wishlist
    // --------------------------------------------------------

    const populatedUser =
      await User.findById(userId)
        .populate("wishlist")
        .lean();

    const wishlist =
      populatedUser?.wishlist || [];

    // --------------------------------------------------------
    // Update Redis
    // --------------------------------------------------------

    await setRedis(
      getWishlistRedisKey(userId),
      wishlist,
      86400
    );

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.status(200).json(
      new Apiresponse(
        200,
        wishlist,
        "Product removed from wishlist"
      )
    );

  } catch (error) {

    const status =
      error.statusCode || 500;

    return res.status(status).json(
      new Apiresponse(
        status,
        null,
        error.message ||
          "Failed to remove product from wishlist"
      )
    );
  }
});


// ============================================================
// EXPORT
// ============================================================

export {
  removeWishlist,
  addToWishlist,
  getWishlist,
};