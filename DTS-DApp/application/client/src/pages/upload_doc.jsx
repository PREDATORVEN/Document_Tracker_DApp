import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../styles/upload_doc.css";
import axios from "axios";

const UploadDocument = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate=useNavigate();
  const location=useLocation();
  const {user_id}=location.state ||{};
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((opt) => opt !== option)
        : [...prev, option]
    );
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
    formData.append("options", JSON.stringify(selectedOptions));
    formData.append("created_by",user_id);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status=='success'){
        const uploadfiles=response.data.files;
        let file_id,file_name,collection_name;
        uploadfiles.forEach(file=>{
          file_id=file.filedata.file_id;
          file_name=file.filedata.file_name;
          collection_name=file.filedata.collection_name;
        });
        navigate('/upload_confirmation',{state:{file_id,file_name,collection_name,user_id}});
      }
      else{
        alert("Please Upload file again!!")
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

        <div className="checkbox-section">
          <label>
            <input
              type="checkbox"
              checked={selectedOptions.includes("Blockchain Lab")}
              onChange={() => handleCheckboxChange("Blockchain Lab")}
            />
            Blockchain Lab
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedOptions.includes("Machine Learning Lab")}
              onChange={() => handleCheckboxChange("Machine Learning Lab")}
            />
            Machine Learning Lab
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedOptions.includes("Quantum Lab")}
              onChange={() => handleCheckboxChange("Quantum Lab")}
            />
            Quantum Lab
          </label>
        </div>

        <button type="submit" className="upload-btn">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadDocument;
