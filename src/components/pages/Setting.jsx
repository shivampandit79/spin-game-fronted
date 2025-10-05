import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../PageCss/Setting.css";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function Setting() {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    vipLevel: 1,
    walletBalance: 0,
  });

  // 🔹 Environment variable for API base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resUser = await fetch(`${API_BASE_URL}/auth/getuser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const userDataRes = await resUser.json();

        if (userDataRes.success && userDataRes.user) {
          const { name, email, mobile, vipLevel } = userDataRes.user;

          const resWallet = await fetch(`${API_BASE_URL}/wallet/balance`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });

          const walletData = await resWallet.json();

          setUserData({
            name,
            email,
            mobile,
            vipLevel: vipLevel || 1,
            walletBalance: walletData.success ? walletData.balance : 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user or wallet data:", error);
      }
    };

    fetchUserData();
  }, [authToken, API_BASE_URL]);

  const showCustomMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage(""); // Remove message after 2 sec
    }, 2000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      showCustomMessage("⚠️ Please enter both old and new passwords", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        showCustomMessage("✅ Password changed successfully!", "success");
        setShowPasswordPopup(false);
        setOldPassword("");
        setNewPassword("");
      } else {
        showCustomMessage(data.error || "❌ Password change failed", "error");
      }
    } catch (error) {
      console.error("Password change error:", error);
      showCustomMessage("❌ Error changing password", "error");
    }
  };

  return (
    <div className="profile-container">
      {message && (
        <div className={`custom-message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="profile-card">
        <div className="wallet-balance">💰 ₹{userData.walletBalance}</div>

        <div className="profile-header">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="User Avatar"
            className="profile-avatar"
          />
          <h2 className="profile-name">{userData.name}</h2>
          <p className="profile-email">{userData.email}</p>
          <p className="profile-phone">📱 {userData.mobile}</p>
        </div>

        <div className="vip-level">
          <span>🔥 VIP Level:</span>
          <div className="vip-bar">
            <div
              className="vip-progress"
              style={{ width: `${userData.vipLevel * 10}%` }}
            ></div>
          </div>
          <small>Level {userData.vipLevel} — Keep Playing to Level Up!</small>
        </div>

        <div className="profile-options">
          <button
            className="profile-btn"
            onClick={() => setShowPasswordPopup(true)}
          >
            🔄 Change Password
          </button>
          <button
            className="profile-btn"
            onClick={() => navigate("/deposit")}
          >
            💰 Deposit History
          </button>
          <button
            className="profile-btn"
            onClick={() => navigate("/user")}
          >
            📤 Spin History
          </button>
          <button className="profile-btn">🏆 View VIP Ranking</button>
        </div>
      </div>

      {showPasswordPopup && (
        <div className="password-popup">
          <div className="popup-content">
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="popup-buttons">
                <button type="submit" className="profile-btn">Change</button>
                <button
                  type="button"
                  className="profile-btn"
                  onClick={() => setShowPasswordPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
