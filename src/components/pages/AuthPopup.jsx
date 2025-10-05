import React from "react";
import { useNavigate } from "react-router-dom";
import "../../components/PageCss/popup.css"

export default function AuthPopup({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup">
        <h2>🎰 Welcome to Spin & Win</h2>
        <p>Login or Signup to play & win real cash</p>

        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>

        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}
