import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/user.css"; // Ensure this path is correct



const UserDashboard = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const {user_id}=location.state ||{};
  const handleUpload = () => {
    // window.location.href = "/upload_doc";
    navigate("/upload_doc",{state:{user_id}});
    // Navigate or trigger file upload
  };

  const handleViewCollection = () => {
    //window.location.href = "/view_col";
     navigate("/labs",{state:{user_id}});
    // Navigate to collection page
  };

  const handleLogout = () => {
   // window.location.href = "/";
    navigate("/");
    // Clear session or navigate to login
  };

  return (
    <div className="user-container">
      <h1>Welcome <strong>{user_id}</strong> !! </h1>
      <h2 className="user-title"> Document Tracker Tool</h2>
      <div className="user-buttons">
        <button className="user-btn" onClick={handleUpload}>
          Upload Document
        </button>
        <button className="user-btn" onClick={handleViewCollection}>
          View Collection
        </button>
        <button className="user-btn logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
