import React, { useContext, useState } from "react";
import CartTottal from "../components/CartTottal.jsx";
import Tittle from "../components/Tittle.jsx";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { clearCart } from "../Storage/Product.js";

function OrderPlace() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [uiMessage, setUiMessage] = useState("");
  const [mode, setmode] = useState("");
  const userData = useSelector((state) => state.auth.userdata);

  

  const navigate = useNavigate();
  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);
  useEffect(() => {
    if (!uiMessage) return;
    const timer = setTimeout(() => setUiMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [uiMessage]);
  const order = async () => {
    try {
      const backendURLCart = import.meta.env.VITE_BACKEND_URL_CART;

      const backendURL = import.meta.env.VITE_BACKEND_URL_ORDER;
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      console.log(cartItems)

      const productId = cartItems.map((item) => item._id);
      const quantity = cartItems.map((item) => item.quantity);

      const totalAmount = localStorage.getItem("totalAmount");

      if (!mode) {
        setUiMessage("❌ Payment not selected");

        return;
      }
      const response = await axios.post(
        `${backendURLCart}/add`,
        { user: userData?.user, productId: productId, quantity: quantity },
        { headers: { Authorization: `Bearer ${userData?.accessToken}` } },
      );
      console.log(response);
      

      if (!response.data?.success) {
        setUiMessage(response.data.data || "Failed to add cart");

        return;
      } else {
        const orderData = {
          userId: userData?.user._id,
          Products: cartItems,
          totalAmount: totalAmount,
          actualAmount:totalAmount,
        };
        switch (mode) {
  case "COD":
    try {
      setLoading(true);

      const orderres = await axios.post(
        `${backendURL}/cashondelivery`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        }
      );

      if (!orderres?.data?.success) {
        setUiMessage(orderres.data.data || "Failed to place order");
        return;
      }

      toast.success("Order placed successfully");
      dispatch(clearCart());
      localStorage.removeItem("totalAmount");
      navigate("/orders");
    } catch {
      setUiMessage("Network error, please try again");
    } finally {
      setLoading(false);
    }
    break;

  case "Stripe":
    try {
      setLoading(true);

      const res = await axios.post(
        `${backendURL}/stripe-payment`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        }
      );
      console.log(res)

      const sessionUrl = res?.data?.data?.session_url;

      if (!sessionUrl) {
        setUiMessage("Stripe session URL missing");
        return;
      }

      // 🔥 ONLY redirect — DO NOT navigate
      window.location.href = sessionUrl;
    } catch (err) {
      console.error(err);
      setUiMessage("Stripe payment failed");
    } finally {
      setLoading(false);
    }
    break;

  case "Razerpay":
    try {
      setLoading(true);

      const res = await axios.post(
        `${backendURL}/razorpay`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Order placed successfully");
        dispatch(clearCart());
        localStorage.removeItem("totalAmount");
        navigate("/orders");
      }
    } catch {
      setUiMessage("Razorpay failed");
    } finally {
      setLoading(false);
    }
    break;

  default:
    break;
}

      }
    } catch (error) {
      setUiMessage(error.response?.data?.data || "❌ Order placement failed");
    }
  };
  return (
    <div className="min-h-[80vh] border-t bg-gray-50 px-3 sm:px-6 lg:px-12 py-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* LEFT – Delivery Info */}
        <div className="w-full lg:w-[50%] bg-white rounded-xl shadow-sm p-5 sm:p-7 flex flex-col gap-4">
          <div className="text-lg sm:text-xl lg:text-2xl mb-2">
            <Tittle text1={"DELIVERY "} text2={"INFORMATION"} />
          </div>

          <input
            className="border rounded-lg py-2.5 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            type="text"
            placeholder="First name"
            value={userData?.user?.fullName || ""}
            readOnly
          />

          <input
            className="border rounded-lg py-2.5 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            type="email"
            placeholder="Email"
            value={userData?.user?.email || ""}
            readOnly
          />

          <input
            className="border rounded-lg py-2.5 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            type="text"
            placeholder="Street"
            value={userData?.user?.address || ""}
            readOnly
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="border rounded-lg py-2.5 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              type="text"
              placeholder="City"
              value={userData?.user?.City || ""}
              readOnly
            />
            <input
              className="border rounded-lg py-2.5 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              type="text"
              placeholder="State"
              value={userData?.user?.State || ""}
              readOnly
            />
          </div>

          <input
            className="border rounded-lg py-2.5 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            type="number"
            placeholder="Pincode"
            value={userData?.user?.PinCode || ""}
            readOnly
          />

          <input
            className="border rounded-lg py-2.5 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            type="text"
            placeholder="Phone number"
            value={userData?.user?.phone || ""}
            readOnly
          />
        </div>

        {/* RIGHT – Order Summary */}
        <div className="w-full lg:w-[50%] flex flex-col gap-8">
          {/* Cart Total */}
          <div className="bg-white rounded-xl shadow-sm p-5 sm:p-7">
            <CartTottal />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm p-5 sm:p-7">
            <Tittle text1={"PAYMENT"} text2={"METHOD"} />

            <div className="flex flex-col gap-3 mt-4">
              {["Stripe", "Razerpay", "COD"].map((item) => (
                <div
                  key={item}
                  onClick={() => setmode(item)}
                  className={`flex items-center gap-4 border rounded-lg p-3 cursor-pointer transition
                ${
                  mode === item
                    ? "border-black bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full border flex-shrink-0
                  ${mode === item && "bg-black"}`}
                  />
                  <p className="text-sm font-medium">
                    {item === "COD" ? "Cash On Delivery" : item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {uiMessage && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                uiMessage.includes("❌")
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {uiMessage}
            </div>
          )}

          {/* Place Order Button */}
          <button
            onClick={order}
            className="w-full bg-black text-white py-3.5 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-900 transition"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderPlace;