import React from "react";
import "../styles/user.css"; // Ensure this path is correct

const LabSelect = () => {
  const blockchainlab = () => {
    console.log("Blockchain Lab clicked");
    // Navigate or trigger file upload
  };

  const machinelearninglab = () => {
    console.log("Machine Learning Lab clicked");
    // Navigate to collection page
  };

  const quantumlab = () => {
    console.log("Quantum Lab clicked");
    // Clear session or navigate to login
  };

  return (
    <div className="user-container">
      <h2 className="user-title">Select the Lab you want to get documents from:</h2>
      <div className="user-buttons">
        <button className="user-btn" onClick={blockchainlab}>
          Blockchain Lab
        </button>
        <button className="user-btn" onClick={machinelearninglab}>
          Machine Learning Lab
        </button>
        <button className="user-btn" onClick={quantumlab}>
          Quantum Lab
        </button>
      </div>
    </div>
  );
};

export default LabSelect;
