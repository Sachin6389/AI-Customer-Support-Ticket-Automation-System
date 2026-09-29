
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function UpdateProduct() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.item;

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL_PRODUCT;
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    unit: "",
    quantity: "",
  });

  // Only contains NEWLY selected images
  const [images, setImages] = useState({
    top: null,
    bottom: null,
    front: null,
    back: null,
  });

  // Contains the images currently shown in the UI
  const [preview, setPreview] = useState({
    top: "",
    bottom: "",
    front: "",
    back: "",
  });

  const [loading, setLoading] = useState(false);

  /* ------------------ PRELOAD DATA ------------------ */
  useEffect(() => {
    if (!product) {
      toast.error("No product data found");
      navigate("/products");
      return;
    }

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      quantity: product.quantity || "",
      stock: product.stock || "",
      unit: product.unit || "",
    });

    setPreview({
      top: product.TopImage || "",
      bottom: product.BottomImage || "",
      front: product.FrontImage || "",
      back: product.BackImage || "",
    });

    // Reset newly selected images
    setImages({
      top: null,
      bottom: null,
      front: null,
      back: null,
    });
  }, [product, navigate]);

  /* ------------------ INPUT CHANGE ------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ------------------ IMAGE CHANGE ------------------ */
  const handleImageChange = (e) => {
    const { name, files } = e.target;

    const file = files?.[0];

    if (!file) {
      return;
    }

    // Store ONLY the newly selected image
    setImages((prev) => ({
      ...prev,
      [name]: file,
    }));

    // Create preview for newly selected image
    const imageUrl = URL.createObjectURL(file);

    setPreview((prev) => {
      // Revoke previous temporary preview if it was created by us
      if (prev[name]?.startsWith("blob:")) {
        URL.revokeObjectURL(prev[name]);
      }

      return {
        ...prev,
        [name]: imageUrl,
      };
    });
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product?._id) {
      toast.error("Product ID is missing");
      return;
    }

    if (!token) {
      toast.error("Admin authentication required");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // ---------------- PRODUCT ID ----------------
      data.append("productId", product._id);

      // ---------------- BASIC DETAILS ----------------
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("unit", formData.unit);
      data.append("category", formData.category);
      data.append("quantity", formData.quantity);

      // ------------------------------------------------
      // IMPORTANT:
      // Only append an image if the user selected
      // a NEW image.
      //
      // If image is null, backend receives no file
      // and should keep the existing image.
      // ------------------------------------------------

      if (images.top) {
        data.append("top", images.top);
      }

      if (images.bottom) {
        data.append("bottom", images.bottom);
      }

      if (images.front) {
        data.append("front", images.front);
      }

      if (images.back) {
        data.append("back", images.back);
      }

      const res = await axios.post(
        `${BACKEND_URL}/update`,
        data,
        {
          headers: {
            token: token,
          },
        }
      );

      console.log("Update product response:", res.data);

      if (
        res.data?.success ||
        res.data?.statusCode === 200 ||
        res.data?.statusCode === 201
      ) {
        toast.success(
          res.data?.message ||
            res.data?.massage ||
            "Product updated successfully"
        );

        navigate("/products");
      } else {
        toast.error(
          res.data?.message ||
            res.data?.massage ||
            "Product update failed"
        );
      }
    } catch (error) {
      console.error("Update product error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.massage ||
          error?.response?.data?.data ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ CLEANUP PREVIEW URLS ------------------ */
  useEffect(() => {
    return () => {
      Object.values(preview).forEach((url) => {
        if (url?.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-6">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">
        Update Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg bg-white p-6 shadow-md"
      >
        {/* ------------------ BASIC DETAILS ------------------ */}

        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          Product Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Product Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-md border px-4 py-2"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Unit
            </label>

            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full rounded-md border px-4 py-2"
              required
            />
          </div>
        </div>

        {/* ------------------ IMAGES ------------------ */}

        <h3 className="mt-10 mb-4 text-lg font-semibold text-gray-700">
          Product Images
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {[
            { key: "top", label: "Top Image" },
            { key: "bottom", label: "Bottom Image" },
            { key: "front", label: "Front Image" },
            { key: "back", label: "Back Image" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
              </label>

              <input
                type="file"
                name={key}
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />

              {preview[key] && (
                <img
                  src={preview[key]}
                  alt={label}
                  className="mt-3 h-40 w-full rounded-md border object-cover"
                />
              )}

              {/* Show whether a new image was selected */}
              {images[key] && (
                <p className="mt-1 text-xs text-green-600">
                  New image selected
                </p>
              )}

              {!images[key] && preview[key] && (
                <p className="mt-1 text-xs text-gray-500">
                  Existing image will be kept
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ------------------ ACTION BUTTONS ------------------ */}

        <div className="mt-10 flex gap-4">

          <button
            type="button"
            onClick={() => navigate("/products")}
            disabled={loading}
            className="w-full rounded-md bg-gray-300 px-6 py-3 font-semibold hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

        </div>
      </form>
    </div>
  );
}

export default UpdateProduct;

