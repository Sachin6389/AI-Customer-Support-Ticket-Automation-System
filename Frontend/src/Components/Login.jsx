
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../Storage/User.js";
import { CommonButton, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";

function Login() {
  const backurl = import.meta.env.VITE_BACKEND_URL_LOGIN;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${backurl}/login`,
        data,
        {
          withCredentials: true,
        }
      );
      

      const userdata = response?.data?.data;

      if (userdata) {
        dispatch(authLogin(userdata));

        navigate("/Home", {
          replace: true,
        });
      } else {
        setError("Invalid login response.");
      }

    } catch (error) {
      console.log(error)
      setError(
        error?.response?.data?.data ||
        error?.response?.data?.message ||
        "Unable to login. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-cream flex items-center justify-center px-4 py-12">

      {/* Decorative background */}
      <div className="absolute top-24 left-10 w-40 h-40 rounded-full bg-accent-light/30 blur-3xl pointer-events-none" />

      <div className="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-white
          rounded-3xl
          p-7
          sm:p-9
          border
          border-border
          shadow-xl
        "
      >

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/Home">
            <Logo width="110px" />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            Welcome Back
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark">
            Sign in to Buildnex
          </h1>

          <p className="mt-3 text-sm text-muted">
            Access your personalized printing and gift orders.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(login)}
          className="mt-7"
        >

          <div className="space-y-5">

            {/* Email */}
            <div>
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: "Email is required",

                  pattern: {
                    value:
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      "Please enter a valid email address",
                  },
                })}
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">

              <Link
                to="/changed-password"
                className="
                  text-sm
                  font-medium
                  text-brand
                  hover:text-accent
                  transition-colors
                "
              >
                Forgot / Change Password?
              </Link>

            </div>

            {/* Login button */}
            <CommonButton
              type="submit"
              disabled={loading}
              className="
                w-full
                !bg-brand
                hover:!bg-brand-dark
                !text-white
                rounded-xl
                py-3
                font-semibold
                transition-all
                duration-200
                shadow-md
                hover:shadow-lg
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </CommonButton>

          </div>

        </form>

        {/* Signup */}
        <div className="mt-7 text-center">

          <p className="text-sm text-muted">
            Don't have an account?{" "}

            <Link
              to="/signup"
              className="
                font-semibold
                text-brand
                hover:text-accent
                transition-colors
              "
            >
              Create Account
            </Link>

          </p>

        </div>

        {/* Admin Login */}
        <div className="mt-7 pt-6 border-t border-border text-center">

          <p className="text-xs text-muted mb-2">
            Business administration
          </p>

          <Link
            to="/admin/login"
            className="
              inline-flex
              items-center
              justify-center
              text-sm
              font-semibold
              text-brand-dark
              hover:text-accent
              transition-colors
            "
          >
            Admin Login →
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;
