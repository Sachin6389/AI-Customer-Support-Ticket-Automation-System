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
// REDIS CART KEY
// ============================================================

const getCartRedisKey = (userId) => {
  return `cart:${userId.toString()}`;
};


// ============================================================
// ADD PRODUCT TO CART
// ============================================================

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let { productId, quantity } = req.body;

  // ----------------------------------------------------------
  // Handle array values
  // ----------------------------------------------------------

  if (Array.isArray(productId)) {
    productId = productId[0];
  }

  if (Array.isArray(quantity)) {
    quantity = quantity[0];
  }

  // ----------------------------------------------------------
  // Validate Product ID
  // ----------------------------------------------------------

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(
      400,
      "Invalid product ID"
    );
  }

  // ----------------------------------------------------------
  // Convert quantity to Number
  // ----------------------------------------------------------

  quantity = Number(quantity);

  if (
    !quantity ||
    Number.isNaN(quantity) ||
    quantity <= 0
  ) {
    throw new ApiError(
      400,
      "Quantity must be greater than 0"
    );
  }

  try {

    // --------------------------------------------------------
    // Check product exists
    // --------------------------------------------------------

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    // --------------------------------------------------------
    // Optional stock validation
    // --------------------------------------------------------

    if (
      product.stock !== undefined &&
      Number(product.stock) < quantity
    ) {
      throw new ApiError(
        400,
        "Requested quantity is not available in stock"
      );
    }

    const date = new Date();

    // --------------------------------------------------------
    // Update MongoDB
    // --------------------------------------------------------

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            [`cartData.${productId}.date`]: date,
          },

          $inc: {
            [`cartData.${productId}.quantity`]: quantity,
          },
        },
        {
          new: true,
        }
      );

    // --------------------------------------------------------
    // User not found
    // --------------------------------------------------------

    if (!updatedUser) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    // --------------------------------------------------------
    // Get updated cart
    // --------------------------------------------------------

    const cartData = updatedUser.cartData;

    // --------------------------------------------------------
    // Update Redis
    // --------------------------------------------------------

    await setRedis(
      getCartRedisKey(userId),
      cartData,
      86400 // 24 hours
    );

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.status(201).json(
      new Apiresponse(
        201,
        cartData,
        "Product added to cart successfully"
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
          "Something went wrong while adding product to cart"
      )
    );
  }
});


// ============================================================
// UPDATE CART
// ============================================================

const updateCart = asyncHandler(async (req, res) => {

  try {

    const user = req.user;

    const userId = user._id;

    const {
      productId,
      quantity,
    } = req.body;

    // --------------------------------------------------------
    // Validate Product ID
    // --------------------------------------------------------

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new ApiError(
        400,
        "Invalid Product ID"
      );
    }

    // --------------------------------------------------------
    // Convert quantity
    // --------------------------------------------------------

    const quantityNumber =
      Number(quantity);

    if (
      Number.isNaN(quantityNumber) ||
      quantity === undefined ||
      quantity === null
    ) {
      throw new ApiError(
        400,
        "Invalid quantity"
      );
    }

    // --------------------------------------------------------
    // Quantity cannot be negative
    // --------------------------------------------------------

    if (quantityNumber < 0) {
      throw new ApiError(
        400,
        "Quantity cannot be negative"
      );
    }

    // --------------------------------------------------------
    // If quantity = 0
    // Remove product from cart
    // --------------------------------------------------------

    if (quantityNumber === 0) {

      const updatedUser =
        await User.findByIdAndUpdate(
          userId,
          {
            $unset: {
              [`cartData.${productId}`]: "",
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

      // ------------------------------------------------------
      // Update Redis
      // ------------------------------------------------------

      await setRedis(
        getCartRedisKey(userId),
        updatedUser.cartData,
        86400
      );

      // ------------------------------------------------------
      // Response
      // ------------------------------------------------------

      return res.status(200).json(
        new Apiresponse(
          200,
          updatedUser.cartData,
          "Product removed from cart successfully"
        )
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
    // Check stock
    // --------------------------------------------------------

    if (
      product.stock !== undefined &&
      Number(product.stock) < quantityNumber
    ) {
      throw new ApiError(
        400,
        "Requested quantity is not available in stock"
      );
    }

    // --------------------------------------------------------
    // Update quantity
    // --------------------------------------------------------

    const Quantity =
      String(quantityNumber);

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            [`cartData.${productId}`]: {
              date: new Date(),
              quantity: Quantity,
            },
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
    // Update Redis
    // --------------------------------------------------------

    await setRedis(
      getCartRedisKey(userId),
      updatedUser.cartData,
      86400
    );

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.status(200).json(
      new Apiresponse(
        200,
        updatedUser.cartData,
        "Cart updated successfully"
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
          "Something went wrong while updating cart"
      )
    );
  }
});


// ============================================================
// GET USER CART
// ============================================================

const getUserCart = asyncHandler(async (req, res) => {

  try {

    const user = req.user;

    const userId = user._id;

    const redisKey =
      getCartRedisKey(userId);

    // --------------------------------------------------------
    // 1. Check Redis
    // --------------------------------------------------------

    const cachedCart =
      await getRedis(redisKey);

    if (cachedCart !== null) {

      console.log(
        "Cart fetched from Redis"
      );

      return res.status(200).json(
        new Apiresponse(
          200,
          cachedCart,
          "User cart retrieved successfully"
        )
      );
    }

    // --------------------------------------------------------
    // 2. Redis MISS
    // Fetch MongoDB
    // --------------------------------------------------------

    console.log(
      "Cart fetched from MongoDB"
    );

    const userData =
      await User.findById(userId).lean();

    if (!userData) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    const cartData =
      userData.cartData || {};

    // --------------------------------------------------------
    // 3. Save cart in Redis
    // --------------------------------------------------------

    await setRedis(
      redisKey,
      cartData,
      86400
    );

    // --------------------------------------------------------
    // 4. Response
    // --------------------------------------------------------

    return res.status(200).json(
      new Apiresponse(
        200,
        cartData,
        "User cart retrieved successfully"
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
          "Something went wrong while fetching user cart"
      )
    );
  }
});


// ============================================================
// EXPORT
// ============================================================

export {
  addToCart,
  updateCart,
  getUserCart,
};