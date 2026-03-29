import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../styles/upload_doc.css";
import axios from "axios";

const UpdateDocument = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const navigate=useNavigate();
  const location=useLocation();
  const {user_id,file_id,file_version,folder_name}=location.state ||{};

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    // Send selected options as a JSON string
    formData.append("modifiedBy",user_id);
    formData.append("fileId", file_id);
    formData.append("fileVersion", file_version);
    formData.append("folderName", folder_name);

    try {
      const response = await axios.post("http://localhost:5000/api/update-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log(response.data);
      if (response.data.status=='success'){
        const uploadfiles=response.data.files;
        let file_name;

        uploadfiles.forEach(file=>{
          file_name=file.filedata.file_name;
        });
        navigate('/update_confirmation',{state:{file_id,file_name,folder_name,file_version,user_id}});
      }
      else{
        alert(response.data.message);
      }
    } catch (err) {
      alert("Upload failed.");
      
    }
  };

  return (
    <div className="upload-container">
      <h1>USER : {user_id} </h1>
      <h2 className="upload-title">Upload Your Document Here</h2>

      <form onSubmit={handleSubmit}>
        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          Drag & Drop files here
        </div>

        <input
          type="file"
          onChange={handleFileSelect}
          className="file-input"
          multiple
        />
        <button type="submit" className="upload-btn">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UpdateDocument;
