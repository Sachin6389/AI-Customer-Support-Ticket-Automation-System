
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo.jsx";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cream border-t border-border">

      {/* Decorative background */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent-light/30 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* =========================
              BRAND
          ========================= */}
          <div className="sm:col-span-2 lg:col-span-1">

            <Link
              to="/Home"
              className="inline-flex items-center mb-5"
            >
              <Logo width="110px" />
            </Link>

            <p className="max-w-sm text-sm leading-6 text-muted">
              Turn your special memories into beautiful,
              personalized gifts. From custom mugs and
              photo frames to glass printing and more.
            </p>

            <p className="mt-5 text-sm font-medium text-brand">
              Personalized Printing & Creative Gifts
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">

              <a
                href="#"
                aria-label="Instagram"
                className="
                  w-9 h-9
                  rounded-full
                  bg-white
                  border border-border
                  flex items-center justify-center
                  text-brand
                  hover:bg-brand
                  hover:text-white
                  hover:border-brand
                  transition-all duration-200
                "
              >
                <span className="text-sm font-bold">IG</span>
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="
                  w-9 h-9
                  rounded-full
                  bg-white
                  border border-border
                  flex items-center justify-center
                  text-brand
                  hover:bg-brand
                  hover:text-white
                  hover:border-brand
                  transition-all duration-200
                "
              >
                <span className="text-sm font-bold">f</span>
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="
                  w-9 h-9
                  rounded-full
                  bg-white
                  border border-border
                  flex items-center justify-center
                  text-brand
                  hover:bg-brand
                  hover:text-white
                  hover:border-brand
                  transition-all duration-200
                "
              >
                <span className="text-xs font-bold">WA</span>
              </a>

            </div>

          </div>

          {/* =========================
              SHOP
          ========================= */}
          <div>

            <h3
              className="
                mb-5
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-brand
              "
            >
              Shop
            </h3>

            <ul className="space-y-3">

              <li>
                <Link
                  to="/products"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/custom-gifts"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Custom Gifts
                </Link>
              </li>

              <li>
                <Link
                  to="/photo-printing"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Photo Printing
                </Link>
              </li>

              <li>
                <Link
                  to="/mugs"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Custom Mugs
                </Link>
              </li>

              <li>
                <Link
                  to="/frames"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Photo Frames
                </Link>
              </li>

            </ul>

          </div>

          {/* =========================
              SUPPORT
          ========================= */}
          <div>

            <h3
              className="
                mb-5
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-brand
              "
            >
              Support
            </h3>

            <ul className="space-y-3">

              <li>
                <Link
                  to="/account"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  My Account
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Track Order
                </Link>
              </li>

              <li>
                <Link
                  to="/faq"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Help & FAQ
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/custom-order"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Custom Order
                </Link>
              </li>

            </ul>

          </div>

          {/* =========================
              LEGAL
          ========================= */}
          <div>

            <h3
              className="
                mb-5
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-brand
              "
            >
              Legal
            </h3>

            <ul className="space-y-3">

              <li>
                <Link
                  to="/terms"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/shipping-policy"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/refund-policy"
                  className="
                    text-sm
                    text-text
                    hover:text-brand
                    transition-colors
                  "
                >
                  Refund Policy
                </Link>
              </li>

            </ul>

          </div>

        </div>

        {/* =========================
            CONTACT STRIP
        ========================= */}
        <div
          className="
            border-t
            border-border
            py-6
            flex
            flex-col
            gap-3
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">

            <p className="text-sm text-muted">
              📞 Need help?{" "}
              <span className="font-medium text-brand">
                Contact us
              </span>
            </p>

            <p className="text-sm text-muted">
              ✉️ Custom orders available
            </p>

          </div>

          <p className="text-sm text-muted">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-brand">
              Buildnex
            </span>
            . All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
