import React, { useState, useEffect } from "react";
import "../../components/PageCss/Analytics.css";

export default function Analytics() {
  const baseUrl = window.location.origin; // automatically detect current domain
  const userId = "12345"; // dynamically replace with logged-in user later
  const [referralLink] = useState(`${baseUrl}/?ref=${userId}`); // ✅ FIXED

  const [totalReferrals, setTotalReferrals] = useState(5);
  const [activeUsers, setActiveUsers] = useState(3);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  return (
    <div className="referral-section">
      <div className="referral-container">
        <div className="referral-header">
          <h1>Refer & Earn 🎰</h1>
          <p>Invite friends and earn rewards when they deposit!</p>
        </div>

        <div className="referral-link-box">
          <span>Your Referral Link</span>
          <div className="referral-input">
            <input type="text" value={referralLink} readOnly />
            <button className="copy-btn" onClick={copyLink}>Copy</button>
          </div>
        </div>

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
import React, { useState, useEffect } from "react";
import "../../components/PageCss/Analytics.css";

export default function Analytics() {
  const [referralLink, setReferralLink] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(5);
  const [activeUsers, setActiveUsers] = useState(3);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || "guest"; // agar login nahi hua hai to guest
    const baseUrl = window.location.origin; // automatically current live link lega
    setReferralLink(`${baseUrl}/?ref=${userId}`);
  }, []);

  const copyLink = () => {
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
