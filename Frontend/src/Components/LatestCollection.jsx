import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ProductDisplay from "../components/ProductDisplay.jsx";
import Tittle from "../components/Tittle.jsx";

function LatestCollection() {
  const [latest, setLatest] = useState([]);

  const { productList = [], loading } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    setLatest(productList.slice(-10).reverse());
  }, [productList]);

  // Loading state
  if (loading) {
    return (
      <section className="my-12 bg-cream py-10">
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-border border-t-brand" />

            <p className="text-sm font-medium text-muted">
              Loading latest products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-10 bg-cream py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-8 text-center sm:mb-10">

          <Tittle
            text1="LATEST"
            text2="COLLECTIONS"
          />

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-xs
              leading-6
              text-muted
              sm:text-sm
              md:text-base
            "
          >
            Discover our newest personalized products,
            thoughtfully created to make your special
            moments memorable.
          </p>

          {/* Decorative line */}
          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="h-px w-10 bg-border" />
          </div>
        </div>

        {/* ================= PRODUCTS ================= */}
        {latest.length > 0 ? (
          <div
            className="
              grid
              grid-cols-2
              gap-x-4
              gap-y-8
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
            "
          >
            {latest.map((item, index) => (
              <ProductDisplay
                key={item._id || index}
                id={item._id}
                image={item.FrontImage}
                name={item.name}
                price={item.price}
                company={item.companyName}
              />
            ))}
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div
            className="
              flex
              min-h-[250px]
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-border
              bg-surface
            "
          >
            <div className="text-center">
              <div className="mb-3 text-4xl">
                🛍️
              </div>

              <h3 className="text-lg font-semibold text-brand-dark">
                No products available
              </h3>

              <p className="mt-2 text-sm text-muted">
                New products will appear here soon.
              </p>
            </div>
          </div>
        )}

        {/* ================= BOTTOM LABEL ================= */}
        {latest.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Freshly added to Buildnex
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestCollection;