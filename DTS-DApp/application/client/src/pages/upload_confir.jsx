import React from "react";
import { useLocation } from "react-router-dom";


const UploadConfir=()=>{
    const location=useLocation();
    const {file_id,file_name,collection_name,user_id}=location.state || {};
    return(
        <div>
            <p style={{
                fontStyl:'italic',
                fontSize:'60px',
                color:'black'
            }}>Hi <strong>{user_id}</strong>, Your file <b>{file_name}</b> is successfully uploaded 
            onto the collection <b>{collection_name}</b>  with file ID :-<b> <u>{file_id}</u></b></p>
        </div>
    );
};

export default UploadConfir;