import React from "react";

export default function ResultPopup({ sliceText, onClose }) {
  if (!sliceText) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px 30px",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          maxWidth: "300px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>🎉 You got:</h2>
        <h1 style={{ fontSize: "2rem", color: "#4caf50" }}>{sliceText}</h1>
        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            background: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
