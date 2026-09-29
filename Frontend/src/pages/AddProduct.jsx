import React, { useState } from "react";
import { assets } from "../assets/Assets.js";
import { toast } from "react-toastify";
import axios from "axios";

import {
  FiUpload,
  FiImage,
  FiPlus,
  FiLoader,
} from "react-icons/fi";

function AddProduct() {
  const backurl = import.meta.env.VITE_BACKEND_URL_PRODUCT;
  

  const [top, settop] = useState("");
  const [bottom, setbottom] = useState("");
  const [front, setfront] = useState("");
  const [back, setback] = useState("");

  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [description, setdescription] = useState("");
  const [quantity, setquantity] = useState("");
  const [unit,setunit]=useState("");  
  const [stock,setstock]=useState("");   
  const [Category,setCategory]=useState("");   
  const token=localStorage.getItem("token")
  

  const [loading, setLoading] = useState(false);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    settop("");
    setCategory("");
    setstock("");
    setunit("");
    setbottom("");
    setfront("");
    setback("");

    setname("");
    setprice("");
    setdescription("");
    setquantity("");
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const OnSubmitHandler = async (e) => {
    e.preventDefault();

   

    if (!name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter product description");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("top", top);
      formData.append("bottom", bottom);
      formData.append("front", front);
      formData.append("back", back);

      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("quantity", quantity);
      formData.append("stock",stock);
      formData.append("Category",Category)
      formData.append("unit",unit)
      

      const res = await axios.post(
        `${backurl}/add-product`,
        formData,
       
      );
      console.log(res)

      if (res.data?.success || res.data?.massage) {
        toast.success(
          res.data?.data ||
            res.data?.message ||
            "Product added successfully"
        );

        resetForm();
      } else {
        toast.error(
          res.data?.massage||
            "Failed to add product"
        );
      }

    } catch (error) {

      console.log("Add product error:", error);

      toast.error(
        error?.response?.data?.massage ||
          error?.response?.data?.data ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // IMAGE PREVIEW
  // =====================================================

  const getPreview = (file) => {
    if (!file) return assets.image;

    return URL.createObjectURL(file);
  };


  // =====================================================
  // IMAGE UPLOAD CARD
  // =====================================================

  const ImageUploadCard = ({
    id,
    title,
    file,
    setFile,
  }) => {
    return (
      <label
        htmlFor={id}
        className="admin-image-upload-card"
      >
        <div className="admin-image-preview">

          <img
            src={getPreview(file)}
            alt={`${title} preview`}
          />

          {!file && (
            <div className="admin-image-overlay">
              <FiUpload />
              <span>Upload</span>
            </div>
          )}

        </div>

        <div className="admin-image-info">

          <span>
            {title}
          </span>

          <small>
            {file
              ? file.name
              : "Click to upload"}
          </small>

        </div>

        <input
          id={id}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || ""
            )
          }
        />
      </label>
    );
  };


  return (
    <form
      className="admin-add-product-page"
      onSubmit={OnSubmitHandler}
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-add-header">

        <div>

          <span className="dashboard-eyebrow">
            BUILDNEX ADMIN
          </span>

          <h1 className="dashboard-title">
            Add Product
          </h1>

          <p className="dashboard-subtitle">
            Add a new personalized product to
            your Buildnex store.
          </p>

        </div>

        <div className="admin-add-badge">
          <FiPlus />
          New Product
        </div>

      </div>


      {/* =================================================
          IMAGE SECTION
      ================================================= */}

      <section className="admin-form-section">

        <div className="admin-form-section-header">

          <div className="admin-form-section-icon">
            <FiImage />
          </div>

          <div>

            <h2>
              Product Images
            </h2>

            <p>
              Upload product images from different
              angles.
            </p>

          </div>

        </div>


        <div className="admin-image-grid">

          <ImageUploadCard
            id="top"
            title="Top Image"
            file={top}
            setFile={settop}
          />

          <ImageUploadCard
            id="bottom"
            title="Bottom Image"
            file={bottom}
            setFile={setbottom}
          />

          <ImageUploadCard
            id="front"
            title="Front Image"
            file={front}
            setFile={setfront}
          />

          <ImageUploadCard
            id="back"
            title="Back Image"
            file={back}
            setFile={setback}
          />

        </div>

      </section>


      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <section className="admin-form-section">

        <div className="admin-form-section-header">

          <div className="admin-form-section-icon">
            <FiPlus />
          </div>

          <div>

            <h2>
              Product Information
            </h2>

            <p>
              Enter the basic information about
              your product.
            </p>

          </div>

        </div>


        <div className="admin-form-grid">

          {/* Product Name */}

          <div className="admin-form-field full">

            <label>
              Product Name
              <span>*</span>
            </label>

            <input
              type="text"
              placeholder="e.g. Personalized Photo Mug"
              value={name}
              onChange={(e) =>
                setname(e.target.value)
              }
              required
            />

          </div>


          {/* Description */}

          <div className="admin-form-field full">

            <label>
              Product Description
              <span>*</span>
            </label>

            <textarea
              placeholder="Write a short description about your product..."
              value={description}
              onChange={(e) =>
                setdescription(
                  e.target.value
                )
              }
              rows="5"
              required
            />

            <small>
              Describe the product, material,
              customization options, etc.
            </small>

          </div>


          {/* Price */}

          <div className="admin-form-field">

            <label>
              Price
              <span>*</span>
            </label>

            <div className="admin-price-input">

              <span>₹</span>

              <input
                type="number"
                min="0"
                step="1"
                placeholder="499"
                value={price}
                onChange={(e) =>
                  setprice(e.target.value)
                }
                required
              />

            </div>

          </div>


          {/* Company / Category */}

          <div className="admin-form-field">

            <label>
               Category
            </label>

            <input
              type="text"
              placeholder="e.g. Photo Frames"
              value={Category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            />

          </div>
           <div className="admin-form-field">

            <label>
               Quantity
            </label>

            <input
              type="number"
              placeholder="e.g. 1 "
              value={quantity}
              onChange={(e) =>
                setquantity(
                  e.target.value
                )
              }
            />



          </div>
           <div className="admin-form-field">

            <label>
               Unit
            </label>

            <input
              type="text"
              placeholder="e.g. centimetre, Meter, pcs, pack"
              value={unit}
              onChange={(e) =>
                setunit(
                  e.target.value
                )
              }
            />

          </div>

          <div className="admin-form-field">

            <label>
               Stock
            </label>

            <input
              type="number"
              placeholder="e.g. 100 or 1000"
              value={stock}
              onChange={(e) =>
                setstock(
                  e.target.value
                )
              }
            />

          </div>
          

        </div>

      </section>


      {/* =================================================
          FORM ACTIONS
      ================================================= */}

      <div className="admin-form-actions">

        <button
          type="button"
          onClick={resetForm}
          className="admin-reset-button"
          disabled={loading}
        >
          Clear Form
        </button>


        <button
          type="submit"
          className="admin-submit-button"
          disabled={loading}
        >

          {loading ? (
            <>
              <FiLoader className="admin-button-loader" />

              Adding Product...
            </>
          ) : (
            <>
              <FiPlus />

              Add Product
            </>
          )}

        </button>

      </div>

    </form>
  );
}

export default AddProduct;