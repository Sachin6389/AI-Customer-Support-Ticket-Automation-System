import React from "react";
import { NavLink } from "react-router-dom";
import { Assest } from "../assets/Assest.js";

function Sidebar() {
  return (
    <aside className="w-[18%] min-h-screen border-r bg-white">
      <nav className="flex flex-col gap-3 pt-6 px-4 text-sm">

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl border transition
             ${
               isActive
                 ? "bg-green-600 text-white border-green-600"
                 : "border-gray-300 hover:bg-green-100"
             }`
          }
        >
          <img
            src={Assest.add}
            alt="Add"
            className="h-5 w-5 object-contain"
          />
          <span className="hidden md:block">Add Item</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl border transition
             ${
               isActive
                 ? "bg-green-600 text-white border-green-600"
                 : "border-gray-300 hover:bg-green-100"
             }`
          }
        >
          <img
            src={Assest.list}
            alt="List"
            className="h-5 w-5 object-contain"
          />
          <span className="hidden md:block">List Items</span>
        </NavLink>

        <NavLink
          to="/order"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-2 rounded-xl border transition
             ${
               isActive
                 ? "bg-green-600 text-white border-green-600"
                 : "border-gray-300 hover:bg-green-100"
             }`
          }
        >
          <img
            src={Assest.order}
            alt="Order"
            className="h-5 w-5 object-contain"
          />
          <span className="hidden md:block">Orders</span>
        </NavLink>

      </nav>
    </aside>
  );
}

export default Sidebar;