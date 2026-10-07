
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";

function Chatboat() {
  // ============================================================
  // API
  // ============================================================

  const API = (import.meta.env.VITE_BACKEND_URL_AI || "").replace(/\/$/, "");

  // ============================================================
  // AUTH USER FROM REDUX
  // ============================================================

  const userdata = useSelector((state) => state.auth.userdata);

  // Logged-in user's MongoDB _id
  const userId = userdata?.user?._id;

  // ============================================================
  // SESSION ID
  // ============================================================

  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Create a user-specific storage key
    const storageKey = `chat_session_id_${userId}`;

    // Check existing session
    let storedSessionId = localStorage.getItem(storageKey);

    // Create new session if it doesn't exist
    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();

      localStorage.setItem(
        storageKey,
        storedSessionId
      );
    }

    setSessionId(storedSessionId);

    
  }, [userId]);
  

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I'm your Advanced AI Agent System. How can I help you today?",
    },
  ]);

  // ============================================================
  // LOADING
  // ============================================================

  const [loading, setLoading] = useState(false);

  

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  async function sendMessage(text) {
    const cleanText = text?.trim();

    // Do not send empty messages
    if (!cleanText || loading) {
      return;
    }

    // ----------------------------------------------------------
    // Check authenticated user
    // ----------------------------------------------------------

    if (!userId) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ User information is not available. Please login again.",
        },
      ]);

      return;
    }

    // ----------------------------------------------------------
    // Check session
    // ----------------------------------------------------------

    if (!sessionId) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Chat session is not ready. Please refresh the page.",
        },
      ]);

      return;
    }

    // ----------------------------------------------------------
    // Add user message to UI
    // ----------------------------------------------------------

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: cleanText,
      },
    ]);

    setLoading(true);

    try {
      // --------------------------------------------------------
      // SEND REQUEST TO BACKEND
      // --------------------------------------------------------

      const response = await axios.post(
        `${API}/chat`,
        {
          user_id: userId,
          session_id: sessionId,
          message: cleanText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      const data = response.data;
      console.log("Chat response:", response);

      // --------------------------------------------------------
      // NORMAL ANSWER
      // --------------------------------------------------------

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.response,
          },
        ]);
      }

      // --------------------------------------------------------
      // WORKFLOW ERRORS
      // --------------------------------------------------------

      if (
        Array.isArray(data.errors) &&
        data.errors.length > 0
      ) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `⚠️ ${
              data.errors[data.errors.length - 1]
            }`,
          },
        ]);
      }
    } catch (error) {
      // --------------------------------------------------------
      // API ERROR
      // --------------------------------------------------------

      console.error("Chat API error:", error);

      let errorMessage =
        "❌ Unable to connect to server.";

      // FastAPI HTTPException response
      if (error.response?.data?.detail) {
        errorMessage =
          `❌ ${error.response.data.detail}`;
      }

      // Backend returned an error message
      else if (error.response?.data?.message) {
        errorMessage =
          `❌ ${error.response.data.message}`;
      }

      // Network error
      else if (
        error.request &&
        !error.response
      ) {
        errorMessage =
          "❌ Backend server is not reachable.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // USER NOT LOADED
  // ============================================================

  if (!userId) {
    return (
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl overflow-hidden">
        <div className="bg-blue-900 text-white text-center py-5 text-2xl font-bold">
          Advanced AI Agent System
        </div>

        <div className="h-[500px] flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">
            Please login to use the AI Agent.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        bg-white
        shadow-2xl
        rounded-2xl
        w-full
        max-w-3xl
        overflow-hidden
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          bg-blue-900
          text-white
          text-center
          py-5
          text-2xl
          font-bold
        "
      >
        Advanced AI Agent System
      </div>

      {/* ======================================================
          CHAT AREA
      ====================================================== */}

      <div
        className="
          h-[500px]
          w-full
          overflow-y-auto
          p-6
          bg-gray-50
        "
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            userId={userId}
          />
        ))}

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <Message
            message={{
              sender: "bot",
              text: "🤔 Thinking...",
            }}
          />
        )}


      </div>

      {/* ======================================================
          INPUT
      ====================================================== */}

      <ChatInput
        sendMessage={sendMessage}
        loading={loading}
      />
    </div>
  );
}

export default Chatboat;
