import React, { useState } from "react";
import "../../components/PageCss/BetPopup.css";

export default function BetPopup({ balance, onClose, onConfirm }) {
  const [betAmount, setBetAmount] = useState("");

  const handleConfirm = () => {
    if (betAmount < 20) {
      alert("Minimum spin amount is ₹20");
      return;
    }
    if (betAmount > balance) {
      alert("Enter a valid amount within your balance!");
      return;
    }
    onConfirm(Number(betAmount));
  };

  return (
    <div className="bet-popup-overlay">
      <div className="bet-popup">
        <h2>🎲 Place Your Bet</h2>
        <p>Your balance: ₹{balance.toFixed(2)}</p>
        <input
          type="number"
          placeholder="Enter amount"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          min="20"
          style={{ padding: "8px", fontSize: "16px" }}
        />
        <div className="bet-popup-buttons">
          <button className="confirm-btn" onClick={handleConfirm}>
            Bet & Spin 🎰
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel ❌
          </button>
        </div>
      </div>
    </div>
  );
}
