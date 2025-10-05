import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../PageCss/User.css";
import dayjs from "dayjs";

export default function User({ refreshHistoryFlag }) {
  const { authToken } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Use environment variable for API URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!authToken) return;

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/spin/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await res.json();
        setHistory(data || []);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [authToken, refreshHistoryFlag, API_BASE_URL]); // API_BASE_URL dependency added

  if (loading) return <p style={{ textAlign: "center", color: "#ccc" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div className="title">
      <div className="centerContent">
        <h1 className="pageHeading">History</h1>
        <div className="contentBox">
          <h2>Bet History</h2>
          {history.length === 0 ? (
            <p style={{ textAlign: "center", color: "#ccc" }}>No spin history available.</p>
          ) : (
            <table className="spinTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date & Time</th>
                  <th>Spin Amount</th>
                  <th>Win Amount</th>
                  <th>Multiplier</th>
                  <th>Result</th>
                  <th>Wallet After Spin</th>
                </tr>
              </thead>
              <tbody>
                {history.map((spin, index) => (
                  <tr key={spin._id}>
                    <td>{index + 1}</td>
                    <td>{dayjs(spin.createdAt).format("DD MMM, HH:mm")}</td>
                    <td>₹{spin.spinAmount}</td>
                    <td>₹{spin.winAmount}</td>
                    <td>{spin.multiplier}</td>
                    <td className={spin.result === "win" ? "win" : "lose"}>
                      {spin.result === "win" ? "Win ✅" : "Loss ❌"}
                    </td>
                    <td>₹{spin.walletAfterSpin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
