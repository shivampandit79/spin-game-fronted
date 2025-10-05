import React, { useState, useEffect } from "react";
import "../../components/PageCss/Analytics.css";

export default function Analytics() {
  const [referralLink] = useState("http://spinking.com/referral/12345");
  const [totalReferrals, setTotalReferrals] = useState(5);
  const [activeUsers, setActiveUsers] = useState(3);

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
