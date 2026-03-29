import React, { useState } from "react";


const ViewFile = () => {
  const [filename, setFilename] = useState("");
  const [fileURL, setFileURL] = useState("");

  const handleViewFile = async () => {
    try {
      // Construct the file URL to be used in the iframe
      const url = `http://localhost:5000/api/file_view/${filename}`;
      setFileURL(url);
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("Unable to view file. Please check filename or server.");
    }
  };
  const handleDownFile=(e)=>{
    try{
        const url=`http://localhost:5000/api/file_download/${filename}`;
        window.open(url,'_blank');
    }
    catch (err){
      console.error("Error Downloading File:",err);
    }
  };
  return (
    <div style={{ padding: "2rem" }}>
      <h2>View Document</h2>

      <input
        type="text"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Enter filename (e.g. file.pdf)"
        style={{ padding: "0.5rem", width: "300px" }}
      />

      <button onClick={handleViewFile} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
        View File
      </button>
      <button  onClick={handleDownFile} style={{marginLeft:"1rem", padding:"0.5rem 1rem"}}>
        Download File</button>

      {fileURL && (
        <div style={{ marginTop: "2rem" }}>
          <h3>File Preview:</h3>
          <iframe
            src={fileURL}
            title="File Preview"
            width="100%"
            height="600px"
            style={{ border: "5px solid #FFB433" }}
          />
        </div>
      )}
    </div>
  );
};

export default ViewFile;
