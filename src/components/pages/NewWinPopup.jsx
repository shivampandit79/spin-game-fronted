// src/components/NewWinPopup.jsx
import React from "react";
import "../../components/PageCss/NewWinPopup.css";

export default function NewWinPopup({ multiplier, betAmount, onClose }) {
  const winningAmount = betAmount * parseInt(multiplier);

  return (
    <div className="win-popup-overlay">
      <div className="win-popup">
        <h1>🎉 Congratulations! 🎉</h1>
        <p className="multiplier">You won: <span>{multiplier}</span></p>
        <p className="amount">Winning Amount: ₹{winningAmount.toFixed(2)}</p>
        <button className="win-popup-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
