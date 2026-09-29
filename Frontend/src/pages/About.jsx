import React from "react";
import Tittle from "../components/Tittle.jsx";
import { Link } from "react-router-dom";
import { assets } from "../assets/Assets.js";

function About() {
  return (
    <div className="min-h-screen bg-cream text-text">

      {/* ================= ABOUT HEADER ================= */}
      <div className="border-t border-border px-4 pt-10 text-center sm:pt-12">
        <Tittle text1="ABOUT" text2="US" />

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          Turning your favorite moments into personalized
          products, thoughtful gifts, and beautiful memories.
        </p>
      </div>

      {/* ================= ABOUT INTRO ================= */}
      <div className="mx-auto my-12 flex max-w-7xl flex-col gap-10 px-4 sm:px-6 md:my-16 md:flex-row md:items-center lg:px-8 lg:gap-16">

        {/* Logo / Image */}
        <div className="w-full md:w-1/2">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <img
              className="mx-auto h-auto w-full max-w-[430px] object-contain"
              src={assets.logo}
              alt="Buildnex Personalized Printing and Creative Gifts"
            />

            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-accent" />
          </div>
        </div>

        {/* Content */}
        <div className="flex w-full flex-col gap-5 md:w-1/2">

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Our Story
            </span>

            <h2 className="mt-2 text-2xl font-bold text-brand-dark sm:text-3xl">
              Made personal. Made for you.
            </h2>
          </div>

          <p className="text-sm leading-7 text-muted sm:text-base">
            Buildnex was created with a simple idea — the things we
            give and keep should feel personal. We turn your favorite
            photos, memories, names, and messages into products that
            are made especially for you.
          </p>

          <p className="text-sm leading-7 text-muted sm:text-base">
            From beautiful photo prints and personalized frames to
            custom mugs, bottles, glass prints, and thoughtful gifts,
            we help you transform ordinary products into something
            meaningful.
          </p>

          <p className="text-sm leading-7 text-muted sm:text-base">
            Whether you're celebrating a birthday, anniversary,
            friendship, wedding, festival, or simply want to preserve
            a special moment, Buildnex is here to help you create
            something worth remembering.
          </p>

          {/* Mission */}
          <div className="mt-2 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <h3 className="text-lg font-bold text-brand-dark">
              Our Mission
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Our mission is to make personalized gifting simple,
              creative, and accessible. We focus on quality printing,
              thoughtful designs, careful packaging, and a smooth
              experience from customization to delivery.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link
              to="/products"
              className="
                inline-flex
                items-center
                justify-center
                rounded-lg
                bg-brand
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-brand-dark
                hover:shadow-md
              "
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </div>

      {/* ================= WHY BUILDNEX ================= */}
      <section className="border-y border-border bg-surface py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">
            <Tittle text1="WHY" text2="CHOOSE US" />

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
              We care about the details that make a personalized
              product feel truly special.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* Quality */}
            <div
              className="
                group
                rounded-xl
                border
                border-border
                bg-cream
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-brand
                hover:shadow-md
                sm:p-8
              "
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-light text-xl">
                ✨
              </div>

              <h3 className="text-lg font-bold text-brand-dark">
                Quality That Matters
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                We pay attention to print quality, colors, finishing,
                and product details so your memories look as beautiful
                in reality as they do on screen.
              </p>
            </div>

            {/* Personalization */}
            <div
              className="
                group
                rounded-xl
                border
                border-border
                bg-cream
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-brand
                hover:shadow-md
                sm:p-8
              "
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-light text-xl">
                🎁
              </div>

              <h3 className="text-lg font-bold text-brand-dark">
                Truly Personal
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                Your photo, your message, your style. Every
                personalized product is created to reflect the person
                and moment behind it.
              </p>
            </div>

            {/* Service */}
            <div
              className="
                group
                rounded-xl
                border
                border-border
                bg-cream
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-brand
                hover:shadow-md
                sm:p-8
              "
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-light text-xl">
                ❤️
              </div>

              <h3 className="text-lg font-bold text-brand-dark">
                Made With Care
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                From customization and printing to packaging and
                delivery, we aim to make every part of your Buildnex
                experience thoughtful and reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BRAND MESSAGE ================= */}
      <section className="bg-brand px-4 py-14 text-center sm:py-16">

        <div className="mx-auto max-w-3xl">

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-light">
            Buildnex
          </span>

          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Your memories deserve to be more than just memories.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Turn the moments you love into something you can see,
            hold, share, and gift.
          </p>

          <Link
            to="/products"
            className="
              mt-7
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
            "
          >
            Start Creating
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;