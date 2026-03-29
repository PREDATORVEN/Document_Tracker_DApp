import React from "react";
import { useLocation } from "react-router-dom";


const RollConfir=()=>{
    const location=useLocation();
    const {file_id,rollBackTo,current_version,user_id}=location.state || {};
    const File_Ver=Number(current_version)+1;
    return(
        <div>
            <p style={{
                fontStyl:'italic',
                fontSize:'60px',
                color:'black'
            }}>Hi <strong>{user_id}</strong>, Your file with ID :-<b> <u>{file_id}</u></b> is successfully rolled back to version :<b>{rollBackTo}</b>,
            from version <b>{current_version}</b> as a new version- <b><i>{Number(current_version)+1}</i></b> </p>
        </div>
    );
};

export default RollConfir;