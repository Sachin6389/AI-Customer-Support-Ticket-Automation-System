import React from "react";
import { Link } from "react-router-dom";

import {
  FiPackage,
  FiShoppingBag,
  FiPlusCircle,
  FiTrendingUp,
  FiUsers,
  FiFileText ,
  FiArrowUpRight,
  FiArrowRight,
  FiActivity,
} from "react-icons/fi";

function AdminDeshboard() {
  return (
    <div className="buildnex-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="dashboard-header">

        <div>
          <span className="dashboard-eyebrow">
            BUILDNEX ADMIN
          </span>

          <h1 className="dashboard-title">
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Welcome back. Here's what's happening with your
            Buildnex store today.
          </p>
        </div>

        <div className="dashboard-admin-badge">
          <span className="dashboard-status-dot"></span>

          <div>
            <span className="dashboard-admin-label">
              Admin Panel
            </span>

            <span className="dashboard-admin-status">
              Store Active
            </span>
          </div>
        </div>

      </div>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="dashboard-stats">

        {/* Products */}

        <div className="dashboard-stat-card">
          <Link to="/products">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon products">
              <FiPackage />
            </div>

            <span className="dashboard-stat-arrow">
              <FiArrowUpRight />
            </span>

          </div>

          <div className="dashboard-stat-content">

            <span className="dashboard-stat-label">
              Total Products
            </span>

            

            <span className="dashboard-stat-description">
              Products in your store
            </span>

          </div>
          </Link>

        </div>


        {/* Orders */}

        <div className="dashboard-stat-card">
          <Link to="/orderlist">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon orders">
              <FiShoppingBag />
            </div>

            <span className="dashboard-stat-arrow">
              <FiArrowUpRight />
            </span>

          </div>

          <div className="dashboard-stat-content">

            <span className="dashboard-stat-label">
              Total Orders
            </span>

            

            <span className="dashboard-stat-description">
              Orders received
            </span>

          </div>
          </Link>

        </div>


        {/* Customers */}
        
         


        <div className="dashboard-stat-card">
          <Link to="/complain">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon customers">
              <FiUsers />
            </div>

            <span className="dashboard-stat-arrow">
              <FiArrowUpRight />
            </span>

          </div>
          

          <div className="dashboard-stat-content">

            <span className="dashboard-stat-label">
              Complain
            </span>

           

            <span className="dashboard-stat-description">
              Registered complain
            </span>

          </div>
          
         </Link>

        </div>
        

        {/* Revenue */}

        <div className="dashboard-stat-card">
          <Link to="/Document-upload">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon revenue">
              <FiFileText />
            </div>

            <span className="dashboard-stat-arrow">
              <FiArrowUpRight />
            </span>

          </div>

          <div className="dashboard-stat-content">

            <span className="dashboard-stat-label">
              Document
            </span>

            <span className="dashboard-stat-description">
              Uploaded document
            </span>

          </div>
          </Link>

        </div>

      </div>


      {/* =====================================================
          MAIN DASHBOARD GRID
      ===================================================== */}

      <div className="dashboard-main-grid">

        {/* ===================================================
            WELCOME CARD
        =================================================== */}

        <div className="dashboard-welcome-card">

          <div className="dashboard-welcome-background"></div>

          <div className="dashboard-welcome-content">

            <span className="dashboard-welcome-small">
              PERSONALIZED • CREATIVE • BUILDNEX
            </span>

            <h2>
              Turn memories into
              <br />
              something special.
            </h2>

            <p>
              Manage your personalized printing products,
              customer orders and store activity from one
              simple dashboard.
            </p>

            <Link
              to="/products"
              className="dashboard-welcome-button"
            >
              Manage Products

              <FiArrowRight />

            </Link>

          </div>

          <div className="dashboard-welcome-icon">
            <FiTrendingUp />
          </div>

        </div>


        {/* ===================================================
            STORE STATUS
        =================================================== */}

        <div className="dashboard-status-card">

          <div className="dashboard-card-header">

            <div>
              <span className="dashboard-card-eyebrow">
                STORE
              </span>

              <h2>
                Store Status
              </h2>
            </div>

            <div className="dashboard-live-badge">
              <span></span>
              Live
            </div>

          </div>


          <div className="dashboard-store-status">

            <div className="dashboard-store-icon">
              <FiActivity />
            </div>

            <div>

              <h3>
                Everything is running
              </h3>

              <p>
                Your Buildnex store is ready to
                receive customer orders.
              </p>

            </div>

          </div>


          <div className="dashboard-status-list">

            <div className="dashboard-status-item">

              <div>
                <span className="status-indicator"></span>
                Products
              </div>

              <strong>
                Active
              </strong>

            </div>


            <div className="dashboard-status-item">

              <div>
                <span className="status-indicator"></span>
                Orders
              </div>

              <strong>
                Active
              </strong>

            </div>


            <div className="dashboard-status-item">

              <div>
                <span className="status-indicator"></span>
                Admin Panel
              </div>

              <strong>
                Secure
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="dashboard-section">

        <div className="dashboard-section-header">

          <div>
            <span className="dashboard-card-eyebrow">
              MANAGEMENT
            </span>

            <h2>
              Quick Actions
            </h2>

            <p>
              Manage your store from one place.
            </p>
          </div>

        </div>


        <div className="dashboard-actions-grid">

          {/* Add Product */}

          <Link
            to="/add"
            className="dashboard-action-card"
          >

            <div className="dashboard-action-icon">
              <FiPlusCircle />
            </div>

            <div className="dashboard-action-content">

              <h3>
                Add Product
              </h3>

              <p>
                Add a new personalized product
                to your store.
              </p>

            </div>

            <FiArrowRight className="dashboard-action-arrow" />

          </Link>


          {/* Products */}

          <Link
            to="/products"
            className="dashboard-action-card"
          >

            <div className="dashboard-action-icon">
              <FiPackage />
            </div>

            <div className="dashboard-action-content">

              <h3>
                Manage Products
              </h3>

              <p>
                View, update and manage
                your products.
              </p>

            </div>

            <FiArrowRight className="dashboard-action-arrow" />

          </Link>


          {/* Orders */}

          <Link
            to="/orderlist"
            className="dashboard-action-card"
          >

            <div className="dashboard-action-icon">
              <FiShoppingBag />
            </div>

            <div className="dashboard-action-content">

              <h3>
                Manage Orders
              </h3>

              <p>
                Check and manage customer
                orders.
              </p>

            </div>

            <FiArrowRight className="dashboard-action-arrow" />

          </Link>

        </div>

      </div>


      {/* =====================================================
          BOTTOM BRAND MESSAGE
      ===================================================== */}

      <div className="dashboard-brand-footer">

        <div className="dashboard-brand-mark">
          B
        </div>

        <div>

          <h3>
            Buildnex
          </h3>

          <p>
            Personalized Printing & Creative Gifts
          </p>

        </div>

        <span className="dashboard-brand-line"></span>

        <span className="dashboard-brand-text">
          Build. Personalize. Celebrate.
        </span>

      </div>

    </div>
  );
}

export default AdminDeshboard;