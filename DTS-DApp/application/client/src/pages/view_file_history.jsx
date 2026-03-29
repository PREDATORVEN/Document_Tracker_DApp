import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/view_file_history.css";

const ViewFileHistory = () => {
  const location = useLocation();
  const { History } = location.state || {};

  return (
    <div className="view-history-container">
      <h2 >File History </h2>
      
      <div className="history-box">
       <table>
        <thead>
          <tr>
            <th>Transact ID</th>
            <th>File ID</th>
            <th>File Name</th>
            <th>Folder Name</th>
            <th>File Created By</th>
            <th>File Hash</th>
            <th>File Size</th>
            <th>File Version</th>
            <th>File GridId</th>
            <th>Modified At</th>
            <th>Accessed By</th>
            <th>Action Performed</th>
            <th>RollBack From Version</th>
            <th>RollBack To Version</th>


          </tr>
        </thead>
        <tbody>
            {History.map((entry,index) => (
              <tr key={index}>
                <td>{entry.txId}</td>
                <td>{entry.data.fileId}</td>
                <td>{entry.data.fileName}</td>
                <td>{entry.data.folderName}</td>
                <td>{entry.data.createdBy}</td>
                <td>{entry.data.fileHash}</td>
                <td>{entry.data.fileSize}</td>
                <td>{entry.data.fileVersion}</td>
                <td>{entry.data.gridFSId}</td>
                <td>{entry.data.lastModifiedTime}</td>
                <td>{entry.data.lastAccessedBy}</td>
                <td>{entry.data.lastActionPerformed}</td>
                <td>{entry.data.rollBackFrom}</td>
                <td>{entry.data.rollBackTo}</td>
              </tr>
            ))}
          
        </tbody>
       </table>
      </div>
    </div>
  );
}

export default ViewFileHistory;            
