import { asyncHandler } from "../utiles/AsyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import {
  UploudOnCloundinary,
  destroyoncloundinary,
} from "../utiles/cloundinary.js";
import { Apiresponse } from "../utiles/ApiResponse.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import fs from "fs";

const AdminaddProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      unit,
      stock,
      Category,
    } = req.body;

    const topLocalPath = req.files?.top?.[0]?.path;

    if (!topLocalPath) {
      return res
        .status(400)
        .json(new Apiresponse(400, "TopImage file is required"));
    }

    const BottomLocalPath = req.files?.bottom?.[0]?.path;

    if (!BottomLocalPath) {
      return res
        .status(400)
        .json(new Apiresponse(400, "BottomImage file is required"));
    }

    const Frontlocalpath = req.files?.front?.[0]?.path;

    if (!Frontlocalpath) {
      return res
        .status(400)
        .json(new Apiresponse(400, "FrontImage file is required"));
    }

    const backLocalPath = req.files?.back?.[0]?.path;

    if (!backLocalPath) {
      return res
        .status(400)
        .json(new Apiresponse(400, "BackImage file is required"));
    }

    const imagePaths = [
      topLocalPath,
      Frontlocalpath,
      BottomLocalPath,
      backLocalPath,
    ];

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !unit ||
      !Category
    ) {
      for (const imagePath of imagePaths) {
        if (imagePath && fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (error) {
            console.error(
              `Failed to delete file: ${imagePath}`,
              error
            );
          }
        }
      }

      throw new ApiError(400, "All fields are required");
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      for (const imagePath of imagePaths) {
        if (imagePath && fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (error) {
            console.error(
              `Failed to delete file: ${imagePath}`,
              error
            );
          }
        }
      }

      throw new ApiError(400, "Product already exists");
    }

    // Upload images to Cloudinary
    const uploadedImages = {};

    for (const [key, imagePath] of Object.entries({
      top: topLocalPath,
      front: Frontlocalpath,
      bottom: BottomLocalPath,
      back: backLocalPath,
    })) {
      if (!imagePath || !fs.existsSync(imagePath)) {
        continue;
      }

      try {
        const result = await UploudOnCloundinary(imagePath);

        uploadedImages[key] = result;
      } catch (error) {
        console.error(`Failed to upload ${key} image:`, error);

        throw new ApiError(
          500,
          `Failed to upload ${key} image`
        );
      }
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      unit,
      stock: Number(stock) || 0,
      TopImage: uploadedImages.top,
      BackImage: uploadedImages.back,
      FrontImage: uploadedImages.front,
      BottomImage: uploadedImages.bottom,
      category: Category,
    });

    return res
      .status(201)
      .json(
        new Apiresponse(
          201,
          product,
          "Product added successfully"
        )
      );
  } catch (error) {

    const status = error.statusCode || 500;

    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          error.message , "Failed to add product"
        )
      );
  }
});



// ===================== Get All Products for admin and home =====================
const AdminlistOfProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      throw new ApiError(404, "No products found");
    }

    return res
      .status(200)
      .json(new Apiresponse(200, products, "Products fetched successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status,  error.message , "Failed to fetch products"));
  }
});

// ===================== Get Single Product to admin with full detail of farmer =====================
const AdminsingleProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;


    if (!mongoose.isValidObjectId(productId)) {
      throw new ApiError(400, "Invalid Product ID");
    }

    const product = await Product.findById(productId)

    if (!product) {
      throw new ApiError(404, "Product is not found")
    }

    return res
      .status(200)
      .json(new Apiresponse(200, product, "Product fetched successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message || "Something went wrong when fatching a product"));
  }
});

