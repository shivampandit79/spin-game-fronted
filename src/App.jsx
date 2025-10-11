import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Dashboard from "./components/pages/Dashboard";
import Users from "./components/pages/Users";
import Analytics from "./components/pages/Analytics";
import FileManager from "./components/pages/FileManager";
import Order from "./components/pages/Order";
import Saved from "./components/pages/Saved";
import Settings from "./components/pages/Setting";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Sidebar from "./components/Sidebar";
import "typeface-roboto";
import Deposit from "./components/pages/Deposit";
import { AuthProvider } from "./context/AuthContext";
import ReferEarn from "./components/pages/ReferEarn";
import Shoot form "./components/pages/Shoot.jsx";

function App() {
  // 🔹 Add-to-Home (Install App) button logic — only added below
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPromptEvent(e);
    });
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    console.log("User choice:", result.outcome);
    setPromptEvent(null);
  };

  return (
    <>
      <AuthProvider>
        <Router>
          <div className="main-container">
            <Sidebar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/user" element={<Users />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/refer" element={<ReferEarn />} />
                <Route path="/file-manager" element={<FileManager />} />
                {/* <Route path="/order" element={<Order />} /> */}
                <Route path="/saved" element={<Saved />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/shoot" element={<Shoot/>} />
              </Routes>

              {/* 🔹 Install App Button (Optional) */}
              {promptEvent && (
                <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
                  <button
                    onClick={handleInstall}
                    style={{
                      padding: "10px 15px",
                      borderRadius: "10px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Install App
                  </button>
                </div>
              )}
            </div>
          </div>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
