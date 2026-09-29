import React, { useEffect, useState } from "react";
import { assets } from "../assets/Assets.js";
import { useSelector, useDispatch } from "react-redux";
import Tittle from "../components/Tittle.jsx";
import ProductDisplay from "../components/ProductDisplay.jsx";
import { fetchProducts } from "../Storage/Product.js";
import Chatboat from "../Components/AI-Component/Chatboat.jsx";

function Collection() {
  const dispatch = useDispatch();

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const {
    productList: product = [],
    loading,
    error,
  } = useSelector((state) => state.product);

  const searchshow = useSelector((state) => state.product.showsearch);
  const search = useSelector((state) => state.product.search);

  const [filter, setFilter] = useState(false);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Update filter list whenever products change
  useEffect(() => {
    setFilterProduct(product);
  }, [product]);

  // Category toggle function
  const toggleCategory = (e) => {
    const value = e.target.value;

    if (category.includes(value)) {
      setCategory((prev) =>
        prev.filter((item) => item !== value)
      );
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  // Apply filters
  const Apply = () => {
    let productCopy = [...product];

    // Search filter
    if (searchshow && search) {
      productCopy = productCopy.filter((item) =>
        item.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(
          item.companyName?.toLowerCase()
        )
      );
    }

    setFilterProduct(productCopy);
  };

  // Sort products
  const SortByPrice = () => {
    let sortedCopy = [...filterProduct];

    switch (sortType) {
      case "low-high":
        sortedCopy.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        sortedCopy.sort((a, b) => b.price - a.price);
        break;

      default:
        Apply();
        return;
    }

    setFilterProduct(sortedCopy);
  };

  // Re-run Apply when filters/search change
  useEffect(() => {
    Apply();
  }, [category, search, searchshow]);

  // Re-run sorting when sort changes
  useEffect(() => {
    SortByPrice();
  }, [sortType]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-border border-t-brand" />

          <p className="text-sm font-medium text-muted">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-[60vh] bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="mb-3 text-3xl">⚠️</div>

          <h2 className="text-lg font-semibold text-red-600">
            Unable to load products
          </h2>

          <p className="mt-2 text-sm text-muted">
            {error}
          </p>

          <button
            onClick={() => dispatch(fetchProducts())}
            className="
              mt-5
              rounded-lg
              bg-brand
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-brand-dark
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-10 lg:px-2">

          {/* ================= LEFT FILTER ================= */}
          <aside className="w-full lg:w-90 lg:shrink-0 ">
            <Chatboat/>
           
          </aside>

          {/* ================= RIGHT CONTENT ================= */}
          <main className="min-w-0 flex-1">

            {/* Top Bar */}
            <div
              className="
                mb-6
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              {/* Title */}
              <div>
                <Tittle
                  text1={"ALL"}
                  text2={"COLLECTION"}
                />

                <p className="mt-1 text-xs text-muted sm:text-sm">
                  Explore our personalized products
                </p>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortType}
                  onChange={(e) =>
                    setSortType(e.target.value)
                  }
                  className="
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-lg
                    border
                    border-border
                    bg-surface
                    px-4
                    py-2.5
                    pr-10
                    text-sm
                    font-medium
                    text-brand-dark
                    outline-none
                    transition
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand/10
                    sm:w-auto
                  "
                >
                  <option value="relevant">
                    Relevant
                  </option>

                  <option value="low-high">
                    Price: Low to High
                  </option>

                  <option value="high-low">
                    Price: High to Low
                  </option>
                </select>

                {/* Dropdown Icon */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  ▾
                </span>
              </div>
            </div>

            {/* Product Count */}
            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
              <p className="text-sm text-muted">
                Showing{" "}
                <span className="font-semibold text-brand-dark">
                  {filterProduct.length}
                </span>{" "}
                products
              </p>

              {category.length > 0 && (
                <button
                  onClick={() => setCategory([])}
                  className="
                    text-xs
                    font-semibold
                    text-accent
                    transition
                    hover:text-brand
                  "
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Product Grid */}
            {filterProduct.length > 0 ? (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-x-4
                  gap-y-8
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                "
              >
                {filterProduct.map((item, index) => (
                  <ProductDisplay
                    key={item._id || index}
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.FrontImage}
                    company={item.companyName}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div
                className="
                  flex
                  min-h-[350px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-border
                  bg-surface
                  px-6
                "
              >
                <div className="text-center">
                  <div className="mb-4 text-4xl">
                    🛍️
                  </div>

                  <h3 className="text-lg font-semibold text-brand-dark">
                    No products found
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-muted">
                    Try changing your search or removing
                    some filters to see more products.
                  </p>

                  {(category.length > 0 ||
                    search) && (
                    <button
                      onClick={() => {
                        setCategory([]);
                        setFilterProduct(product);
                      }}
                      className="
                        mt-5
                        rounded-lg
                        bg-brand
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-brand-dark
                      "
                    >
                      View All Products
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Collection;