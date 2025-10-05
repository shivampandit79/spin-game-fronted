import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import { Navigate } from "react-router-dom";
import Deposit from "./components/pages/Deposit";
import { AuthProvider } from "./context/AuthContext";


function App() {
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
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/file-manager" element={<FileManager />} />
              {/* <Route path="/order" element={<Order />} /> */}
              <Route path="/saved" element={<Saved />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
      </AuthProvider>
    </>
  );
}

export default App;
