import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../components/PageCss/signup.css";
import axios from "axios";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warnings, setWarnings] = useState({ mobile: "", email: "" });
  const [referralCode, setReferralCode] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Get referral from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref"); // Base64 code
    if (ref) {
      console.log("Referral code from URL:", ref); // Debug
      setReferralCode(ref);
    }
  }, [location]);

  let debounceTimeout;
  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func(...args), delay);
    };
  };

  const checkMobileExists = async (mobile) => {
    if (mobile.length < 10) {
      setWarnings((prev) => ({ ...prev, mobile: "" }));
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/check-mobile`, { mobile });
      setWarnings((prev) => ({
        ...prev,
        mobile: res.data.exists ? "⚠ Mobile already registered" : "",
      }));
    } catch (err) {
      setWarnings((prev) => ({ ...prev, mobile: "⚠ Error checking mobile" }));
    }
  };

  const checkEmailExists = async (email) => {
    if (!email.includes("@")) {
      setWarnings((prev) => ({ ...prev, email: "" }));
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/check-email`, { email });
      setWarnings((prev) => ({
        ...prev,
        email: res.data.exists ? "⚠ Email already registered" : "",
      }));
    } catch (err) {
      setWarnings((prev) => ({ ...prev, email: "⚠ Error checking email" }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "mobile") {
      debounce(() => checkMobileExists(e.target.value), 500)();
    }
    if (e.target.name === "email") {
      debounce(() => checkEmailExists(e.target.value), 500)();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || warnings.mobile || warnings.email) return;

    setIsSubmitting(true);

    try {
      const payload = { ...formData };
      if (referralCode) payload.ref = referralCode; // 🔹 send referral

      const res = await fetch(`${API_BASE_URL}/auth/createuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        login(data.authToken);
        alert("Signup Successful ✅");
        navigate("/dashboard");
      } else {
        alert(data.message || "Signup failed ❌");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">🎰 Join Betting & Win</h1>
        <p className="signup-subtitle">Sign up to play & win real cash every betting!</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="📝 Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            onChange={handleChange}
            required
          />
          {warnings.email && <p style={{ color: "red", fontSize: "14px" }}>{warnings.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="mobile"
            placeholder="📱 Mobile"
            onChange={handleChange}
            required
          />
          {warnings.mobile && <p style={{ color: "red", fontSize: "14px" }}>{warnings.mobile}</p>}

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="gender-select"
            required
          >
            <option value="">⚧ Select Gender</option>
            <option value="Male">♂ Male</option>
            <option value="Female">♀ Female</option>
            <option value="Other">⚧ Other</option>
          </select>

          <button
            type="submit"
            className={`signup-btn ${isSubmitting ? "btn-inactive" : ""}`}
            disabled={isSubmitting || warnings.mobile || warnings.email}
          >
            {isSubmitting ? "Please Wait..." : "Signup"}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="login-link">
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
