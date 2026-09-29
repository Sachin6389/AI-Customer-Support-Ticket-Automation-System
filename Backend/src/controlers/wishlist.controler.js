import { asyncHandler } from "../utiles/AsyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import { Apiresponse } from "../utiles/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid ProductId");
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "not found product");
    }
    const user = await User.findById(userId);
    if (user.wishlist.includes(product)) {
      throw new ApiError(400, "Product already in wishlist");
    }
    user.wishlist.push(product);
    await user.save();
    return res
      .status(201)
      .json(new Apiresponse(201, user.wishlist, "Product added to wishlist"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Failed to add product to wishlist",
        ),
      );
  }
});

const getWishlist = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(302)
      .json(
        new Apiresponse(302, user.wishlist, "Wishlist fetched successfully"),
      );
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Failed to fetch wishlist",
        ),
      );
  }
});

const removeWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          wishlist: productId,
        },
      },
      {
        returnDocument: "after",
      },
    );
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(205)
      .json(new Apiresponse(205, user.wishlist, "Product removed"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Failed to remove product from wishlist",
        ),
      );
  }
});
export { removeWishlist, addToWishlist, getWishlist };