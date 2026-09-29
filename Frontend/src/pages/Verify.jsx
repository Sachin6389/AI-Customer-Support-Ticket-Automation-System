import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearCart } from "../Storage/Product.js";

function Verify() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const success = params.get("success");
  const orderId = params.get("orderId");

  const userData = useSelector((state) => state.auth.userdata);
  const backendURL = import.meta.env.VITE_BACKEND_URL_ORDER;

  const verifyPayment = async () => {
    try {
      if (!userData?.accessToken || !success || !orderId) {
        return;
      }

      const response = await axios.post(
        `${backendURL}/verify-stripe-payment`,
        { success, orderId },
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        }
      );

      if (response?.data?.success) {
        dispatch(clearCart());
        localStorage.removeItem("totalAmount");
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      navigate("/cart");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [userData?.accessToken, success, orderId]);

  return <div>Verifying payment...</div>;
}

export default Verify;