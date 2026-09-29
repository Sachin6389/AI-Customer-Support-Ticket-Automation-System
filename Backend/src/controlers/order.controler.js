import { asyncHandler } from "../utiles/AsyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import { Apiresponse } from "../utiles/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import Stripe from "stripe";
import mongoose from "mongoose";



const stripe = new Stripe(process.env.STRIPE_KEY);


const Cashondelivery = asyncHandler(async (req, res) => {
  try {
    const {
      userId,
      Products,
      totalAmount,
      offerID,
      actualAmount,
      OfferName,
      Discount,
    } = req.body;

    // --------------------------------
    // Validate amounts
    // --------------------------------
    if (totalAmount == null || actualAmount == null) {
      throw new ApiError(400, "Total amount and actual amount are required");
    }

    if (Number(totalAmount) < 0 || Number(actualAmount) < 0) {
      throw new ApiError(400, "Amount cannot be negative");
    }

    // --------------------------------
    // Validate user ID
    // --------------------------------
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    // --------------------------------
    // Check user exists
    // --------------------------------
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // --------------------------------
    // Validate Products array
    // --------------------------------
    if (!Array.isArray(Products) || Products.length === 0) {
      throw new ApiError(400, "Products must be a non-empty array");
    }

    // --------------------------------
    // Validate each product
    // --------------------------------
    for (const item of Products) {
      if (!item._id) {
        throw new ApiError(400, "Product ID is required");
      }

      if (!mongoose.Types.ObjectId.isValid(item._id)) {
        throw new ApiError(400, `Invalid product ID: ${item._id}`);
      }

      if (
        item.quantity == null ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        throw new ApiError(400, "Product quantity must be at least 1");
      }

      if (item.price == null || Number(item.price) < 0) {
        throw new ApiError(
          400,
          "Product price must be greater than or equal to 0",
        );
      }
    }

    // --------------------------------
    // Prevent duplicate products
    // --------------------------------
    const productIds = Products.map((item) => item._id.toString());

    const uniqueProductIds = [...new Set(productIds)];

    if (uniqueProductIds.length !== productIds.length) {
      throw new ApiError(400, "Duplicate products are not allowed");
    }

    // --------------------------------
    // Get products from DB
    // --------------------------------
    const productsFromDB = await Product.find({
      _id: {
        $in: uniqueProductIds,
      },
    })

    // --------------------------------
    // Check products exist
    // --------------------------------
    if (productsFromDB.length !== uniqueProductIds.length) {
      const foundProductIds = new Set(
        productsFromDB.map((product) => product._id.toString()),
      );

      const missingProductIds = uniqueProductIds.filter(
        (productId) => !foundProductIds.has(productId.toString()),
      );

      throw new ApiError(
        404,
        `Product(s) not found: ${missingProductIds.join(", ")}`,
      );
    }

    // --------------------------------
    // Create product map
    // --------------------------------
    const productMap = new Map();

    for (const product of productsFromDB) {
      productMap.set(product._id.toString(), product);
    }

    // --------------------------------
    // Validate  stock
    // --------------------------------
    for (const item of Products) {
      const product = productMap.get(item._id.toString());

      if (!product) {
        throw new ApiError(404, `Product not found: ${item._id}`);
      }

      // --------------------------------
      // Stock check
      // --------------------------------
      const requestedQuantity = Number(item.quantity);
      const availableStock = Number(product.stock) || 0; // fallback to 0 if NaN/undefined

      if (availableStock <= 0) {
        throw new ApiError(400, `Stock is empty for product ${product._id}`);
      }

      if (requestedQuantity > availableStock) {
        throw new ApiError(
          400,
          `Only ${availableStock} item(s) available for product ${product._id}`
        );
      }
    }

    // --------------------------------
    // Prepare order products
    // --------------------------------
    const orderProducts = Products.map((item) => {
      const product = productMap.get(item._id.toString());

      return {
        product: product._id,

        quantity: Number(item.quantity),

        price: Number(item.price),
      };
    });

    // --------------------------------
    // Create offer
    // --------------------------------
    const offer = {
      offerID: offerID || "",
      OfferName: OfferName || "",
      Discount: Number(Discount) || 0,
    };

    // --------------------------------
    // Reduce stock atomically (with strict $gte check to prevent overselling)
    // --------------------------------
    for (const item of Products) {
      const requestedQty = Number(item.quantity);
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item._id,
          stock: { $gte: requestedQty } // Strict check: DB stock must be >= requested
        },
        {
          $inc: {
            stock: -requestedQty,
          },
        },
        {
          returnDocument: "after",
        },
      );

      // If product returns null, either it doesn't exist OR stock was insufficient during race condition
      if (!updatedProduct) {
        throw new ApiError(
          400,
          `Insufficient stock or product ${item.product} not found during final checkout.`
        );
      }
    }

    // --------------------------------
    // Create order
    // --------------------------------
    const orderData = {
      user: userId,

      Products: orderProducts,

      Offer: offer,

      actualAmount: Number(actualAmount),

      totalAmount: Number(totalAmount),

      orderDate: new Date(),

      status: "Order Placed",

      paymentMethod: "COD",

      payment: false,
    };

    const order = await Order.create(orderData);

    if (!order) {
      throw new ApiError(500, "Something went wrong while placing order");
    }

    // --------------------------------
    // Clear cart
    // --------------------------------
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          cartData: {},
        },
      },
      {
        returnDocument: "after",
      },
    );

    // --------------------------------
    // Response
    // --------------------------------
    return res
      .status(201)
      .json(new Apiresponse(201, order, "Order placed successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    console.log(error.message)
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          error.message ,"Something went wrong at fetching all orders",
        ),
      );
  }
});
const Rezorpay = asyncHandler(async (req, res) => {});
 
