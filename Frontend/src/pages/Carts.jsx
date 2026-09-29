import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartTottal from "../components/CartTottal.jsx";
import Tittle from "../components/Tittle.jsx";
import { assets } from "../assets/Assets.js";
import { useSelector, useDispatch } from "react-redux";
import { addtocart } from "../Storage/Product.js";
import { removeFromCart } from "../Storage/Product.js";
import { fetchProducts } from "../Storage/Product.js";


function Carts() {
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(fetchProducts());
    }, [dispatch]);
  const navigate = useNavigate();
 

  const Cart = useSelector((state) => state.product.cart);
  const { productList, loading, error } = useSelector((state) => state.product);
  const currency = useSelector((state) => state.product.currency);
  

  const [cartdata, setcartdata] = useState([]);
  

  useEffect(() => {
    setcartdata(Cart); // cart is already array
  }, [Cart]);

  // ✅ Update cart quantity
  const updateCart = (itemId, price, quantity) => {
    const updatedCart = cartdata.map((p) =>
      p._id === itemId && p.price === price ? { ...p, quantity } : p
    );
    setcartdata(updatedCart);
    dispatch(addtocart(updatedCart));
  };
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="border-t pt-14 bg-gray-50 min-h-screen px-4 sm:px-8">
      {/* Title */}
      <div className="text-3xl font-semibold mb-6 text-gray-800">
        <Tittle text1={"ORDER"} text2={"PRODUCTS"} />
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden divide-y">
        {cartdata.map((item, index) => {
          const productData = productList.find((p) => p._id === item._id);
          

          return (
            <div
              key={index}
              className="py-6 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-gray-50 transition"
            >
              {/* Product Image */}
              <div className="flex items-center gap-4 w-full sm:w-2/5">
                <img
                  src={productData.FrontImage}
                  alt={productData?.name}
                  className="w-20 h-20 object-contain rounded-xl border p-2 bg-white"
                />
                <div>
                  <p className="font-medium text-gray-800">{productData?.name}</p>
                  <p className="text-gray-500 text-sm">
                    {currency} {productData?.price}
                  </p>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="flex items-center gap-3">
                <p className="text-gray-700">Quantity:</p>
                <input
                  className="border rounded-lg w-16 text-center py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateCart(item._id, item.price, Number(e.target.value))
                  }
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                {/* Delete */}
                <img
                  className="w-5 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => dispatch(removeFromCart({ _id: item._id, price: item.price }))}
                  src={assets.deleteIcon}
                  alt="Delete"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Section */}
      <div className="flex justify-end my-10">
        <div className="w-full sm:w-[450px] bg-white shadow-lg rounded-2xl p-6">
          <CartTottal />
          <div className="w-full text-end">
            <button
              className="bg-black text-white text-sm sm:text-base font-medium my-6 px-8 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md"
              onClick={() => navigate("/place-order")}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carts;