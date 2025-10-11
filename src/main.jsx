// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// 🔹 PWA Service Worker Register Import
import { registerSW } from "virtual:pwa-register";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// 🔹 Register Service Worker (Don't change your existing code above)
const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});
