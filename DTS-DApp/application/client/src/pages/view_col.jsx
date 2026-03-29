import React, { useState } from "react";
import {useLocation,useNavigate} from "react-router-dom";
import "../styles/view_col.css";
import axios from "axios";

const ViewCollection = () => {
  // Simulated metadata for the selected file
  const navigate = useNavigate();
  const location=useLocation();
  const {metadata,user_id}=location.state ||{};
 
  const handleContentClick = () => {
    console.log("Document Content clicked");
    // Navigate to or display content
    try{
    	const file_id=metadata.fileId;
      const GridId=metadata.gridFSId;
    	const url=`http://localhost:5000/api/file_view/${file_id}/${GridId}`;
    	window.open(url,'_blank');
    }
    catch(err){
     console.error("Error viewing file:", error);
      alert("Unable to view file. Please check filename or server.");
    }
  };

  const handleEditClick = () => {
    alert("Request for Document Edit");
    // Navigate to edit page
    try{
      const fileId=metadata.fileId;
      const fileVersion=metadata.fileVersion;
      const folderName=metadata.folderName;
      const userId=user_id;
      navigate('/update-file',{state:{file_id:fileId,file_version:fileVersion,folder_name:folderName,user_id:userId}});
    }
    catch(err){
      console.error("Error navigating to edit page:", err);
      alert("Unable to navigate to edit page. Please try again later.");
    }
  };

  const handleVersionClick = async () => {
    // alert("Request for Version Management");
    // Navigate to version management page
    try{
      const fileId=metadata.fileId;
      const fileVersion=metadata.fileVersion;
      const userId=user_id;
      const response= await axios.get(`http://localhost:5000/api/file_rollback_options/${fileId}`);
      alert("Request for Version Management sent successfully");

      if (response.data.status === "success"){
        const rollbackOptions=response.data.data;
        navigate('/version-management',{state:{file_id:fileId,file_version:fileVersion,rollback_options:rollbackOptions,user_id:userId}});
      }
      else{  
        alert("No rollback options available for this file.");
      }
      // navigate('/version-management',{state:{file_id:fileId,file_version:fileVersion,user_id:userId}});
    }
    catch(err){
      console.error("Error navigating to version management page:", err);
      alert("Unable to navigate to version management page. Please try again later.");
    }
  };
  
  const handleHistoryClick= async ()=>{
  // Document History View Page
  	try{
  	const fileId=metadata.fileId;
  	const res=await axios.get(`http://localhost:5000/api/file-history/${fileId}`);
    if(res.data.status=='success'){
      const history=res.data.data;
      // You can display the history in a modal or new page
      navigate('/view_file_history',{state:{History:history}});
    }
  	}
  	catch (err){
  	console.error('Error getting file history',err)
  	alert('Unable to fetch file history for fileId-',metadata.fileId);
  	}
  };

  const handleExitClick = () => {
    // Redirect to User Dashboard
    navigate('/');
  };

  return (
    <div className="view-container">
      <h2 className="view-title">Document Metadata</h2>
      <div className="metadata-box">
       <p><strong>File ID:</strong> {metadata.fileId}</p>
        <p><strong>File Name:</strong> {metadata.fileName}</p>
         <p><strong>Folder Name:</strong> {metadata.folderName}</p>
          <p><strong>Created By:</strong> {metadata.createdBy}</p>
           <p><strong>File Hash:</strong> {metadata.fileHash}</p>
        <p><strong>File Size:</strong> {metadata.fileSize}</p>
         <p><strong>File Version:</strong> {metadata.fileVersion}</p>
        <p><strong>File GridId:</strong> {metadata.gridFSId}</p>
        <p><strong>Modified At:</strong> {metadata.lastModifiedTime}</p>
        <p><strong>Last Accessed By:</strong> {metadata.lastAccessedBy}</p>
        <p><strong>Last Action Performed:</strong> {metadata.lastActionPerformed}</p>
        <p><strong>Roll Back From Ver:</strong> {metadata.rollBackFrom}</p>
        <p><strong>Roll Back To Ver:</strong> {metadata.rollBackTo}</p>

      </div>

      <div className="view-buttons">
        <button className="view-btn" onClick={handleContentClick}>
          [Document Content]
        </button>
        <button className="view-btn" onClick={handleEditClick}>
          [Update Document]
        </button>
         <button className="view-btn" onClick={handleVersionClick}>
          [Version Management]
        </button>
         <button className="view-btn" onClick={handleHistoryClick}>
          [Document History]
        </button>
        <button className="view-btn exit" onClick={handleExitClick}>
          [Exit Session]
        </button>
      </div>
    </div>
  );
};



export default ViewCollection;
