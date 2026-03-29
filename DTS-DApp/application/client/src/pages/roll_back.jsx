import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RollBack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { file_id, file_version, user_id, rollback_options = [] } = location.state || {};

  const [rollBackTo, setRollBackTo] = useState("");

  const handleRollback = async () => {
    const targetVersion = parseInt(rollBackTo);
    if (isNaN(targetVersion) || targetVersion >= file_version || targetVersion < 1) {
      alert("Please select a valid version.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/file_rollback/${file_id}/${targetVersion}/${user_id}/${file_version}`
      );

      if (response.data.status === "success") {
        alert("Rollback successful!");
        navigate("/roll_confirmation", {
          state: {
            file_id,
            rollBackTo: targetVersion,
            current_version: file_version,
            user_id
          }
        });
      } else {
        alert("Rollback failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error during rollback:", error);
      alert("An error occurred while trying to rollback.");
    }
  };

  return (
    <div className="rollback-container">
      <h1>User: {user_id}</h1>
      <h2>Rollback File Version</h2>
      <p>File ID: {file_id}</p>
      <p>Current Version: {file_version}</p>

      <label htmlFor="rollbackVersion">Select Version to Rollback To:</label>
      <select
        id="rollbackVersion"
        value={rollBackTo}
        onChange={(e) => setRollBackTo(e.target.value)}
      >
        <option value="">-- Select a version --</option>
        {rollback_options
          .filter((v) => v < file_version)
          .sort((a, b) => b - a) // descending
          .map((version) => (
            <option key={version} value={version}>
              Version {version}
            </option>
          ))}
      </select>

      <br /><br />
      <button onClick={handleRollback} disabled={!rollBackTo}>
        Perform Rollback
      </button>
    </div>
  );
};

export default RollBack;
