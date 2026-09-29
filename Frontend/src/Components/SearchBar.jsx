import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/Assets.js";
import { searchItem } from "../Storage/Product.js";
import { showsearchStatus } from "../Storage/Product.js";
import { Navigate } from "react-router-dom";


function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const showsearch = useSelector((state) => state.product.showsearch);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/")) {
      setVisible(true);
    }
  }, [location]);

 useEffect(() => {
  dispatch(searchItem(search));

  if (search.trim() !== "") {
    navigate("/Home");
  }
}, [search, dispatch, navigate]);

 

  return showsearch && visible ? (
    <div className="w-full flex justify-center mt-4 px-4">
      <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-2/5 flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
        {/* Search Icon */}
        <img
          src={assets.search}
          alt="Search"
          className="w-5 h-5 ml-4 opacity-60"
        />

        {/* Input */}
        <input
          type="text"
          placeholder="Search for products..."
          className="flex-1 px-3 py-2 text-sm md:text-base text-gray-700 bg-transparent outline-none placeholder-gray-400"
          value={search}
          onChange={(e) =>setSearch(e.target.value)  }
        />

        {/* Cross Icon */}
        <img
          src={assets.cross}
          alt="Close"
          className="w-4 h-4 mr-4 cursor-pointer opacity-60 hover:opacity-100 transition-all duration-200"
          onClick={() => dispatch(showsearchStatus(false)) }
        />
      </div>
    </div>
  ) : null;
}

export default SearchBar;