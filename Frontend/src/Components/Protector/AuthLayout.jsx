import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate()
  const location = useLocation()
  const authStatus = useSelector((state) => state.auth.status)
  const token = localStorage.getItem("accessToken")

  const [loader, setLoader] = useState(true)

  useEffect(() => {
    const isLoggedIn = authStatus || token

    // 🔒 Protected route
    if (authentication && !isLoggedIn) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname }
      })
    }

    // 🔓 Public route (login/signup)
    if (!authentication && isLoggedIn) {
      // ❗ Only redirect if user is already on login/signup
      navigate(location.state?.from || "/", { replace: true })
    }

    setLoader(false)
  }, [authentication, authStatus, token, navigate, location])

  if (loader) return <h1>Loading...</h1>

  return <>{children}</>
}

export default AuthLayout