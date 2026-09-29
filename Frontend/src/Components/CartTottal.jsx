import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TottalAmounts } from "../Storage/Product.js";
import Tittle from "../components/Tittle.jsx";
import { useNavigate } from "react-router-dom";


function CartTottal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 

  const { currency, cart, productList: products } = useSelector(
    (state) => state.product
  );
  useEffect(() => {
    if (products.length === 0 && cart.length > 0) {
      navigate("/cart");
    }
  }, [products.length, cart.length, navigate]);

  // ✅ Correct total calculation
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p._id === item._id);

      if (!product || item.quantity <= 0) return total;

      return total + product.price * item.quantity;
    }, 0);
  }, [cart, products]);

  // ✅ Correct useEffect dependencies
  useEffect(() => {
    
    dispatch(TottalAmounts(totalAmount));
  
  }, [cart, products, dispatch, totalAmount]);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Tittle text1="TOTAL " text2="BILL" />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{currency}{totalAmount}.00</p>
        </div>

        <hr />

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>{currency}50</p>
        </div>

        <hr />

        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {totalAmount === 0 ? 0 : totalAmount + 20}
          </b>
        </div>
      </div>
    </div>
  );
}

export default CartTottal;