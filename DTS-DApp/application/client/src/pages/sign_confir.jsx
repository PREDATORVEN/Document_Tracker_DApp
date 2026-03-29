import React from "react";
import { useLocation } from "react-router-dom";
const SignConfir= ()=>{
const location=useLocation();
const {user_email}=location.state || {};
return(
    <div>
        <p>Thank You <strong>{user_email}</strong>,For enrolling on to our Dapp. We will notify you shortly regarding the access!!</p>
    </div>

);
};

export default SignConfir;