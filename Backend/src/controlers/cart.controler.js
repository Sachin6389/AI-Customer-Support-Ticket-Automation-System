import { asyncHandler } from "../utiles/AsyncHandler.js"
import { ApiError } from "../utiles/ApiError.js"
import { Apiresponse } from "../utiles/ApiResponse.js"
import { User } from "../models/user.model.js"
import {Product} from '../models/product.model.js'
import mongoose from "mongoose"



const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let { productId, quantity } = req.body;
  
  

  if (Array.isArray(productId)) productId = productId[0];
  if (Array.isArray(quantity)) quantity = quantity[0];

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  quantity = Number(quantity); // 🔥 IMPORTANT
  
  

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }
  try {
     const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  const date = new Date();


  const updatedUser = await User.findByIdAndUpdate(
    userId,
   {
      $set: {
        [`cartData.${productId}.date`]: date
      },
      $inc: {
        [`cartData.${productId}.quantity`]: quantity
      }
    },
    { returnDocument: "after", upsert: true }
  );

  return res.status(201).json(
    new Apiresponse(
      201,
      updatedUser.cartData,
      "Product added to cart successfully"
    )
  );
    
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(new Apiresponse(status, null, error.message || "Something went wrong at adding to cart"));
    
  }

 
});


const updateCart = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const { productId, quantity } = req.body;
    const quantityNumber = Number(quantity);

    // Validate input
    if (!productId || quantityNumber === undefined) {
      throw new ApiError(400, "Invalid Product ID or Quantity");
    }

    // Validate quantity
    if (quantityNumber < 0) {
      throw new ApiError(400, "Quantity cannot be negative");
    }

    // If quantity is 0, remove product from cart
    if (quantityNumber === 0) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $unset: {
            [`cartData.${productId}`]: "",
          },
        },
        {
          returnDocument: "after",
        }
      );

      if (!updatedUser) {
        throw new ApiError(404, "User not found");
      }

      return res.status(200).json(
        new Apiresponse(
          200,
          updatedUser.cartData,
          "Product removed from cart successfully"
        )
      );
    } 
    const Quantity=String(quantityNumber)

    // Update product quantity and date
    const updatedUser = await User.findByIdAndUpdate(
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
        returnDocument: "after",
      }
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new Apiresponse(
        200,
        updatedUser.cartData,
        "Cart updated successfully"
      )
    );
  } catch (error) {
    const status = error.statusCode || 500;

    return res.status(status).json(
      new Apiresponse(
        status,
        null,
        error.message || "Something went wrong while updating cart"
      )
    );
  }
});




const getUserCart= asyncHandler(async(req,res)=>{
    try {
        const user = req.user;
        const userId = user._id;

        const userData = await User.findById(userId);

        if (!userData) {
             throw new ApiError(404,"User not found");
             ;
        }

        return res.status(302).json(
            new Apiresponse(302, userData.cartData, "User cart retrieved successfully")
        );
    } catch (error) {
        const status = error.statusCode || 500;
        return res
          .status(status)
          .json(new Apiresponse(status, null, error.message || "Something went wrong at fetching user cart"));
    }
})
export  {
    addToCart,updateCart,getUserCart
}