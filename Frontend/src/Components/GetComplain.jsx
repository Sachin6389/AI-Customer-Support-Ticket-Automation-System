
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { useSelector } from "react-redux";

const GetComplain = () => {
  const userData = useSelector((state) => state.auth.userdata);
  
  const userId=userData?.user?._id
  
 

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL_COMPLAIN;

  // ============================================================
  // GET USER COMPLAINTS
  // ============================================================

  const getUserComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${backendUrl}/get-user-complain`,
          {
            params: {
          userId: userId,
                    },
           }
      );

      

      setComplaints(response.data?.data || []);
    } catch (error) {
      console.error(
        "Get complaints error:",
        error.response?.data || error.message
      );

      // Backend returns 404 when user has no complaints
      if (error.response?.status === 404) {
        setComplaints([]);
        setError("");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to fetch your complaints"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD COMPLAINTS
  // ============================================================

  useEffect(() => {
    if (userData?.accessToken) {
      getUserComplaints();
    }
  }, [userData?.accessToken]);

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          className:
            "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: <FiClock />,
        };

      case "processing":
        return {
          className:
            "bg-blue-100 text-blue-700 border-blue-200",
          icon: <FiRefreshCw />,
        };

      case "escalated":
        return {
          className:
            "bg-red-100 text-red-700 border-red-200",
          icon: <FiAlertCircle />,
        };

      case "resolved":
        return {
          className:
            "bg-green-100 text-green-700 border-green-200",
          icon: <FiCheckCircle />,
        };

      case "closed":
        return {
          className:
            "bg-gray-100 text-gray-700 border-gray-200",
          icon: <FiCheckCircle />,
        };

      default:
        return {
          className:
            "bg-gray-100 text-gray-700 border-gray-200",
          icon: <FiClock />,
        };
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <FiRefreshCw className="animate-spin text-xl" />
          <span>Loading your complaints...</span>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
        <FiAlertCircle className="text-4xl text-red-500" />

        <p className="text-center text-red-600">
          {error}
        </p>

        <button
          onClick={getUserComplaints}
          className="flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <FiRefreshCw />
          Try Again
        </button>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <FiMessageSquare />
            My Complaints
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and track your complaints
          </p>
        </div>

        <button
          onClick={getUserComplaints}
          className="flex w-fit items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-800">
            {complaints.length}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
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

        {/* Processing */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
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

        {/* Resolved */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Resolved
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {
              complaints.filter(
                (item) =>
                  item.status === "resolved" ||
                  item.status === "closed"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Empty State */}
      {complaints.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-white p-8 text-center">
          <FiMessageSquare className="mb-4 text-5xl text-gray-300" />

          <h2 className="text-lg font-semibold text-gray-700">
            No complaints found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            You have not submitted any complaints yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => {
            const status = getStatusStyle(
              complaint.status
            );

            return (
              <div
                key={complaint._id}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* Complaint Header */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs text-gray-400">
                      Complaint ID
                    </p>

                    <p className="font-mono text-sm text-gray-700">
                      {complaint._id}
                    </p>
                  </div>

                  <span
                    className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium capitalize ${status.className}`}
                  >
                    {status.icon}
                    {complaint.status || "pending"}
                  </span>
                </div>

                {/* Complaint Text */}
                <div className="mt-4">
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    Complaint
                  </p>

                  <p className="rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                    {complaint.complain}
                  </p>
                </div>

                {/* Complaint Information */}
                <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-gray-400">
                      Created
                    </p>

                    <p className="text-sm text-gray-700">
                      {complaint.createdAt
                        ? new Date(
                            complaint.createdAt
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Priority
                    </p>

                    <p className="text-sm font-medium capitalize text-gray-700">
                      {complaint.priority || "Normal"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Escalated
                    </p>

                    <p className="text-sm text-gray-700">
                      {complaint.escalatedToHuman
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>

                  {complaint.tokenId && (
                    <div>
                      <p className="text-xs text-gray-400">
                        Support Token
                      </p>

                      <p className="font-mono text-sm font-medium text-gray-700">
                        {complaint.tokenId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reason */}
                {complaint.reason && (
                  <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
                    <p className="text-xs font-medium text-red-500">
                      Support Reason
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {complaint.reason}
                    </p>
                  </div>
                )}

                {/* Escalated At */}
                {complaint.escalatedAt && (
                  <div className="mt-3 text-xs text-gray-500">
                    Escalated on{" "}
                    {new Date(
                      complaint.escalatedAt
                    ).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GetComplain;
