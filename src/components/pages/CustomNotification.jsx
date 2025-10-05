import React from "react";
import "../PageCss/CustomNotification.css"; // Notification CSS


export default function CustomNotification({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="notification-container">
      <div className="notification-content">
        <p>{message}</p>
        <button onClick={onClose}>✖</button>
      </div>
    </div>
  );
}
