import React, { useState, useEffect, useContext } from "react";
import "../PageCss/FileManager.css";
import { AuthContext } from "../../context/AuthContext";

export default function FileManager() {
  const { authToken } = useContext(AuthContext);
  const [leaderboardData, setLeaderboardData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    if (!authToken) return; // Ensure token exists before fetching

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/leaderboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await res.json();
        if (data.success) setLeaderboardData(data);
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
      }
    };
    fetchLeaderboard();
  }, [authToken]); // Only run when authToken changes

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">🏆 Leaderboard</h1>
      <div className="tabs">
        {["daily", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Spins</th>
              <th>Winnings</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData[activeTab]?.map((player, index) => (
              <tr key={index} className={`rank-${index + 1}`}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.spins}</td>
                <td>₹{player.winnings.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
