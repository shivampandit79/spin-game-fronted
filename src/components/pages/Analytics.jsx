import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../components/PageCss/Analytics.css";

export default function Analytics() {
  const [referralLink, setReferralLink] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // 1️⃣ Get token from localStorage
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // 2️⃣ Fetch logged-in user from backend
    axios
      .get("/api/auth/getuser", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          const userId = res.data.user._id;
          const baseUrl = window.location.origin;
          setReferralLink(`${baseUrl}/referral/${userId}`);
          // optionally set totalReferrals and activeUsers from user data if available
          setTotalReferrals(res.data.user.totalReferrals || 0);
          setActiveUsers(res.data.user.activeUsers || 0);
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const copyLink = () => {
    if (!referralLink) return alert("Referral link not ready yet!");
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  return (
    <div className="referral-section">
      <div className="referral-container">
        {/* HEADER */}
        <div className="referral-header">
          <h1>Refer & Earn 🎰</h1>
          <p>Invite friends and earn rewards when they deposit!</p>
        </div>

        {/* REFERRAL LINK */}
        <div className="referral-link-box">
          <span>Your Referral Link</span>
          <div className="referral-input">
            <input type="text" value={referralLink} readOnly />
            <button className="copy-btn" onClick={copyLink}>Copy</button>
          </div>
        </div>

        {/* DATA CARDS */}
        <div className="referral-cards">
          <div className="card">
            <span>Total Referrals</span>
            <h2>{totalReferrals}</h2>
          </div>
          <div className="card">
            <span>Active Users</span>
            <h2>{activeUsers}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
