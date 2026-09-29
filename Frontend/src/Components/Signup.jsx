import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../Storage/User.js";
import { CommonButton, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";

function Signup() {
  const backurl = import.meta.env.VITE_BACKEND_URL_LOGIN;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const CreateAc = async (data) => {
    setError("");
    setLoading(true);

    try {
      const avatarFile = data.avatar?.[0];

      if (!avatarFile) {
        setError("Please upload your profile image");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("avatar", avatarFile);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("PinCode", data.PinCode);
      formData.append("City", data.City);
      formData.append("State", data.State);

      const session = await axios.post(
        `${backurl}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      

      if (session.data.success) {
        const userdata = session.data.massage;

        dispatch(login(userdata));

        navigate("/Home", {
          replace: true,
        });
      }
    } catch (error) {
      console.log(error)
    
      setError(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Signup Card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          
          {/* Top Accent */}
          <div className="h-1.5 w-full bg-brand" />

          <div className="p-6 sm:p-8 md:p-10">
            
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <Link
                to="/"
                className="inline-block w-[110px] transition-transform duration-200 hover:scale-105"
              >
                <Logo width="100%" />
              </Link>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-muted sm:text-base">
                Join Buildnex and start creating something personal.
              </p>

              <p className="mt-4 text-sm text-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-brand transition-colors duration-200 hover:text-accent"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit(CreateAc)}
              className="mt-8"
            >
              <div className="space-y-5">

                {/* Profile Image */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-brand-dark">
                    Profile Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="
                      block
                      w-full
                      cursor-pointer
                      rounded-lg
                      border
                      border-border
                      bg-cream
                      px-4
                      py-3
                      text-sm
                      text-text
                      file:mr-4
                      file:rounded-md
                      file:border-0
                      file:bg-brand
                      file:px-4
                      file:py-2
                      file:text-sm
                      file:font-semibold
                      file:text-white
                      hover:file:bg-brand-dark
                      focus:outline-none
                      focus:ring-2
                      focus:ring-accent/30
                    "
                    {...register("avatar", {
                      required: true,
                    })}
                  />

                  <p className="mt-1.5 text-xs text-muted">
                    Upload a JPG, PNG or WEBP image.
                  </p>
                </div>

                {/* Full Name */}
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...register("fullName", {
                    required: true,
                  })}
                />

                {/* Email */}
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  {...register("email", {
                    required: true,
                    validate: {
                      matchPattern: (value) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                        "Please enter a valid email address",
                    },
                  })}
                />

                {/* Password */}
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  {...register("password", {
                    required: true,
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />

                {/* Phone */}
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...register("phone", {
                    required: true,
                  })}
                />

                {/* Address */}
                <Input
                  label="Address"
                  type="text"
                  placeholder="Enter your address"
                  {...register("address", {
                    required: true,
                  })}
                />

                {/* Pin Code */}
                <Input
                  label="Pin Code"
                  type="text"
                  placeholder="Enter your pin code"
                  {...register("PinCode", {
                    required: true,
                  })}
                />

                {/* City */}
                <Input
                  label="City"
                  type="text"
                  placeholder="Enter your city"
                  {...register("City", {
                    required: true,
                  })}
                />

                {/* State */}
                <Input
                  label="State"
                  type="text"
                  placeholder="Enter your state"
                  {...register("State", {
                    required: true,
                  })}
                />

                {/* Submit */}
                <div className="pt-3">
                  <CommonButton
                    type="submit"
                    disabled={loading}
                    className="
                      !w-full
                      !rounded-lg
                      !bg-brand
                      !py-3
                      !text-white
                      font-semibold
                      shadow-sm
                      transition-all
                      duration-200
                      hover:!bg-brand-dark
                      hover:shadow-md
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </CommonButton>
                </div>
              </div>
            </form>

            {/* Bottom Text */}
            <div className="mt-6 border-t border-border pt-5 text-center">
              <p className="text-xs leading-relaxed text-muted">
                By creating an account, you agree to our{" "}
                <Link
                  to="/terms"
                  className="font-medium text-brand hover:text-accent"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-brand hover:text-accent"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <p className="mt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Buildnex — Personalized Printing &
          Creative Gifts
        </p>
      </div>
    </div>
  );
}

export default Signup;