// ===================== Update Product both update =====================

 
const AdminUpdateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      quantity,
      unit,
      stock,
      category,
    } = req.body;

    

    // ============================================================
    // GET LOCAL IMAGE PATHS
    // ============================================================

    const topLocalPath = req.files?.top?.[0]?.path || null;
    const bottomLocalPath = req.files?.bottom?.[0]?.path || null;
    const frontLocalPath = req.files?.front?.[0]?.path || null;
    const backLocalPath = req.files?.back?.[0]?.path || null;

    // Store all uploaded local files for cleanup
    const imagePaths = [
      topLocalPath,
      bottomLocalPath,
      frontLocalPath,
      backLocalPath,
    ].filter(Boolean);

    // ============================================================
    // CLEANUP LOCAL FILES
    // ============================================================

    const deleteLocalImages = () => {
      for (const imagePath of imagePaths) {
        if (imagePath && fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (error) {
            console.error(
              `Failed to delete local file: ${imagePath}`,
              error
            );
          }
        }
      }
    };

    // ============================================================
    // VALIDATE REQUIRED FIELDS
    // ============================================================

    if (
      !productId ||
      !name ||
      !description ||
      price == null ||
      quantity == null ||
      !unit ||
      !category
    ) {
      deleteLocalImages();

      throw new ApiError(
        400,
        "All required fields are required"
      );
    }

    // ============================================================
    // VALIDATE PRODUCT ID
    // ============================================================

    if (!mongoose.isValidObjectId(productId)) {
      deleteLocalImages();

      throw new ApiError(
        400,
        "Invalid Product ID"
      );
    }

    // ============================================================
    // FIND OLD PRODUCT
    // ============================================================

    const oldProduct = await Product.findById(productId);

    if (!oldProduct) {
      deleteLocalImages();

      throw new ApiError(
        404,
        "Product not found"
      );
    }

    // ============================================================
    // UPLOAD NEW IMAGES
    // ============================================================

    const uploadedImages = {};

    const imagesToUpload = {
      top: topLocalPath,
      front: frontLocalPath,
      bottom: bottomLocalPath,
      back: backLocalPath,
    };

    for (const [key, imagePath] of Object.entries(imagesToUpload)) {
      if (!imagePath) {
        continue;
      }

      if (!fs.existsSync(imagePath)) {
        continue;
      }

      try {
        const result = await UploudOnCloundinary(imagePath);

        if (!result) {
          throw new Error(
            `Cloudinary upload failed for ${key}`
          );
        }

        uploadedImages[key] = result;

      } catch (error) {
        console.error(
          `Failed to upload ${key} image:`,
          error
        );

        deleteLocalImages();

        throw new ApiError(
          500,
          `Failed to upload ${key} image`
        );
      }
    }

    // ============================================================
    // PREPARE UPDATE DATA
    // ============================================================

    const updateData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
      unit,
      stock: Number(stock) || 0,
      category,
    };

    // ============================================================
    // ONLY UPDATE IMAGE IF A NEW IMAGE WAS UPLOADED
    // ============================================================

    if (uploadedImages.top) {
      updateData.TopImage = uploadedImages.top;
    }

    if (uploadedImages.front) {
      updateData.FrontImage = uploadedImages.front;
    }

    if (uploadedImages.bottom) {
      updateData.BottomImage = uploadedImages.bottom;
    }

    if (uploadedImages.back) {
      updateData.BackImage = uploadedImages.back;
    }

    // ============================================================
    // UPDATE PRODUCT
    // ============================================================

    const updatedProduct =
      await Product.findByIdAndUpdate(
        productId,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedProduct) {
      deleteLocalImages();

      throw new ApiError(
        500,
        "Failed to update product"
      );
    }

    // ============================================================
    // DELETE LOCAL FILES
    // ============================================================

    deleteLocalImages();

    // ============================================================
    // DELETE OLD CLOUDINARY IMAGES
    // ONLY IF A NEW IMAGE REPLACED THEM
    // ============================================================

    const oldImages = [
      {
        oldImage: oldProduct.TopImage,
        newImage: uploadedImages.top,
      },
      {
        oldImage: oldProduct.FrontImage,
        newImage: uploadedImages.front,
      },
      {
        oldImage: oldProduct.BottomImage,
        newImage: uploadedImages.bottom,
      },
      {
        oldImage: oldProduct.BackImage,
        newImage: uploadedImages.back,
      },
    ];

    for (const { oldImage, newImage } of oldImages) {
      // Delete old Cloudinary image only when
      // it was actually replaced
      if (!oldImage || !newImage) {
        continue;
      }

      try {
        const publicId = oldImage
          .split("/")
          .pop()
          .split(".")[0];

        await destroyoncloundinary(publicId);

      } catch (error) {
        console.error(
          "Failed to delete old Cloudinary image:",
          error
        );
      }
    }

    // ============================================================
    // RESPONSE
    // ============================================================

    return res.status(200).json(
      new Apiresponse(
        200,
        updatedProduct,
        "Product updated successfully"
      )
    );

  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    const statusCode =
      error.statusCode || 500;

    return res.status(statusCode).json(
      new Apiresponse(
        statusCode,
        null,
        error.message ||
          "Something went wrong while updating the product"
      )
    );
  }
});


// ===================== Delete Product =====================
const AdminremoveProduct = asyncHandler(async (req, res) => {
  try {
    // ============================================================
    // GET PRODUCT ID
    // ============================================================

    const {productId} =  req.body

      
      

    // ============================================================
    // VALIDATE PRODUCT ID
    // ============================================================

    if (!productId || !mongoose.isValidObjectId(productId)) {
      throw new ApiError(400, "Invalid Product Id");
    }

    // ============================================================
    // FIND PRODUCT
    // ============================================================

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product is not found");
    }

    // ============================================================
    // DELETE CLOUDINARY IMAGES
    // ============================================================

    const images = [
      product.TopImage,
      product.FrontImage,
      product.BottomImage,
      product.BackImage,
    ];

    for (const image of images) {
      if (
        image &&
        typeof image === "string" &&
        image.includes("cloudinary")
      ) {
        try {
          const publicId = image
            .split("/")
            .pop()
            .split(".")[0];

          await destroyoncloundinary(publicId);
        } catch (imgErr) {
          console.error(
            "Cloudinary destruction error:",
            imgErr
          );
        }
      }
    }

    // ============================================================
    // DELETE PRODUCT FROM DATABASE
    // ============================================================

    await Product.findByIdAndDelete(productId);

    // ============================================================
    // RESPONSE
    // ============================================================

    return res
      .status(200)
      .json(
        new Apiresponse(
          200,
          { deletedId: productId },
          "Product deleted successfully"
        )
      );
  } catch (error) {
    console.error("REMOVE PRODUCT ERROR:", error);

    const status = error.statusCode || 500;

    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message ||
            "Something went wrong when deleting a product"
        )
      );
  }
});



export {
  AdminaddProduct,
  AdminlistOfProducts,
  AdminsingleProduct,
  AdminUpdateProduct,
  AdminremoveProduct,

};