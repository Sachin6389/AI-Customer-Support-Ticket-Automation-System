import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FiShoppingBag,
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiTrash2,
  FiRefreshCw,
  FiCalendar,
  FiMail,
  FiPhone,
  FiHash,
} from "react-icons/fi";

function GetOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL_ORDER;

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
   

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backendUrl}/getorders`,
        
      );


      if (response.data?.success) {
        const orderData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // Do not mutate the original API array
        setOrders([...orderData].reverse());
      } else {
        setOrders([]);
        setError(
          response.data?.massage || "Unable to fetch orders"
        );
      }
    } catch (err) {
      

      const message =
        err.response?.data?.massage ||
        err.response?.data?.message ||
        "Failed to fetch orders";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const StatusHandler = async (e, orderId) => {
    const newStatus = e.target.value;

    try {
      const response = await axios.patch(
        `${backendUrl}/updatestatus`,
        {
          orderId,
          status: newStatus,
        },
        
      );

      if (response.data?.success) {
        toast.success(
          response.data?.data || "Order status updated"
        );

        await fetchOrders();
      } else {
        toast.error(
          response.data?.massage ||
            "Failed to update order status"
        );
      }
    } catch (error) {
    

      toast.error(
        error.response?.data?.massage ||
          error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };


  // =====================================================
  // DELETE ORDER
  // =====================================================

  const DeleteHandler = async (orderId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/updateorderrecord`,
        {
        data: {
          orderId,
        },
      }
        
      );

      

      if (response.data?.success) {
        toast.success(
          response.data?.data || "Order deleted successfully"
        );

        await fetchOrders();
      } else {
        toast.error(
          response.data?.massage ||
            "Failed to delete order"
        );
      }
    } catch (error) {
      console.log("Delete order error:", error);

      toast.error(
        error.response?.data?.massage ||
          error.response?.data?.message ||
          "Failed to delete order"
      );
    }
  };


  // =====================================================
  // GET STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "delivered":
        return "order-status delivered";

      case "shipped":
        return "order-status shipped";

      case "out of delivery":
        return "order-status out-delivery";

      case "cancelled":
        return "order-status cancelled";

      case "pending":
        return "order-status pending";

      case "order placed":
        return "order-status placed";

      default:
        return "order-status default";
    }
  };


  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const getPaymentText = (order) => {
    if (order.payment) {
      return "Paid";
    }

    return order.paymentMethod || "Pending";
  };


  // =====================================================
  // FETCH ON LOAD
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);


  // =====================================================
  // NO TOKEN
  // =====================================================



  // =====================================================
  // LOADING
  // =====================================================

  if (loading && orders.length === 0) {
    return (
      <div className="admin-order-page">

        <div className="admin-order-header">
          <div>
            <span className="dashboard-eyebrow">
              BUILDNEX ADMIN
            </span>

            <h1 className="dashboard-title">
              Orders
            </h1>

            <p className="dashboard-subtitle">
              Manage customer orders and update
              delivery status.
            </p>
          </div>
        </div>

        <div className="order-loading-card">

          <div className="order-spinner">
            <FiRefreshCw />
          </div>

          <p>
            Loading orders...
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error && orders.length === 0) {
    return (
      <div className="admin-order-page">

        <div className="admin-order-header">
          <div>
            <span className="dashboard-eyebrow">
              BUILDNEX ADMIN
            </span>

            <h1 className="dashboard-title">
              Orders
            </h1>

            <p className="dashboard-subtitle">
              Manage customer orders and update
              delivery status.
            </p>
          </div>
        </div>

        <div className="order-error-card">

          <div className="order-error-icon">
            !
          </div>

          <h2>
            Unable to load orders
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="order-retry-button"
          >
            <FiRefreshCw />
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="admin-order-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-order-header">

        <div>

          <span className="dashboard-eyebrow">
            BUILDNEX ADMIN
          </span>

          <h1 className="dashboard-title">
            Orders
          </h1>

          <p className="dashboard-subtitle">
            Manage customer orders, payments and
            delivery status from here.
          </p>

        </div>

        <div className="order-header-actions">

          <div className="order-count-badge">
            <FiShoppingBag />

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </span>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="order-refresh-button"
          >
            <FiRefreshCw
              className={loading ? "order-spin" : ""}
            />

            Refresh
          </button>

        </div>

      </div>


      {/* =================================================
          ORDER SUMMARY
      ================================================= */}

      <div className="order-summary-grid">

        <div className="order-summary-card">

          <div className="order-summary-icon">
            <FiShoppingBag />
          </div>

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

        </div>


        <div className="order-summary-card">

          <div className="order-summary-icon green">
            <FiPackage />
          </div>

          <div>
            <span>
              Delivered
            </span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.status?.toLowerCase() ===
                    "delivered"
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="order-summary-card">

          <div className="order-summary-icon brown">
            <FiCreditCard />
          </div>

          <div>
            <span>
              Paid Orders
            </span>

            <strong>
              {
                orders.filter(
                  (order) => order.payment
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="order-summary-card">

          <div className="order-summary-icon orange">
            <FiPackage />
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.status?.toLowerCase() ===
                    "pending" ||
                    order.status?.toLowerCase() ===
                    "order placed"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          EMPTY ORDERS
      ================================================= */}

      {orders.length === 0 ? (

        <div className="order-empty-card">

          <div className="order-empty-icon">
            <FiShoppingBag />
          </div>

          <h2>
            No Orders Found
          </h2>

          <p>
            Customer orders will appear here when
            someone places an order.
          </p>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order, index) => (

            <div
              key={order._id || index}
              className="admin-order-card"
            >

              {/* =========================================
                  ORDER CARD HEADER
              ========================================= */}

              <div className="admin-order-card-header">

                <div className="order-number-wrapper">

                  <div className="order-main-icon">
                    <FiShoppingBag />
                  </div>

                  <div>

                    <span className="order-label">
                      ORDER
                    </span>

                    <h2>
                      #{String(order._id).slice(-8)}
                    </h2>

                  </div>

                </div>


                <div className="order-header-right">

                  <span
                    className={getStatusClass(
                      order.status
                    )}
                  >
                    {order.status || "Unknown"}
                  </span>

                  <span className="order-date">
                    <FiCalendar />

                    {order.orderDate
                      ? new Date(
                          order.orderDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>

                </div>

              </div>


              {/* =========================================
                  ORDER BODY
              ========================================= */}

              <div className="admin-order-card-body">


                {/* CUSTOMER */}

                <div className="order-info-section">

                  <div className="order-info-heading">
                    <FiUser />

                    <span>
                      Customer Details
                    </span>
                  </div>

                  <div className="order-info-content">

                    <p className="order-customer-name">
                      {order.user.fullName ||
                        "N/A"}
                    </p>

                    <p>
                      <FiMail />

                      {order.user?.email ||
                        "N/A"}
                    </p>

                    <p>
                      <FiPhone />

                      {order.user?.phone ||
                        "N/A"}
                    </p>

                  </div>

                </div>


                {/* DELIVERY */}

                <div className="order-info-section">

                  <div className="order-info-heading">
                    <FiMapPin />

                    <span>
                      Delivery Address
                    </span>
                  </div>

                  <div className="order-info-content">

                    <p>
                      {order.user?.address ||
                        "N/A"}
                    </p>

                    <p>
                      {order.user?.City ||
                        ""}
                      {order.user?.State
                        ? `, ${order.user.State}`
                        : ""}
                    </p>

                    <p>
                      PIN:{" "}
                      {order.user?.PinCode ||
                        "N/A"}
                    </p>

                  </div>

                </div>


                {/* PAYMENT */}

                <div className="order-info-section">

                  <div className="order-info-heading">
                    <FiCreditCard />

                    <span>
                      Payment
                    </span>
                  </div>

                  <div className="order-info-content">

                    <p className="order-total">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <p>
                      <span className="payment-label">
                        Status:
                      </span>

                      <span
                        className={
                          order.payment
                            ? "false"
                            : "true"
                        }
                      >
                        {getPaymentText(order)}
                      </span>
                    </p>

                    <p>
                      <span className="payment-label">
                        Method:
                      </span>{" "}
                      {order.paymentMethod ||
                        "N/A"}
                    </p>

                  </div>

                </div>

              </div>


              {/* =========================================
                  ORDER ITEMS
              ========================================= */}

              <div className="order-items-section">

                <div className="order-items-header">

                  <div className="order-info-heading">

                    <FiPackage />

                    <span>
                      Order Items
                    </span>

                  </div>

                  <span className="items-count">
                    {order.Products?.length || 0}{" "}
                    {order.Products?.length === 1
                      ? "Item"
                      : "Items"}
                  </span>

                </div>


                <div className="order-items-list">

                  {order.items?.map(
                    (item, itemIndex) => (

                      <div
                        key={
                          item._id ||
                          itemIndex
                        }
                        className="order-item"
                      >

                        <div className="order-item-number">
                          {itemIndex + 1}
                        </div>

                        <div className="order-item-details">

                          <span className="order-item-label">
                            Product ID
                          </span>

                          <span className="order-item-id">
                            {item._id || "N/A"}
                          </span>

                        </div>

                        <span className="order-item-quantity">
                          Qty:{" "}
                          {item.quantity || 0}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* =========================================
                  CARD FOOTER
              ========================================= */}

              <div className="admin-order-card-footer">

                <div className="order-id-full">

                  <FiHash />

                  <span>
                    {order._id}
                  </span>

                </div>


                <div className="order-management">

                  {/* STATUS */}

                  <div className="order-status-control">

                    <label>
                      Update Status
                    </label>

                    <select
                      onChange={(e) =>
                        StatusHandler(
                          e,
                          order._id
                        )
                      }
                      value={
                        order.status ||
                        "Order Placed"
                      }
                    >

                      <option value="Order Placed">
                        Order Placed
                      </option>

                      <option value="pending">
                        Pending
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="out of delivery">
                        Out of Delivery
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>


                  {/* DELETE */}

                  <button
                    onClick={() => {

                      const confirmed =
                        window.confirm(
                          "Are you sure you want to delete this order?"
                        );

                      if (confirmed) {
                        DeleteHandler(
                          order._id
                        );
                      }

                    }}
                    className="order-delete-button"
                  >

                    <FiTrash2 />

                    Delete Order

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default GetOrderList;