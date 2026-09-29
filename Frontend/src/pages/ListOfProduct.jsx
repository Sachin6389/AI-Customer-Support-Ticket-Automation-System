import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiEdit2,
  FiTrash2,
  FiDollarSign,
} from "react-icons/fi";

function ListOfProduct() {
  const navigate = useNavigate();

  const backurl = import.meta.env.VITE_BACKEND_URL_PRODUCT;
  

  const currency = "₹";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchList = async () => {
    setLoading(true);

    try {
      
     const res = await axios.get(`${backurl}/all-products`);
      console.log(res)

      if (res.data?.success) {
        const products = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        // Don't mutate API response with reverse()
        setList([...products].reverse());
      } else {
        setList([]);

        toast.error(
          res.data?.massage ||
            "Failed to fetch products"
        );
      }
    } catch (error) {
      console.log( error);

      toast.error(
        error?.response?.data?.massage ||
          error?.response?.data?.data ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const removeProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;
    console.log(productId)
    

    try {
      const res = await axios.delete(
        `${backurl}/delete`,
        {
         data: { productId },
        }
       
      );

      if (res.data?.success) {
        toast.success(
          res.data?.data ||
            "Product deleted successfully"
        );

        await fetchList();
      } else {
        toast.error(
          res.data?.massage ||
            "Failed to delete product"
        );
      }
    } catch (error) {
      console.log("Delete product error:", error);

      toast.error(
        error?.response?.data?.massage ||
          error?.response?.data?.data ||
          "Delete failed"
      );
    }
  };


  // =====================================================
  // FETCH ON LOAD
  // =====================================================

  useEffect(() => {
    fetchList();
  }, []);


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="admin-products-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-products-header">

        <div>

          <span className="dashboard-eyebrow">
            BUILDNEX ADMIN
          </span>

          <h1 className="dashboard-title">
            Products
          </h1>

          <p className="dashboard-subtitle">
            Manage your personalized printing and
            creative gift products.
          </p>

        </div>


        <div className="products-header-actions">

          <div className="products-count-badge">
            <FiPackage />

            <span>
              {list.length}{" "}
              {list.length === 1
                ? "Product"
                : "Products"}
            </span>
          </div>


          <button
            onClick={fetchList}
            disabled={loading}
            className="products-refresh-button"
          >
            <FiRefreshCw
              className={
                loading
                  ? "products-spin"
                  : ""
              }
            />

            Refresh
          </button>


          <button
            onClick={() => navigate("/add")}
            className="products-add-button"
          >
            <FiPlus />

            Add Product
          </button>

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="products-summary-grid">

        <div className="products-summary-card">

          <div className="products-summary-icon">
            <FiPackage />
          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {list.length}
            </strong>

          </div>

        </div>


        <div className="products-summary-card">

          <div className="products-summary-icon green">
            <FiPackage />
          </div>

          <div>

            <span>
              Available
            </span>

            <strong>
              {list.length}
            </strong>

          </div>

        </div>


        <div className="products-summary-card">

          <div className="products-summary-icon brown">
            <FiDollarSign />
          </div>

          <div>

            <span>
              Average Price
            </span>

            <strong>
              {list.length > 0
                ? `${currency}${Math.round(
                    list.reduce(
                      (total, item) =>
                        total +
                        Number(
                          item.price || 0
                        ),
                      0
                    ) / list.length
                  )}`
                : `${currency}0`}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          PRODUCT TABLE
      ================================================= */}

      <div className="products-table-card">

        {/* Table Header */}

        <div className="products-table-header">

          <div>
            <span className="products-table-eyebrow">
              STORE INVENTORY
            </span>

            <h2>
              Product Management
            </h2>
          </div>

          <span className="products-table-total">
            {list.length} items
          </span>

        </div>


        {/* Loading */}

        {loading && list.length === 0 ? (

          <div className="products-loading">

            <FiRefreshCw className="products-loading-icon" />

            <p>
              Loading products...
            </p>

          </div>

        ) : list.length > 0 ? (

          <div className="products-list">

            {list.map((item, index) => (

              <div
                key={item._id || index}
                className="product-row"
              >

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                <div className="product-image-wrapper">

                  {item.FrontImage ? (

                    <img
                      src={item.FrontImage}
                      alt={
                        item.name ||
                        "Product"
                      }
                      className="product-image"
                    />

                  ) : (

                    <div className="product-image-placeholder">
                      <FiPackage />
                    </div>

                  )}

                </div>


                {/* =================================================
                    PRODUCT DETAILS
                ================================================= */}

                <div className="product-main-info">

                  <span className="product-number">
                    PRODUCT #{index + 1}
                  </span>

                  <h3>
                    {item.name ||
                      "Unnamed Product"}
                  </h3>

                  <p>
                    {item.description ||
                      "No description available"}
                  </p>

                </div>


                {/* =================================================
                    COMPANY / CATEGORY
                ================================================= */}

                <div className="product-company">

                  <span className="product-field-label">
                    Category
                  </span>

                  <span className="product-company-value">
                    {item.companyName ||
                      "Buildnex"}
                  </span>

                </div>


                {/* =================================================
                    PRICE
                ================================================= */}

                <div className="product-price">

                  <span className="product-field-label">
                    Price
                  </span>

                  <strong>
                    {currency}
                    {Number(
                      item.price || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="product-actions">

                  <button
                    onClick={() =>
                      navigate(
                        "/update",
                        {
                          state: {
                            item,
                          },
                        }
                      )
                    }
                    className="product-update-button"
                  >
                    <FiEdit2 />

                    <span>
                      Update
                    </span>
                  </button>


                  <button
                    onClick={() =>
                      removeProduct(
                        item._id
                      )
                    }
                    className="product-delete-button"
                  >
                    <FiTrash2 />

                    <span>
                      Delete
                    </span>
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="products-empty">

            <div className="products-empty-icon">
              <FiPackage />
            </div>

            <h2>
              No Products Found
            </h2>

            <p>
              You haven't added any products
              to your Buildnex store yet.
            </p>

            <button
              onClick={() =>
                navigate("/add")
              }
              className="products-empty-button"
            >
              <FiPlus />

              Add Your First Product
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default ListOfProduct;