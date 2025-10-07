import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import "../PageCss/deposit.css";
import "../PageCss/CustomNotification.css";
import CustomNotification from "../../components/pages/CustomNotification.jsx";
import dayjs from "dayjs";
import { QRCodeCanvas } from "qrcode.react";

// 📌 Environment variable for API base URL
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Deposit = () => {
  const { authToken } = useContext(AuthContext);

  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [upiId, setUpiId] = useState(""); 
  const [showOptions, setShowOptions] = useState(false);

  const [depositHistory, setDepositHistory] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [lastDeposit, setLastDeposit] = useState(0);

  const [notification, setNotification] = useState("");
  const [randomUpi, setRandomUpi] = useState(null);

  const depositMethods = ["UPI - GPay", "UPI - PhonePe", "UPI - Paytm", "UPI - Navi UPI"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authToken) return;

        const totalRes = await fetch(`${API_BASE_URL}/deposit/total`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const totalData = await totalRes.json();
        setTotalDeposits(totalData.totalDeposits || 0);
        setLastDeposit(totalData.lastDeposit || 0);

        const depRes = await fetch(`${API_BASE_URL}/deposit/history`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const depData = await depRes.json();
        setDepositHistory(depData || []);

        const wdRes = await fetch(`${API_BASE_URL}/deposit/withdraw/history`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const wdData = await wdRes.json();
        setWithdrawHistory(wdData || []);

        const upiRes = await fetch(`${API_BASE_URL}/upi/random`);
        const upiData = await upiRes.json();
        setRandomUpi(upiData);
      } catch (error) {
        console.error("Error fetching deposits/withdrawals:", error);
      }
    };

    fetchData();
  }, [authToken]);

  const handleTransaction = async (e) => {
    e.preventDefault();

    if (!amount || (tab === "deposit" && !method)) {
      setNotification("Please enter amount and choose method");
      return;
    }

    if (tab === "deposit" && Number(amount) < 200) {
      setNotification("Minimum deposit amount is ₹200");
      return;
    }
    if (tab === "withdraw" && Number(amount) < 500) {
      setNotification("Minimum withdraw amount is ₹500");
      return;
    }

    try {
      const url =
        tab === "deposit"
          ? `${API_BASE_URL}/wallet/deposit`
          : `${API_BASE_URL}/deposit/withdraw`;

      const body =
        tab === "deposit"
          ? { amount: Number(amount), method }
          : { amount: Number(amount), upiId };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.success) {
        setNotification(`${tab === "deposit" ? "Deposit" : "Withdraw"} failed. Try again!`);
        return;
      }

      setNotification(
        tab === "deposit"
          ? `💰 Deposited ₹${amount} via ${method} ✅`
          : `📤 Withdrawal of ₹${amount} requested ✅`
      );
      setAmount("");
      setMethod("");
      setUpiId("");
      window.location.reload();
    } catch (error) {
      console.error("Transaction error:", error);
      setNotification("Error processing transaction.");
    }
  };

  const toggleOptions = () => setShowOptions(!showOptions);
  const selectMethod = (method) => {
    setMethod(method);
    setShowOptions(false);
  };

  const copyUpiToClipboard = () => {
    if (randomUpi && randomUpi.upi) {
      navigator.clipboard.writeText(randomUpi.upi).then(() => {
        setNotification(`📋 UPI ID "${randomUpi.upi}" copied to clipboard!`);
      }).catch((err) => {
        console.error("Failed to copy UPI ID:", err);
        setNotification("❌ Failed to copy UPI ID.");
      });
    }
  };

  return (
    <div className="deposit-container">
      {notification && (
        <CustomNotification message={notification} onClose={() => setNotification("")} />
      )}

      <div className="deposit-card">
        <div className="deposit-header">
          <h1>{tab === "deposit" ? "💰 Deposit Funds" : "📤 Withdraw Funds"}</h1>
          <div className="tabs">
            <button
              className={tab === "deposit" ? "active" : ""}
              onClick={() => setTab("deposit")}
            >
              Deposit
            </button>
            <button
              className={tab === "withdraw" ? "active" : ""}
              onClick={() => setTab("withdraw")}
            >
              Withdraw
            </button>
          </div>
        </div>

        <p className="deposit-subtitle">
          {tab === "deposit"
            ? "Add money to keep betting and winning!"
            : "Withdraw your winnings instantly!"}
        </p>

        <form onSubmit={handleTransaction} className="deposit-form">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          {tab === "withdraw" && (
            <input
              type="text"
              placeholder="Enter your UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
          )}

          {tab === "deposit" && (
            <div className="custom-select" onClick={toggleOptions}>
              <div>{method || "💳 Select Payment Method"}</div>
              <div className={`options ${showOptions ? "active" : ""}`}>
                {depositMethods.map((m, index) => (
                  <div key={index} className="option" onClick={() => selectMethod(m)}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="deposit-btn">
            {tab === "deposit" ? "Deposit Now" : "Withdraw Now"}
          </button>
        </form>

        {tab === "deposit" && method && method.toLowerCase().includes("upi") && randomUpi && (
          <div className="upi-qr-section">
            <h2 className="upi-title">Scan to Pay via UPI</h2>
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <QRCodeCanvas
                value={`upi://pay?pa=${randomUpi.upi}&pn=Payment`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
              Use any UPI app to scan & pay
            </p>

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button className="copy-upi-btn" onClick={copyUpiToClipboard}>
                📋 Copy UPI ID
              </button>
            </div>
          </div>
        )}

        {tab === "deposit" && (
          <div className="deposit-summary">
            <h3>Total Deposits: ₹{totalDeposits}</h3>
            <h3>Last Deposit: ₹{lastDeposit}</h3>
          </div>
        )}

        {tab === "deposit" && depositHistory.length > 0 && (
          <div className="deposit-history">
            <h2>Deposit History 💵</h2>
            <table>
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {depositHistory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.transectionID || "-"}</td>
                    <td>₹{item.amount}</td>
                    <td>{dayjs(item.createdAt).format("DD MMM, HH:mm")}</td>
                    <td
                      style={{
                        color:
                          item.status.toLowerCase() === "success"
                            ? "green"
                            : item.status.toLowerCase() === "pending"
                            ? "red"
                            : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "withdraw" && withdrawHistory.length > 0 && (
          <div className="deposit-history">
            <h2>Withdraw History 📤</h2>
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>UPI ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawHistory.map((item, index) => (
                  <tr key={index}>
                    <td>₹{item.amount}</td>
                    <td>{dayjs(item.createdAt).format("DD MMM, HH:mm")}</td>
                    <td>{item.upiId}</td>
                    <td
                      style={{
                        color:
                          item.status.toLowerCase() === "success"
                            ? "green"
                            : item.status.toLowerCase() === "pending"
                            ? "red"
                            : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposit;
