
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FiFileText,
  FiUploadCloud,
  FiTrash2,
  FiRefreshCw,
  FiFile,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

const Document = () => {
  const backurl = import.meta.env.VITE_BACKEND_URL_DOCUMENT;

  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // ALLOWED FILE TYPES
  // ============================================================

  const allowedExtensions = [
    ".pdf",
    ".txt",
    ".json",
    ".xlsx",
    ".csv",
    ".docx",
  ];

  // ============================================================
  // GET ALL DOCUMENTS
  // ============================================================

  const getDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${backurl}/get`
      );

      

      /*
        Expected response:

        {
          statusCode: 200,
          data: [
            {
              file_name: "faq.pdf",
              size: 12345,
              created_at: "..."
            }
          ],
          message: "Documents fetched successfully"
        }
      */

      setDocuments(response.data?.documents || []);
    } catch (error) {
      console.error("Get documents error:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to fetch documents"
      );

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SELECT FILE
  // ============================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const extension =
      "." +
      file.name
        .split(".")
        .pop()
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Unsupported file type. Allowed: PDF, TXT, JSON, XLSX, CSV and DOCX."
      );

      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size === 0) {
      setError("Selected file is empty.");

      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // ============================================================
  // UPLOAD DOCUMENT
  // ============================================================

  const uploadDocument = async () => {
    if (!selectedFile) {
      setError("Please select a document first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await axios.post(
        `${backurl}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      

      setSuccess(
        response.data?.message ||
          "Document uploaded successfully."
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh documents
      await getDocuments();
    } catch (error) {
      console.error("Upload document error:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to upload document"
      );
    } finally {
      setUploading(false);
    }
  };

  // ============================================================
  // DELETE DOCUMENT
  // ============================================================

  const deleteDocument = async (fileName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${fileName}"?`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(fileName);
      setError("");
      setSuccess("");

      /*
        FastAPI expects:

        DELETE /documents/delete?file_name=example.pdf

        because:

        async def delete_document_endpoint(
            file_name: str,
        )
      */

      const response = await axios.delete(
        `${backurl}/delete`,
        {
          params: {
            file_name: fileName,
          },
        }
      );

     

      setSuccess(
        response.data?.message ||
          "Document deleted successfully."
      );

      // Remove from UI immediately
      setDocuments((prev) =>
        prev.filter((document) => {
          const name =
            document.file_name ||
            document.name ||
            document.filename;

          return name !== fileName;
        })
      );
    } catch (error) {
      console.error("Delete document error:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to delete document"
      );
    } finally {
      setDeleting(null);
    }
  };

  // ============================================================
  // REMOVE SELECTED FILE
  // ============================================================

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
    setSuccess("");
  };

  // ============================================================
  // FORMAT FILE SIZE
  // ============================================================

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) {
      return "Unknown size";
    }

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(
      bytes / Math.pow(1024, index)
    ).toFixed(2)} ${units[index]}`;
  };

  // ============================================================
  // GET FILE EXTENSION
  // ============================================================

  const getFileExtension = (fileName) => {
    if (!fileName) return "";

    return (
      "." +
      fileName
        .split(".")
        .pop()
        .toUpperCase()
    );
  };

  // ============================================================
  // GET DOCUMENT NAME
  // ============================================================

  const getDocumentName = (document) => {
    return (
      document.file_name ||
      document.filename ||
      document.name ||
      document.fileName ||
      "Unknown document"
    );
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <FiFileText size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Documents
            </h1>

            <p className="text-sm text-gray-500">
              Upload and manage documents for your AI knowledge base
            </p>
          </div>

        </div>

        <button
          onClick={getDocuments}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
          />

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

          <div className="flex items-center gap-3">
            <FiAlertCircle size={20} />

            <p className="text-sm">
              {error}
            </p>
          </div>

          <button
            onClick={() => setError("")}
            className="rounded p-1 hover:bg-red-100"
          >
            <FiX />
          </button>

        </div>
      )}

      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {success && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">

          <div className="flex items-center gap-3">
            <FiCheckCircle size={20} />

            <p className="text-sm">
              {success}
            </p>
          </div>

          <button
            onClick={() => setSuccess("")}
            className="rounded p-1 hover:bg-green-100"
          >
            <FiX />
          </button>

        </div>
      )}

      {/* ======================================================
          UPLOAD SECTION
      ====================================================== */}

      <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-gray-800">
            Upload Document
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Upload a document to add it to the AI knowledge base.
          </p>

        </div>

        {/* DROP / SELECT AREA */}

        <label
          htmlFor="document-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-10 transition hover:border-blue-400 hover:bg-blue-50"
        >

          <div className="mb-3 rounded-full bg-blue-100 p-4 text-blue-600">
            <FiUploadCloud size={32} />
          </div>

          <p className="text-sm font-medium text-gray-700">
            Click to select a document
          </p>

          <p className="mt-1 text-xs text-gray-500">
            PDF, TXT, JSON, XLSX, CSV or DOCX
          </p>

          <input
            ref={fileInputRef}
            id="document-upload"
            type="file"
            accept=".pdf,.txt,.json,.xlsx,.csv,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

        </label>

        {/* SELECTED FILE */}

        {selectedFile && (
          <div className="mt-4 flex flex-col gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-3">

              <div className="rounded-lg bg-white p-3 text-blue-600">
                <FiFile size={22} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-medium text-gray-800">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {formatFileSize(
                    selectedFile.size
                  )}
                </p>

              </div>

            </div>

            <div className="flex gap-2">

              <button
                onClick={removeSelectedFile}
                disabled={uploading}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Remove
              </button>

              <button
                onClick={uploadDocument}
                disabled={uploading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {uploading ? (
                  <>
                    <FiRefreshCw
                      size={16}
                      className="animate-spin"
                    />

                    Processing...
                  </>
                ) : (
                  <>
                    <FiUploadCloud size={16} />

                    Upload
                  </>
                )}

              </button>

            </div>

          </div>
        )}

      </div>

      {/* ======================================================
          DOCUMENT LIST
      ====================================================== */}

      <div className="rounded-xl bg-white shadow-sm">

        {/* LIST HEADER */}

        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Uploaded Documents
            </h2>

            <p className="text-sm text-gray-500">
              {documents.length} document
              {documents.length !== 1 ? "s" : ""}
            </p>
          </div>

        </div>

        {/* LOADING */}

        {loading && documents.length === 0 && (
          <div className="flex min-h-[250px] flex-col items-center justify-center">

            <FiRefreshCw
              size={30}
              className="mb-3 animate-spin text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Loading documents...
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading && documents.length === 0 && (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">

            <div className="mb-3 rounded-full bg-gray-100 p-5 text-gray-400">
              <FiFileText size={35} />
            </div>

            <h3 className="font-medium text-gray-700">
              No documents found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Upload your first document to get started.
            </p>

          </div>
        )}

        {/* DOCUMENTS */}

        {documents.length > 0 && (
          <div className="divide-y divide-gray-100">

            {documents.map((document, index) => {

              const fileName =
                getDocumentName(document);

              return (
                <div
                  key={
                    document.id ||
                    document._id ||
                    fileName ||
                    index
                  }
                  className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >

                  {/* FILE INFO */}

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FiFileText size={23} />
                    </div>

                    <div className="min-w-0">

                      <p
                        className="truncate font-medium text-gray-800"
                        title={fileName}
                      >
                        {fileName}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">

                        <span className="rounded bg-gray-100 px-2 py-1 font-medium">
                          {getFileExtension(
                            fileName
                          )}
                        </span>

                        {document.size && (
                          <span>
                            {formatFileSize(
                              document.size
                            )}
                          </span>
                        )}

                        {document.chunks_created !==
                          undefined && (
                          <span>
                            {document.chunks_created} chunks
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      deleteDocument(fileName)
                    }
                    disabled={
                      deleting === fileName
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >

                    {deleting === fileName ? (
                      <>
                        <FiRefreshCw
                          size={16}
                          className="animate-spin"
                        />

                        Deleting...
                      </>
                    ) : (
                      <>
                        <FiTrash2 size={16} />

                        Delete
                      </>
                    )}

                  </button>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default Document;
