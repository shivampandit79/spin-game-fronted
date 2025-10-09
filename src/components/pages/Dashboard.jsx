import "../../components/PageCss/Dashboard.css";
import React, { useState, useContext, useEffect } from "react";
import { IoWallet } from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext.jsx";
import AuthPopup from "../pages/AuthPopup";
import BetPopup from "./BetPopup.jsx";
import NewWinPopup from "./NewWinPopup.jsx";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  const [multiplier, setMultiplier] = useState("BET NOW");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showBetPopup, setShowBetPopup] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [spinRecords, setSpinRecords] = useState([]);

  const multiplierOptions = ["1X", "2X", "3X", "5X", "7X", "10X", "15X"];

  const fetchBalance = async () => {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE_URL}/wallet/balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (data.success && typeof data.balance === "number")
        setBalance(data.balance);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [authToken]);

  const spinWheel = () => {
    if (buttonDisabled) return;

    if (!authToken) {
      setShowAuthPopup(true);
      return;
    }
    if (balance < 20) {
      navigate("/deposit");
      return;
    }
    setButtonDisabled(true);
    setShowBetPopup(true);
  };

  const handleBetConfirm = async (amount) => {
    if (isSpinning) return;

    setBetAmount(amount);
    setShowBetPopup(false);
    setIsSpinning(true);
    setButtonDisabled(true);

    let spinIndex = 0;
    setMultiplier(multiplierOptions[spinIndex % multiplierOptions.length]);
    const spinInterval = setInterval(() => {
      spinIndex++;
      setMultiplier(multiplierOptions[spinIndex % multiplierOptions.length]);
    }, 100);

    try {
      const res = await fetch(`${API_BASE_URL}/spin/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          clearInterval(spinInterval);
          setMultiplier(data.multiplier);
          setWinAmount(data.winAmount);
          setBalance(data.walletBalance);
          setShowWinPopup(true);
          setIsSpinning(false);
          setButtonDisabled(false);
        }, 3000);
      } else {
        clearInterval(spinInterval);
        setMultiplier("BET NOW");
        setIsSpinning(false);
        setButtonDisabled(false);
      }
    } catch (err) {
      console.error("Spin Error:", err);
      clearInterval(spinInterval);
      setMultiplier("BET NOW");
      setIsSpinning(false);
      setButtonDisabled(false);
    }
  };

  // Generate random spin records every 5 seconds
  useEffect(() => {
    const generateSpinRecords = () => {
      const names = ["Alex", "John", "Sara", "Mia", "Ryan", "Lily", "Mark"];
      const records = Array.from({ length: 5 }).map(() => {
        const bet = Math.floor(Math.random() * 800) + 200; // > 200
        const multiplierValue = Math.floor(Math.random() * 10) + 5; // 5x+
        return {
          userName: names[Math.floor(Math.random() * names.length)],
          betAmount: bet,
          winAmount: bet * multiplierValue,
        };
      });
      setSpinRecords(records);
    };

    generateSpinRecords();
    const interval = setInterval(generateSpinRecords, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="title extended-title">
      <div className="centerContent">
        <div
          className="topsection"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div className="icon"></div>
            {authToken && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div
                  className="wallet-box"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f5f5f5",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  <IoWallet
                    style={{
                      marginRight: "6px",
                      fontSize: "20px",
                      color: "#4caf50",
                    }}
                  />
                  <span style={{ color: "#000" }}>
                    ₹{balance ? balance.toFixed(2) : "0.00"}
                  </span>
                </div>
                <button
                  disabled={buttonDisabled}
                  onClick={logout}
                  style={{
                    background: "#ff4d4d",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="secondSection">
          <div className="centerSecondDiv">
            <div className="topSectionHeading">
              <h1>BET</h1>
              <h2>&</h2>
              <h1>WIN</h1>
            </div>
            <div className="subTitleHeading">
              <span>Win real cash every spin!</span>
            </div>

            <div className="multiplier-container">
              <div className="multiplier-display">{multiplier}</div>
            </div>

            <div className="spinButton">
              <button disabled={buttonDisabled} onClick={spinWheel}>
                PLAY NOW
              </button>
            </div>

            {/* 🆕 Scrollable Recent Spins */}
            <div className="spin-records-container">
              <h3 style={{ color: "#fff", textAlign: "center" }}>
                Recent Spins
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Bet Amount</th>
                    <th>Win Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {spinRecords.map((record, idx) => (
                    <tr key={idx}>
                      <td>{record.userName}</td>
                      <td>₹{record.betAmount.toLocaleString()}</td>
                      <td>₹{record.winAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAuthPopup && (
        <AuthPopup onClose={() => setShowAuthPopup(false)} />
      )}
      {showBetPopup && (
        <BetPopup
          balance={balance}
          onClose={() => setShowBetPopup(false)}
          onConfirm={handleBetConfirm}
        />
      )}
      {showWinPopup && (
        <NewWinPopup
          multiplier={multiplier}
          betAmount={betAmount}
          winAmount={winAmount}
          onClose={() => setShowWinPopup(false)}
        />
      )}
    </div>
  );
}
