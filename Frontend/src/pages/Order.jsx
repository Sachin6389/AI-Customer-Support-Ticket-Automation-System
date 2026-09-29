
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";

import Tittle from "../components/Tittle.jsx";
import { fetchProducts } from "../Storage/Product.js";

function Order() {
  const dispatch = useDispatch();

  // ============================================================
  // REDUX DATA
  // ============================================================

  const userData = useSelector(
    (state) => state.auth.userdata
  );

  const { productList = [], currency = "₹" } = useSelector(
    (state) => state.product
  );

  // ============================================================
  // STATE
  // ============================================================

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendURL =
    import.meta.env.VITE_BACKEND_URL_ORDER;

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ============================================================
  // LOAD ORDERS
  // ============================================================

  const loadOrders = async () => {
    if (!userData?.accessToken) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await Axios.post(
        `${backendURL}/getuserorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        }
      );

      console.log("Orders response:", response.data);

      // ========================================================
      // GET ORDER ARRAY
      // ========================================================

      const orders = response.data?.data;

      if (!Array.isArray(orders)) {
        setOrderData([]);
        return;
      }

      // ========================================================
      // FLATTEN PRODUCTS FROM ORDERS
      // ========================================================

      const allOrders = orders.flatMap((order) => {
        if (!Array.isArray(order?.Products)) {
          return [];
        }

        return order.Products.map((item) => ({
          ...item,

          // Order information
          orderId: order._id,
          orderDate: order.orderDate,
          status: order.status,
          payment: order.payment,
          paymentMethod: order.paymentMethod,

          // Amount information
          actualAmount:
            item.actualAmount ??
            order.actualAmount,

          totalAmount:
            item.totalAmount ??
            order.totalAmount,

          Offer:
            item.Offer ??
            order.Offer,
        }));
      });

      // Newest orders first
      allOrders.sort(
        (a, b) =>
          new Date(b.orderDate || 0) -
          new Date(a.orderDate || 0)
      );

      setOrderData(allOrders);
    } catch (err) {
      console.error(
        "Load orders error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD ORDERS WHEN USER LOGS IN
  // ============================================================

  useEffect(() => {
    if (userData?.accessToken) {
      loadOrders();
    } else {
      setOrderData([]);
    }
  }, [userData?.accessToken]);

  // ============================================================
  // PRODUCT FINDER
  // ============================================================

  const getProduct = (item) => {
    if (!item) {
      return null;
    }

    // If backend already populated product
    if (
      typeof item.product === "object" &&
      item.product !== null
    ) {
      return item.product;
    }

    // Try item._id
    let product = productList.find(
      (product) =>
        product._id === item._id
    );

    if (product) {
      return product;
    }

    // Try item.productId
    product = productList.find(
      (product) =>
        product._id === item.productId
    );

    return product || null;
  };

  // ============================================================
  // STATUS COLOR
  // ============================================================

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";

      case "processing":
        return "bg-blue-500";

      case "shipped":
        return "bg-purple-500";

      case "delivered":
        return "bg-green-500";

      case "cancelled":
      case "canceled":
        return "bg-red-500";

      case "failed":
        return "bg-red-500";

      default:
        return "bg-gray-400";
    }
  };

  // ============================================================
  // STATUS BADGE
  // ============================================================

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-5 text-center">
          <p className="font-medium text-red-600">
            {error}
          </p>

          <button
            onClick={loadOrders}
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen space-y-6 border-t px-4 pb-8 pt-16 md:px-8 lg:px-16">

      {/* ======================================================
          TITLE
      ====================================================== */}

      <div className="px-2 text-2xl md:px-8">
        <Tittle
          text1="ORDER"
          text2="SUMMARY"
        />
      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        </div>
      )}

      {/* ======================================================
          EMPTY ORDERS
      ====================================================== */}

      {!loading && orderData.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-white py-16 text-center">

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            📦
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            No orders found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>

        </div>
      )}

      {/* ======================================================
          ORDER LIST
      ====================================================== */}

      {!loading &&
        orderData.map((item, index) => {
          const productData = getProduct(item);

          /*
            Don't hide the complete order if the product
            has been deleted from the current product list.
          */

          const productName =
            productData?.name ||
            item.name ||
            "Product unavailable";

          const productImage =
            productData?.FrontImage ||
            productData?.TopImage ||
            item.FrontImage ||
            item.TopImage ||
            "/placeholder-product.png";

          const quantity =
            item.quantity ??
            item.Quantity ??
            1;

          const price =
            item.actualAmount ??
            item.price ??
            0;

          return (
            <div
              key={`${item.orderId}-${item._id || index}`}
              className="flex flex-col gap-6 rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"
            >

              {/* ==================================================
                  LEFT SECTION
              ================================================== */}

              <div className="flex min-w-0 gap-4">

                <img
                  className="h-20 w-20 shrink-0 rounded-lg border object-cover sm:h-24 sm:w-24"
                  src={productImage}
                  alt={productName}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/placeholder-product.png";
                  }}
                />

                <div className="flex min-w-0 flex-col gap-1">

                  <p className="text-base font-semibold text-gray-800 sm:text-lg">
                    {productName}
                  </p>

                  <p className="text-sm text-gray-600">
                    Price:{" "}
                    <span className="font-medium text-gray-800">
                      {currency}
                      {price}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600">
                    Date:{" "}
                    {item.orderDate
                      ? new Date(
                          item.orderDate
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "N/A"}
                  </p>

                  <p className="text-sm text-gray-600">
                    Payment:{" "}
                    <span className="font-medium text-gray-800">
                      {item.payment
                        ? "Paid"
                        : item.paymentMethod ||
                          "Pending"}
                    </span>
                  </p>

                  {/* QUANTITY */}

                  <span className="mt-2 inline-flex w-fit items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Quantity: {quantity}
                  </span>

                  {/* ORDER ID */}

                  <p className="mt-1 text-xs text-gray-400">
                    Order ID:{" "}
                    {item.orderId}
                  </p>

                </div>

              </div>

              {/* ==================================================
                  RIGHT SECTION
              ================================================== */}

              <div className="flex flex-col gap-4 md:items-end">

                {/* STATUS */}

                <div className="flex items-center gap-2">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  ></span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status || "Pending"}
                  </span>

                </div>

                {/* TRACK ORDER */}

                <button
                  onClick={() => {
                    // Add your tracking page/navigation here
                    console.log(
                      "Track order:",
                      item.orderId
                    );
                  }}
                  className="rounded-lg border px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Track Order
                </button>

              </div>

            </div>
          );
        })}
    </div>
  );
}

export default Order;
