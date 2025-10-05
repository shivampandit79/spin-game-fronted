import React, { useState } from "react";
import "../PageCss/Order.css";

export default function Order() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const prizes = ["₹10", "₹50", "₹100", "₹500", "₹1000", "Better Luck!", "Jackpot 🎉"];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];

    const extraRotation = 360 * 5; // 5 full rounds
    const sliceAngle = 360 / prizes.length;
    const finalRotation = extraRotation + randomIndex * sliceAngle + sliceAngle / 2;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(prize);
    }, 4000);
  };

  return (
    <div className="spin-container">
      <h2 className="spin-title">🎰 Spin & Win 🎰</h2>

      <div className="wheel-container">
        <div
          className={`wheel ${isSpinning ? "spinning" : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="wheel-text"
              style={{
                transform: `rotate(${(360 / prizes.length) * index}deg) translate(80px) rotate(${360 / prizes.length / 2}deg)`,
              }}
            >
              {prize}
            </div>
          ))}
        </div>
        <div className="pointer">▲</div>
      </div>

      <button className="spin-btn" onClick={spinWheel} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin Now"}
      </button>

      {result && <h3 className="result">You Won: {result}</h3>}
    </div>
  );
}