const stripepayment = asyncHandler(async (req, res) => {
  try {
    const {
      userId,
      Products,
      totalAmount,
      offerID,
      actualAmount,
      OfferName,
      Discount,
    } = req.body;

    // ============================================================
    // 1. Validate basic fields
    // ============================================================

    if (totalAmount == null || actualAmount == null) {
      throw new ApiError(
        400,
        "Total amount and actual amount are required"
      );
    }

    const requestedTotalAmount = Number(totalAmount);
    const requestedActualAmount = Number(actualAmount);

    if (
      !Number.isFinite(requestedTotalAmount) ||
      !Number.isFinite(requestedActualAmount)
    ) {
      throw new ApiError(400, "Invalid amount");
    }

    if (requestedTotalAmount < 0 || requestedActualAmount < 0) {
      throw new ApiError(400, "Amount cannot be negative");
    }

    // ============================================================
    // 2. Validate user
    // ============================================================

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // ============================================================
    // 3. Validate products
    // ============================================================

    if (!Array.isArray(Products) || Products.length === 0) {
      throw new ApiError(400, "Products must be a non-empty array");
    }

    for (const item of Products) {
      if (!item._id) {
        throw new ApiError(400, "Product ID is required");
      }

      if (!mongoose.Types.ObjectId.isValid(item._id)) {
        throw new ApiError(
          400,
          `Invalid product ID: ${item._id}`
        );
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        throw new ApiError(
          400,
          "Product quantity must be at least 1"
        );
      }
    }

    // ============================================================
    // 4. Prevent duplicate products
    // ============================================================

    const productIds = Products.map(
      (item) => item._id.toString()
    );

    const uniqueProductIds = [...new Set(productIds)];

    if (uniqueProductIds.length !== productIds.length) {
      throw new ApiError(
        400,
        "Duplicate products are not allowed"
      );
    }

    // ============================================================
    // 5. Get products from database
    // ============================================================

    const productsFromDB = await Product.find({
      _id: {
        $in: uniqueProductIds,
      },
    });

    if (productsFromDB.length !== uniqueProductIds.length) {
      const foundProductIds = new Set(
        productsFromDB.map(
          (product) => product._id.toString()
        )
      );

      const missingProductIds = uniqueProductIds.filter(
        (productId) => !foundProductIds.has(productId)
      );

      throw new ApiError(
        404,
        `Product(s) not found: ${missingProductIds.join(", ")}`
      );
    }

    // ============================================================
    // 6. Create product map
    // ============================================================

    const productMap = new Map();

    for (const product of productsFromDB) {
      productMap.set(
        product._id.toString(),
        product
      );
    }

    // ============================================================
    // 7. Validate stock
    // ============================================================

    for (const item of Products) {
      const product = productMap.get(
        item._id.toString()
      );

      const requestedQuantity = Number(item.quantity);
      const availableStock = Number(product.stock) || 0;

      if (availableStock <= 0) {
        throw new ApiError(
          400,
          `Stock is empty for product ${product._id}`
        );
      }

      if (requestedQuantity > availableStock) {
        throw new ApiError(
          400,
          `Only ${availableStock} item(s) available for product ${product._id}`
        );
      }
    }

    // ============================================================
    // 8. Create order products using DATABASE prices
    // ============================================================

    const orderProducts = Products.map((item) => {
      const product = productMap.get(
        item._id.toString()
      );

      const quantity = Number(item.quantity);

      // IMPORTANT:
      // Don't trust price coming from frontend.
      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new ApiError(
          400,
          `Invalid price for product ${product._id}`
        );
      }

      return {
        product: product._id,
        quantity,
        price,
      };
    });

    // ============================================================
    // 9. Offer
    // ============================================================

    const offer = {
      offerID: offerID || "",
      OfferName: OfferName || "",
      Discount: Number(Discount) || 0,
    };

    // ============================================================
    // 10. Stripe configuration
    // ============================================================

    const currency = "inr";

    const origin =
      process.env.CLIENT_URL ||
      "http://localhost:5173";

    const deliveryCharge =
      Number(process.env.DELIVERY_CHARGE) || 0;

    // ============================================================
    // 11. Prepare Stripe line items
    // ============================================================

    const line_items = orderProducts.map((item) => {
      const product = productMap.get(
        item.product.toString()
      );

      return {
        price_data: {
          currency,
          product_data: {
            name: product.name || "Product",
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // ============================================================
    // 12. Add delivery charge
    // ============================================================

    if (deliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: Math.round(
            deliveryCharge * 100
          ),
        },
        quantity: 1,
      });
    }

    // ============================================================
    // 13. Create order
    // ============================================================

    const orderData = {
      user: userId,

      Products: orderProducts,

      Offer: offer,

      actualAmount: requestedActualAmount,

      totalAmount: requestedTotalAmount,

      orderDate: new Date(),

      status: "Processing",

      paymentMethod: "Stripe",

      payment: false,
    };

    const order = await Order.create(orderData);

    if (!order) {
      throw new ApiError(
        500,
        "Something went wrong while creating order"
      );
    }

    // ============================================================
    // 14. Create Stripe Checkout Session
    // ============================================================

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items,

      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },

      success_url:
        `${origin}/verify?success=true&orderId=${order._id}`,

      cancel_url:
        `${origin}/verify?success=false&orderId=${order._id}`,
    });

    // ============================================================
    // 15. Save Stripe session ID
    // ============================================================

    order.stripeSessionId = session.id;

    await order.save();

    // ============================================================
    // 16. Return checkout URL
    // ============================================================

    return res.status(201).json(
      new Apiresponse(
        201,
        
        {
          orderId: order._id,
          sessionId: session.id,
          session_url: session.url,
        }
        ,
        "Stripe checkout session created successfully",
      )
    );

  } catch (error) {
    console.error("Stripe Payment Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      error.message || "Something went wrong while creating Stripe payment"
    );
  }
});
const verifyStripePayment = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.body;

    // ============================================================
    // 1. Validate order ID
    // ============================================================

    if (!orderId) {
      throw new ApiError(400, "Order ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }

    // ============================================================
    // 2. Find order
    // ============================================================

    const order = await Order.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // ============================================================
    // 3. Check Stripe session ID
    // ============================================================

    if (!order.stripeSessionId) {
      throw new ApiError(
        400,
        "Stripe session ID not found for this order"
      );
    }

    // ============================================================
    // 4. Retrieve Stripe Checkout Session
    // ============================================================

    const session = await stripe.checkout.sessions.retrieve(
      order.stripeSessionId
    );

    // ============================================================
    // 5. Verify payment status
    // ============================================================

    if (session.payment_status !== "paid") {
      return res.status(200).json(
        new Apiresponse(
          200,
          "Payment has not been completed",
          {
            orderId: order._id,
            payment: false,
            paymentStatus: session.payment_status,
            orderStatus: order.status,
          }
        )
      );
    }

    // ============================================================
    // 6. Prevent duplicate verification
    // ============================================================

    if (order.payment === true) {
      return res.status(200).json(
        new Apiresponse(
          200,
          "Payment already verified",
          {
            orderId: order._id,
            payment: true,
            status: order.status,
          }
        )
      );
    }

    // ============================================================
    // 7. Reduce stock
    // ============================================================

    for (const item of order.Products) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: {
            $gte: Number(item.quantity),
          },
        },
        {
          $inc: {
            stock: -Number(item.quantity),
          },
        },
        {
          new: true,
        }
      );

      if (!updatedProduct) {
        throw new ApiError(
          400,
          `Insufficient stock for product ${item.product}`
        );
      }
    }

    // ============================================================
    // 8. Update order
    // ============================================================

    order.payment = true;

    order.paymentMethod = "Stripe";

    order.status = "Order Placed";

    order.stripePaymentIntentId =
      session.payment_intent || null;

    await order.save();

    // ============================================================
    // 9. Clear user's cart
    // ============================================================

    await User.findByIdAndUpdate(
      order.user,
      {
        $set: {
          cartData: {},
        },
      }
    );

    // ============================================================
    // 10. Response
    // ============================================================

    return res.status(200).json(
      new Apiresponse(
        200,
        "Payment verified successfully",
        {
          orderId: order._id,
          payment: true,
          paymentMethod: "Stripe",
          status: order.status,
          paymentIntent: session.payment_intent,
        }
      )
    );

  } catch (error) {
    console.error(
      "Stripe Payment Verification Error:",
      error
    );

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      error.message ||
        "Something went wrong while verifying payment"
    );
  }
});
const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate(
        "user",
        "-password -refreshToken -accessToken -cartData -wishlist  ",
      )
      .populate("Products.product", " -stock -createdAt -updatedAt ")
    if (!orders) {
      throw new ApiError(404, "No orders found");
    }
    return res
      .status(200)
      .json(new Apiresponse(200, orders, "all orders fetched successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Something went wrong at fetching all orders",
        ),
      );
  }
});
const getuserorder = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const orders = await Order.find({ user })
      .populate("Products.product", " -stock -createdAt -updatedAt ")
    if (!orders) {
      throw new ApiError(404, "No orders found for this user");
    }

    return res
      .status(200)
      .json(new Apiresponse(200, orders, "user orders fetched successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    console.log(error.message)
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Something went wrong at fetching user orders",
        ),
      );
  }
});
const updatestatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  try {
    if (!orderId || !status) {
      throw new ApiError(400, "orderId and status are required");
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { returnDocument: "after" },
    );
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return res
      .status(201)
      .json(new Apiresponse(201, order, "Order status updated successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          "Something went wrong while updating order status",
        ),
      );
  }
});
const updateorderrecord = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  try {
    if (!orderId) {
      throw new ApiError(400, "OrderId is required");
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }

    const respons = await Order.findByIdAndDelete(orderId);

    return res
      .status(200)
      .json(new Apiresponse(200, respons, "Delete the order"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          "Something went wrong while deleting order ",
        ),
      );
  }
});

const OrderByID =asyncHandler(async(req,res)=>{
   try {
     const { orderId } = req.params;

      if (!orderId) {
      throw new ApiError(400, "OrderId is required");
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }
    
    const response = await Order.findById(orderId);
    if (!response) {
      throw new ApiError(404 ,"Order is not exits");
      
      
    }

    return res
      .status(200)
      .json(new Apiresponse(200, response, "fatch the  single order"));


   } catch (error) {

     const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          error.message,
          "Something went wrong while fatching single  order ",
        ),
      );
    
   }
})

export {
  Cashondelivery,
  stripepayment,
  verifyStripePayment,
  getOrders,
  getuserorder,
  updatestatus,
  updateorderrecord,
  OrderByID
};