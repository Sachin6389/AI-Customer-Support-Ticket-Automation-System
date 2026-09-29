import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function AdminLogin() {
   const backurl = import.meta.env.VITE_BACKEND_URL_LOGIN;

  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const OnSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${backurl}/adminlogin`,
        {
          email,
          password,
        }
      );
      

      if (res.data.success) {
         const settoken=res.data.data.Token
         localStorage.setItem("token",settoken)
        toast.success(res.data.massage);
        navigate("/Dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.massage ||
          "Admin login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cream px-4 flex items-center justify-center">

      {/* Admin Login Card */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">

        {/* Top Brand Bar */}
        <div className="h-1.5 w-full bg-brand" />

        <div className="px-6 py-8 sm:px-8 sm:py-10">

          {/* Admin Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-8 w-8 text-brand"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12a7.5 7.5 0 0 0-.15-1.5l1.15-.9-1.8-3.1-1.4.6a7.5 7.5 0 0 0-2.6-1.5L14.5 4h-5l-.2 1.6a7.5 7.5 0 0 0-2.6 1.5l-1.4-.6-1.8 3.1 1.15.9A7.5 7.5 0 0 0 4.5 12c0 .5.05 1 .15 1.5l-1.15.9 1.8 3.1 1.4-.6a7.5 7.5 0 0 0 2.6 1.5l.2 1.6h5l.2-1.6a7.5 7.5 0 0 0 2.6-1.5l1.4.6 1.8-3.1-1.15-.9c.1-.5.15-1 .15-1.5Z"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
              Admin Panel
            </h1>

            <p className="mt-2 text-sm text-muted">
              Sign in to manage your Buildnex store
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={OnSubmitHandler} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-brand-dark"
              >
                Email Address
              </label>

              <input
                id="admin-email"
                className="
                  w-full
                  rounded-lg
                  border
                  border-border
                  bg-cream
                  px-4
                  py-3
                  text-sm
                  text-text
                  outline-none
                  transition
                  placeholder:text-muted
                  focus:border-brand
                  focus:bg-surface
                  focus:ring-2
                  focus:ring-brand/10
                "
                type="email"
                placeholder="Enter your admin email"
                required
                onChange={(e) => setemail(e.target.value)}
                value={email}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-brand-dark"
              >
                Password
              </label>

              <input
                id="admin-password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-border
                  bg-cream
                  px-4
                  py-3
                  text-sm
                  text-text
                  outline-none
                  transition
                  placeholder:text-muted
                  focus:border-brand
                  focus:bg-surface
                  focus:ring-2
                  focus:ring-brand/10
                "
                type="password"
                placeholder="Enter your password"
                required
                onChange={(e) => setpassword(e.target.value)}
                value={password}
              />
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-lg
                  bg-brand
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-brand-dark
                  hover:shadow-md
                  focus:outline-none
                  focus:ring-2
                  focus:ring-brand/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? "Signing in..." : "Admin Login"}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 rounded-lg border border-border bg-cream px-4 py-3">
            <p className="text-center text-xs leading-5 text-muted">
              🔒 This area is restricted to authorized
              Buildnex administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;