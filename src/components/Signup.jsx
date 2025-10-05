import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../components/PageCss/signup.css";

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${apiUrl}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        login(data.authToken);
        alert("Signup Successful ✅");
        navigate("/dashboard");
      } else {
        alert(data.errors || "Signup failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Signup failed ❌");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">🎰 Join Spin & Win</h1>
        <p className="signup-subtitle">Sign up to play & win real cash every spin!</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <input type="text" name="name" placeholder="📝 Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="📧 Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="🔒 Password" onChange={handleChange} required />
          <input type="text" name="mobile" placeholder="📱 Mobile" onChange={handleChange} required />

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

          <button type="submit" className="signup-btn">Signup</button>
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
