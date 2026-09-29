import React from "react";
import Tittle from "../components/Tittle.jsx";
import { Link } from "react-router-dom";
import { assets } from "../assets/Assets.js";

function Contact() {
  return (
    <div className="min-h-screen bg-cream text-text">

      {/* ================= HEADER ================= */}
      <div className="border-t border-border px-4 pt-10 text-center sm:pt-12">
        <Tittle text1="CONTACT" text2="US" />

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          Have a question about a personalized product, custom order,
          delivery, or anything else? We’re here to help.
        </p>
      </div>

      {/* ================= CONTACT SECTION ================= */}
      <div
        className="
          mx-auto
          my-12
          grid
          max-w-7xl
          grid-cols-1
          gap-8
          px-4
          sm:px-6
          md:my-16
          lg:grid-cols-2
          lg:px-8
        "
      >

        {/* ================= MAP ================= */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

          <div className="relative">
            <img
              className="
                h-[300px]
                w-full
                object-cover
                sm:h-[400px]
                lg:h-[470px]
              "
              src={assets.map}
              alt="Buildnex store location map"
            />

            {/* Map Overlay */}
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-md backdrop-blur-sm">
              <p className="text-sm font-bold text-brand-dark">
                Buildnex
              </p>

              <p className="mt-1 text-xs text-muted">
                Personalized Printing & Creative Gifts
              </p>
            </div>
          </div>

          {/* Google Maps Button */}
          <div className="p-5">
            <a
              href="https://maps.app.goo.gl/R1ZrtaQ8kbVkrTWA9"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-lg
                bg-brand
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-brand-dark
                hover:shadow-md
              "
            >
              View Location on Google Maps
            </a>
          </div>
        </div>

        {/* ================= CONTACT DETAILS ================= */}
        <div className="flex flex-col justify-center">

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:p-10">

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Get In Touch
            </span>

            <h2 className="mt-2 text-2xl font-bold text-brand-dark sm:text-3xl">
              We’d love to hear from you
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
              Whether you want to personalize a product, place a custom
              order, ask about an existing order, or simply have a
              question, feel free to reach out.
            </p>

            {/* Store */}
            <div className="mt-8 space-y-6">

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-light text-lg">
                  📍
                </div>

                <div>
                  <h3 className="font-semibold text-brand-dark">
                    Our Store
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    Chhavani, Lalganj
                    <br />
                    Dist-Azamgarh, Uttar Pradesh
                    <br />
                    PIN - 276202
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-light text-lg">
                  📞
                </div>

                <div>
                  <h3 className="font-semibold text-brand-dark">
                    Phone
                  </h3>

                  <a
                    href="tel:+916280261117"
                    className="mt-1 block text-sm text-muted transition hover:text-brand"
                  >
                    +91 6280261117
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-light text-lg">
                  ✉️
                </div>

                <div>
                  <h3 className="font-semibold text-brand-dark">
                    Email
                  </h3>

                  <a
                    href="mailto:HimanshuComputerLalganj@gmail.com"
                    className="mt-1 block break-all text-sm text-muted transition hover:text-brand"
                  >
                    HimanshuComputerLalganj@gmail.com
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-light text-lg">
                  🌐
                </div>

                <div>
                  <h3 className="font-semibold text-brand-dark">
                    Website
                  </h3>

                  <Link
                    to="/"
                    className="mt-1 block text-sm text-muted transition hover:text-brand"
                  >
                    Buildnex
                  </Link>
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-light text-lg">
                  💬
                </div>

                <div>
                  <h3 className="font-semibold text-brand-dark">
                    Social Media
                  </h3>

                  <p className="mt-1 text-sm text-muted">
                    Follow Buildnex for new products,
                    offers, and creative gift ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CUSTOM ORDER CTA ================= */}
      <section className="bg-brand px-4 py-12 text-center sm:py-14">
        <div className="mx-auto max-w-3xl">

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-light">
            Custom Orders
          </span>

          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Have something special in mind?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
            Tell us what you want to create and we’ll help turn
            your idea, photo, or message into a personalized product.
          </p>

          <Link
            to="/custom-order"
            className="
              mt-6
              inline-flex
              rounded-lg
              bg-accent
              px-7
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-[#A96132]
              hover:shadow-lg
            "
          >
            Request a Custom Order
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Contact;