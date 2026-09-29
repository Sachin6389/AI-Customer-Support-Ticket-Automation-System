
import React, { useState } from "react";
import { Container, Logo, Logout } from "../index.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { assets } from "../../assets/Assets.js";
import { showsearchStatus } from "../../Storage/Product.js";

function Header() {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);
  const cart = useSelector((state) => state.product.cart || []);

  const userData = useSelector((state) => state.auth.userdata);
  const user = userData?.user || null;

  // --------------------------------------------------
  // USER NAME
  // --------------------------------------------------
  const userName =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "User";

  // --------------------------------------------------
  // CREATE INITIALS
  // Example:
  // Sachin Gond -> SG
  // Sachin -> S
  // --------------------------------------------------
  const getInitials = (name) => {
    if (!name) return "U";

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(userName);

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------
  const navItems = [
    {
      name: "Home",
      slug: "/Home",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "Contact",
      slug: "/contact",
      active: true,
    },
    {
      name: "About",
      slug: "/about",
      active: true,
    },
    {
      name: "Complain",
      slug: "/user-complain",
      active: true,
    },

    
  ];

  // --------------------------------------------------
  // FALLBACK AVATAR
  // --------------------------------------------------
  const NameAvatar = ({ mobile = false }) => {
    return (
      <div
        className={`
          ${
            mobile
              ? "w-11 h-11 text-sm"
              : "w-11 h-11"
          }
          rounded-full
          bg-gradient-to-br
          from-brand
          to-brand-dark
          text-white
          flex
          items-center
          justify-center
          font-semibold
          tracking-wide
          border-2
          border-accent-light
          shadow-md
          select-none
        `}
        title={userName}
      >
        {initials}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-border shadow-sm">

      <Container>

        {/* =========================
            NAVBAR
        ========================= */}
        <nav className="flex items-center justify-between py-3">

          {/* =========================
              LOGO
          ========================= */}
          <Link
            to="/Home"
            className="flex items-center shrink-0"
          >
            <Logo width="75px" />
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================= */}
          <ul className="hidden md:flex items-center gap-1">

            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() =>
                        navigate(item.slug)
                      }
                      className="
                        px-4
                        py-2
                        rounded-full
                        text-brand-dark
                        font-medium
                        hover:bg-accent-light/60
                        hover:text-brand
                        transition-all
                        duration-200
                      "
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {authStatus && (
              <li className="ml-2">
                <Logout />
              </li>
            )}
          </ul>

          {/* =========================
              RIGHT SECTION
          ========================= */}
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <button
              type="button"
              onClick={() =>
                dispatch(showsearchStatus(true))
              }
              className="
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-accent-light/50
                transition-all
                duration-200
              "
              aria-label="Search"
            >
              <img
                src={assets.search}
                className="w-6 h-6 object-contain"
                alt="Search"
              />
            </button>

            {/* =========================
                USER AVATAR
            ========================= */}
            <div className="relative group hidden md:block">

              {authStatus ? (
                user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="
                      w-11
                      h-11
                      rounded-full
                      object-cover
                      border-2
                      border-accent-light
                      shadow-md
                      cursor-pointer
                      hover:scale-105
                      transition-transform
                      duration-200
                    "
                    alt={userName}
                    title={userName}
                  />
                ) : (
                  <NameAvatar />
                )
              ) : (
                <img
                  src={assets.user}
                  className="
                    w-11
                    h-11
                    rounded-full
                    object-cover
                    border-2
                    border-accent-light
                    shadow-md
                    cursor-pointer
                  "
                  alt="User"
                />
              )}

              {/* USER DROPDOWN */}
              {authStatus && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    mt-3
                    w-52
                    bg-white
                    border
                    border-border
                    rounded-2xl
                    shadow-xl
                    overflow-hidden
                    opacity-0
                    invisible
                    translate-y-2
                    group-hover:opacity-100
                    group-hover:visible
                    group-hover:translate-y-0
                    transition-all
                    duration-200
                  "
                >

                  {/* User information */}
                  <div className="px-4 py-4 bg-cream border-b border-border">

                    <div className="flex items-center gap-3">

                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          className="
                            w-10
                            h-10
                            rounded-full
                            object-cover
                          "
                          alt={userName}
                        />
                      ) : (
                        <NameAvatar mobile />
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-brand-dark truncate">
                          {userName}
                        </p>

                        {user?.email && (
                          <p className="text-xs text-muted truncate">
                            {user.email}
                          </p>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="
                      flex
                      items-center
                      px-4
                      py-3
                      text-text
                      hover:bg-cream
                      hover:text-brand
                      transition-colors
                    "
                  >
                    My Profile
                  </Link>

                  {/* Orders */}
                  <Link
                    to="/orders"
                    className="
                      flex
                      items-center
                      px-4
                      py-3
                      text-text
                      hover:bg-cream
                      hover:text-brand
                      transition-colors
                    "
                  >
                    Orders
                  </Link>

                </div>
              )}
            </div>

            {/* =========================
                CART
            ========================= */}
            <Link
              to="/cart"
              className="
                relative
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-accent-light/50
                transition-all
                duration-200
              "
            >
              <img
                src={assets.Cart}
                className="w-7 h-7 object-contain"
                alt="Cart"
              />

              {cart.length > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    bg-accent
                    text-white
                    text-[10px]
                    font-bold
                    rounded-full
                    min-w-5
                    h-5
                    px-1
                    flex
                    items-center
                    justify-center
                    border-2
                    border-cream
                  "
                >
                  {cart.length}
                </span>
              )}
            </Link>

            {/* =========================
                MOBILE MENU BUTTON
            ========================= */}
            <button
              type="button"
              className="
                md:hidden
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-accent-light/50
                transition-colors
              "
              onClick={() => setVisible(true)}
              aria-label="Open menu"
            >
              <img
                className="w-6 h-6 object-contain"
                src={assets.menu}
                alt="Menu"
              />
            </button>

          </div>
        </nav>

        {/* =========================
            MOBILE MENU
        ========================= */}
        <div
          className={`
            fixed
            top-0
            right-0
            bottom-0
            bg-cream
            text-text
            shadow-2xl
            border-l
            border-border
            transition-all
            duration-300
            z-[60]

            ${
              visible
                ? "w-[82%] sm:w-[360px] p-6"
                : "w-0 overflow-hidden p-0"
            }
          `}
        >

          {visible && (
            <div className="flex flex-col h-full">

              {/* MOBILE HEADER */}
              <div className="flex items-center justify-between pb-5 border-b border-border">

                <Link
                  to="/Home"
                  onClick={() => setVisible(false)}
                >
                  <Logo width="70px" />
                </Link>

                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-accent-light
                    text-brand-dark
                    flex
                    items-center
                    justify-center
                    font-bold
                    hover:bg-accent
                    hover:text-white
                    transition-colors
                  "
                >
                  ✕
                </button>

              </div>

              {/* USER INFO */}
              {authStatus && (
                <div className="flex items-center gap-3 py-5 border-b border-border">

                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      className="
                        w-12
                        h-12
                        rounded-full
                        object-cover
                        border-2
                        border-accent-light
                      "
                      alt={userName}
                    />
                  ) : (
                    <NameAvatar mobile />
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-brand-dark truncate">
                      {userName}
                    </p>

                    {user?.email && (
                      <p className="text-xs text-muted truncate">
                        {user.email}
                      </p>
                    )}
                  </div>

                </div>
              )}

              {/* MOBILE NAVIGATION */}
              <div className="flex flex-col gap-2 mt-5">

                {navItems.map(
                  (item) =>
                    item.active && (
                      <NavLink
                        key={item.name}
                        onClick={() =>
                          setVisible(false)
                        }
                        to={item.slug}
                        className={({ isActive }) =>
                          `
                          py-3
                          px-4
                          rounded-xl
                          font-medium
                          transition-all

                          ${
                            isActive
                              ? "bg-brand text-white"
                              : "text-brand-dark hover:bg-accent-light/60 hover:text-brand"
                          }
                        `
                        }
                      >
                        {item.name}
                      </NavLink>
                    )
                )}

                {/* CART */}
                <NavLink
                  onClick={() => setVisible(false)}
                  to="/cart"
                  className="
                    py-3
                    px-4
                    rounded-xl
                    font-medium
                    text-brand-dark
                    hover:bg-accent-light/60
                    hover:text-brand
                    transition-colors
                  "
                >
                  Cart
                  {cart.length > 0 && (
                    <span className="ml-2 text-accent font-bold">
                      ({cart.length})
                    </span>
                  )}
                </NavLink>

                {/* USER LINKS */}
                {authStatus && (
                  <>
                    <Link
                      onClick={() =>
                        setVisible(false)
                      }
                      to="/profile"
                      className="
                        py-3
                        px-4
                        rounded-xl
                        font-medium
                        text-brand-dark
                        hover:bg-accent-light/60
                        hover:text-brand
                        transition-colors
                      "
                    >
                      My Profile
                    </Link>

                    <Link
                      onClick={() =>
                        setVisible(false)
                      }
                      to="/orders"
                      className="
                        py-3
                        px-4
                        rounded-xl
                        font-medium
                        text-brand-dark
                        hover:bg-accent-light/60
                        hover:text-brand
                        transition-colors
                      "
                    >
                      Orders
                    </Link>

                    <div className="pt-3 border-t border-border mt-2">
                      <Logout />
                    </div>
                  </>
                )}

              </div>

              {/* MOBILE FOOTER */}
              <div className="mt-auto pt-6 text-center">

                <p className="text-xs text-muted">
                  Personalized Printing & Creative Gifts
                </p>

                <p className="text-sm font-semibold text-brand mt-1">
                  Buildnex
                </p>

              </div>

            </div>
          )}

        </div>

      </Container>
    </header>
  );
}

export default Header;
