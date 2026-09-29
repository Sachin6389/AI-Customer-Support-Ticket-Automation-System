import React, { useState } from "react";
import { Input, Logo, CommonButton } from "../components/index.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function ChangedPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const userdata = useSelector((state) => state.auth.userdata);
  

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("⚠️ Please fill in all fields.");
    }

    if (newPassword.length < 6) {
      setMessage("🔒 Password must be at least 6 characters.");
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match.");
    }

    try {
      setLoading(true);
      setMessage("");
      

      // 🔧 Example API call (replace with your backend endpoint)
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL_LOGIN + "/changed-password",
        { oldPassword: oldPassword, NewPassword: newPassword },
        {
          headers: {
            Authorization: `Bearer ${userdata.accessToken}`,
          },
        }
      );
      
      
      setMessage("✅" + response.data.massage);
       setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      
        

      
      
      
    } catch (error) {
      setMessage("❌" + error.response.data.data );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Change Password
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <CommonButton
            type="submit"
            label={loading ? "Changing..." : "Change Password"}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300"
          >
            Change-Password{" "}
          </CommonButton>
        </form>

        {message && (
          <p
            className={`text-center mt-4 text-sm text- ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChangedPassword;