import React, { useEffect, useState } from "react";
import { Logo, CommonButton, Input } from "../Components/index.js";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../Storage/User.js";
import axios from "axios";

function EditProfile() {
  const userdata = useSelector((state) => state.auth.userdata);

  const dispatch = useDispatch();

  const [user, setUser] = useState({
    fullName: userdata?.user?.fullName,
    email: userdata?.user?.email,
    phone: userdata?.user?.phone,
    address: userdata?.user?.address,
    City: userdata?.user?.City,
    State: userdata?.user?.State,
    PinCode: userdata?.user?.PinCode,
    avatar: userdata?.user?.avatar,
  });

  const [previewImage, setPreviewImage] = useState(
    userdata?.user?.avatar || ""
  );
  const [message, setMessage] = useState("");

  const resizeImage = (file, maxSize = 500, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => (img.src = e.target.result);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        const ratio = Math.min(maxSize / width, maxSize / height, 1);
        width *= ratio;
        height *= ratio;

        canvas.width = width;
        canvas.height = height;

        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(
              new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
            );
          },
          "image/jpeg",
          quality
        );
      };

      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // resize image (optional but recommended)
      const resizedFile = await resizeImage(file, 500, 500, 0.7);

      setPreviewImage(URL.createObjectURL(resizedFile));

      const formData = new FormData();
      formData.append("avatar", resizedFile); // 🔥 name MUST match multer

       const response = await axios.patch(
        import.meta.env.VITE_BACKEND_URL_LOGIN + "/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userdata.accessToken}`,
          },
        }
      );
      const updatedUser = response.data.massage;

      dispatch(login(updatedUser));

      setMessage("✅ Avatar updated successfully");
    } catch (err) {
      console.error(err);
      setMessage( "❌ Avatar upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      /* ---------- UPDATE PROFILE DATA ---------- */

      const response = await axios.patch(
        import.meta.env.VITE_BACKEND_URL_LOGIN + "/updated-account",
        {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          City: user.City,
          State: user.State,
          PinCode: user.PinCode,
        },
        {
          headers: {
            Authorization: `Bearer ${userdata.accessToken}`,
          },
        }
      );
      const updatedUser = response.data.massage;

      dispatch(login(updatedUser));

      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.data || "❌ Update failed  ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
        {/* HEADER */}
        <div className="relative h-44 bg-cream  px-8 flex items-center">
          <Logo />
          <h1 className="ml-5 text-2xl font-bold text-black tracking-wide ">
            Edit Profile
          </h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="relative px-8 md:px-12 pb-12 -mt-20"
        >
          {/* PROFILE IMAGE */}
          <div className="flex justify-center mb-10">
            <div className="relative group">
              <img
                src={previewImage}
                alt="profile"
                className="w-36 h-36 rounded-full border-[6px] border-white shadow-2xl object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <label
                htmlFor="profilePic"
                className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-1.5 rounded-full cursor-pointer shadow-lg transition"
              >
                Change
              </label>

              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StyledInput
              label="Full Name"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
            />
            <StyledInput
              label="Email"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            <StyledInput
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
            <StyledInput
              label="City"
              name="City"
              value={user.City}
              onChange={handleChange}
            />
            <StyledInput
              label="State"
              name="State"
              value={user.State}
              onChange={handleChange}
            />
            <StyledInput
              label="Pin Code"
              name="PinCode"
              value={user.PinCode}
              onChange={handleChange}
            />
          </div>

          {/* ADDRESS */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleChange}
              rows="4"
              placeholder="Enter your address"
              className="w-full rounded-xl border border-gray-300 bg-white/70 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-10">
            <CommonButton
              type="submit"
              label="Save Changes"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:shadow-xl transition-all duration-300 text-white py-3 px-10 rounded-2xl font-semibold tracking-wide"
            >
              Save Changes
            </CommonButton>
          </div>

          {message && (
            <p className="text-center text-green-600 font-semibold mt-4">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* 🔥 Reusable Styled Input */
function StyledInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <Input
        {...props}
        className="w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
      />
    </div>
  );
}

export default EditProfile;