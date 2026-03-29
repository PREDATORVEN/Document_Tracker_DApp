// ✅ PendingRequests.jsx
import React, { useEffect, useState } from "react";
import "../styles/pending.css";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pending-requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch pending requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (email, role) => {
    try {
      const res = await fetch(
        role === "admin"
          ? "http://localhost:5000/api/approve-admin"
          : "http://localhost:5000/api/approve-user",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const result = await res.json();
      alert(result.message);
      fetchRequests();
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleDeny = async (email) => {
    try {
      const res = await fetch("http://localhost:5000/api/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      alert(result.message);
      fetchRequests();
    } catch (err) {
      console.error("Deny error:", err);
    }
  };

  return (
    <div className="pending-container">
      <h2 className="pending-title">PENDING REQUESTS</h2>
      <table className="pending-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email ID</th>
            <th>Allow as User</th>
            <th>Deny Request</th>
            <th>Allow as Admin</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.user_name}</td>
              <td>{req.user_email}</td>
              <td>
                <button
                  onClick={() => handleApprove(req.user_email, "user")}
                  className="btn allow-user"
                >
                  Allow as User
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDeny(req.user_email)}
                  className="btn deny"
                >
                  Deny
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleApprove(req.user_email, "admin")}
                  className="btn allow-admin"
                >
                  Allow as Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRequests;
