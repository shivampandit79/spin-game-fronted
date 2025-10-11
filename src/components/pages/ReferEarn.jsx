import React, { useState, useEffect } from "react";
import { FiCopy, FiUserPlus, FiGift } from "react-icons/fi";
import "../../components/PageCss/ReferEarn.css"; 

export default function ReferEarn() {
  const [referralLink, setReferralLink] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Ensure this is set in Vercel env

  // ✅ Function to generate short referral code
  const generateReferralCode = (userId) => {
    try {
      return btoa(userId); // Base64 encode userId
    } catch (err) {
      console.error("Error encoding referral code:", err);
      return "";
    }
  };

  // ✅ Fetch user info
  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setReferralLink("Login to get your referral link");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/getuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check HTTP response
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.user?._id) {
        const referralCode = generateReferralCode(data.user._id);
        const safeOrigin = window.location.origin;
        setReferralLink(`${safeOrigin}/?ref=${referralCode}`);

        setTotalReferrals(data.user.totalReferrals || 0);

        // 🔹 Count active users (example: users who deposited)
        let activeCount = 0;
        if (data.user.referrals && Array.isArray(data.user.referrals)) {
          activeCount = data.user.referrals.filter(u => u.isActive).length;
        }
        setActiveUsers(activeCount);
      } else {
        setReferralLink("Error fetching link");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setReferralLink("Error fetching link");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [API_URL]);

  const copyLink = () => {
    if (!referralLink || referralLink.includes("Error")) {
      return alert("Referral link not ready!");
    }
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  return (
    <div className="refer-container">
      <div className="refer-card">
        <h1>🎰 Refer & Earn</h1>
        <p>Invite your friends and earn rewards when they deposit!</p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="referral-box">
              <input type="text" value={referralLink} readOnly />
              <button onClick={copyLink}><FiCopy /> Copy</button>
            </div>

            <div className="stats">
              <div className="stat-card">
                <FiUserPlus className="icon" />
                <span>Total Referrals</span>
                <h2>{totalReferrals}</h2>
              </div>
              <div className="stat-card">
                <FiGift className="icon" />
                <span>Active Users</span>
                <h2>{activeUsers}</h2>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
