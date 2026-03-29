import React from "react";
import { useLocation } from "react-router-dom";


const UpdateConfir=()=>{
    const location=useLocation();
    const {file_id,file_name,folder_name,file_version,user_id}=location.state || {};
    const File_Ver=Number(file_version)+1;
    return(
        <div>
            <p style={{
                fontStyl:'italic',
                fontSize:'60px',
                color:'black'
            }}>Hi <strong>{user_id}</strong>, Your file <b>{file_name}</b> is successfully updated with file version :<b>{File_Ver}</b>,
            onto the collection <b>{folder_name}</b>  with file ID :-<b> <u>{file_id}</u></b></p>
        </div>
    );
};

export default UpdateConfir;