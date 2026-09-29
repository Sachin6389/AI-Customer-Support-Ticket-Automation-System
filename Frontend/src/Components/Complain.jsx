
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiFileText,
  FiRefreshCw,
  FiTrash2,
  FiChevronDown,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiUser,
} from "react-icons/fi";

const Complain = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  const backurl = import.meta.env.VITE_BACKEND_URL_COMPLAIN;
  
  

  // ============================================================
  // GET ALL COMPLAINTS
  // ============================================================

  const getComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${backurl}/get`);

      

      // Your Apiresponse contains data
      setComplaints(response.data?.data || []);
    } catch (error) {
      console.error("Get complaints error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch complaints"
      );

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UPDATE COMPLAINT STATUS
  // ============================================================

  const updateStatus = async (complainId, status) => {
    try {
      setUpdating(complainId);
      setError("");

      const response = await axios.patch(
        `${backurl}/update-status`,
        {
          complainId,
          status,
        }
      );

      

      // Update local state without fetching again
      setComplaints((prev) =>
        prev.map((item) =>
          item._id === complainId
            ? {
                ...item,
                status,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Update status error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update complaint status"
      );
    } finally {
      setUpdating(null);
    }
  };

  // ============================================================
  // DELETE COMPLAINT
  // ============================================================

  const deleteComplaint = async (complainId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(complainId);
      setError("");

      const response = await axios.delete(
        `${backurl}/delete`,
        {
          data: {
            complainId,
          },
        }
      );

      

      // Remove from UI
      setComplaints((prev) =>
        prev.filter((item) => item._id !== complainId)
      );
    } catch (error) {
      console.error("Delete complaint error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete complaint"
      );
    } finally {
      setDeleting(null);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    getComplaints();
  }, []);

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "escalated":
        return "bg-red-100 text-red-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      case "closed":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ============================================================
  // PRIORITY STYLE
  // ============================================================

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700";

      case "high":
        return "bg-orange-100 text-orange-700";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      case "low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <FiFileText size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Complaints
              </h1>

              <p className="text-sm text-gray-500">
                Manage customer complaints and support requests
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={getComplaints}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <FiAlertCircle size={20} />

          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-800">
            {complaints.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {
              complaints.filter(
                (item) => item.status === "pending"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Processing
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-600">
            {
              complaints.filter(
                (item) => item.status === "processing"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Escalated
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {
              complaints.filter(
                (item) => item.status === "escalated"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Resolved
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {
              complaints.filter(
                (item) => item.status === "resolved"
              ).length
            }
          </p>
        </div>
      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && complaints.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white shadow-sm">
          <div className="text-center">
            <FiRefreshCw
              size={30}
              className="mx-auto mb-3 animate-spin text-blue-600"
            />

            <p className="text-gray-500">
              Loading complaints...
            </p>
          </div>
        </div>
      ) : complaints.length === 0 ? (

        /* ====================================================
           EMPTY STATE
        ==================================================== */

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white shadow-sm">

          <FiCheckCircle
            size={45}
            className="mb-3 text-green-500"
          />

          <h2 className="text-lg font-semibold text-gray-700">
            No complaints found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            There are currently no customer complaints.
          </p>
        </div>

      ) : (

        /* ====================================================
           DESKTOP TABLE
        ==================================================== */

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="border-b bg-gray-50">
                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Complaint
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Priority
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Created
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {complaints.map((item) => (

                  <tr
                    key={item._id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* CUSTOMER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <FiUser size={18} />
                        </div>

                        <div>

                          <p className="font-medium text-gray-800">
                            {item.user?.fullName ||
                              item.user?.username ||
                              "Unknown User"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.user?.email || "No email"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* COMPLAINT */}

                    <td className="max-w-[350px] px-5 py-4">

                      <p className="line-clamp-3 text-sm text-gray-700">
                        {item.complain || "No complaint"}
                      </p>

                      {item.tokenId && (
                        <p className="mt-1 text-xs text-gray-400">
                          {item.tokenId}
                        </p>
                      )}

                    </td>

                    {/* PRIORITY */}

                    <td className="px-5 py-4">

                      {item.priority ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPriorityClass(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          N/A
                        </span>
                      )}

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <div className="relative inline-block">

                        <select
                          value={item.status || "pending"}
                          disabled={updating === item._id}
                          onChange={(e) =>
                            updateStatus(
                              item._id,
                              e.target.value
                            )
                          }
                          className={`appearance-none rounded-full border-0 py-2 pl-3 pr-8 text-xs font-medium capitalize outline-none focus:ring-2 focus:ring-blue-500 ${getStatusClass(
                            item.status
                          )} ${
                            updating === item._id
                              ? "cursor-wait opacity-60"
                              : "cursor-pointer"
                          }`}
                        >

                          <option value="pending">
                            Pending
                          </option>

                          <option value="processing">
                            Processing
                          </option>

                          <option value="escalated">
                            Escalated
                          </option>

                          <option value="resolved">
                            Resolved
                          </option>

                          <option value="closed">
                            Closed
                          </option>

                        </select>

                        <FiChevronDown
                          size={14}
                          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                        />

                      </div>

                    </td>

                    {/* CREATED */}

                    <td className="whitespace-nowrap px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-gray-600">

                        <FiClock size={15} />

                        {formatDate(item.createdAt)}

                      </div>

                    </td>

                    {/* DELETE */}

                    <td className="px-5 py-4 text-center">

                      <button
                        onClick={() =>
                          deleteComplaint(item._id)
                        }
                        disabled={deleting === item._id}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete complaint"
                      >

                        {deleting === item._id ? (
                          <FiRefreshCw
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <FiTrash2 size={18} />
                        )}

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
};

export default Complain;
