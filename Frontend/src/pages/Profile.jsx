import React, { useState, useEffect } from "react";
import { Logo, CommonButton } from "../components/index.js";
import { assets } from "../assets/Assets.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Profile() {
  const[image,setimage]=useState({})
  const userData = useSelector((state) => state.auth.userdata);
  
  
  useEffect(() => {
    if (userData && userData.user) {
      setimage(userData.user);
    }
  }, [userData]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-white px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="relative bg-cream  h-36 sm:h-40 flex flex-col px-4 py-4 text-white  ">
          <Logo />
        </div>

        {/* Profile Content */}
        <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-10 pb-10">
          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={image.avatar || assets.user}
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>

          {/* Name + Join Info */}
          <div className="text-center mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              { image.fullName || "your Name: " }
            </h2>
          </div>

          {/* Profile Details */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 sm:p-6 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-gray-800 font-medium break-words">
                 { image.email || "NA" }
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 sm:p-6 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="text-gray-800 font-medium">{ image.phone || "NA" }</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 sm:p-6 sm:col-span-2 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="text-gray-800 font-medium leading-relaxed">
                 { image.address ? `${image.address}, ${image.City} - ${image.PinCode}, ${image.State}` : "NA" }
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-gray-200"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link to="/EditProfile">
              <CommonButton
                label="Edit Profile"
                className="bg-green-500 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg font-medium shadow-md transition text-sm sm:text-base"
              >
                Edit-Profile
              </CommonButton>
            </Link>
            <Link to="/changed-password">
              <CommonButton
                label="Change Password"
                className="bg-green-500 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg font-medium shadow-md transition text-sm sm:text-base"
              >
                {" "}
                Change-Password
              </CommonButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;