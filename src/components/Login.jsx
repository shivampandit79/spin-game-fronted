import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../components/PageCss/login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ from .env
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        login(data.authToken); // Save token
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed ❌");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🎰 Spin & Win</h1>
        <p className="login-subtitle">Login to start spinning and winning real cash!</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="📧 Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔒 Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} className="signup-link">
              Signup
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
