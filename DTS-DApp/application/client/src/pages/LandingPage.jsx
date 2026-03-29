3// pages/LandingPage.jsx
import React from "react";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

import "../styles/landing.css"; // Make sure this file contains the styles from Uiverse


const  LandingPage= () => {
  const navigate =useNavigate();
  const [user_email, setUserEmail]=useState('');
  const [user_pass, setUserPass]=useState('');
  const [user_name, setUserName]=useState('');
  const log_handleform= async (e)=>{
    e.preventDefault();
    try{
    const res =await fetch('http://localhost:5000/api/login',{
      method:'POST',
      headers:{
        "Content-Type":'application/json'
      },
      body: JSON.stringify({user_email,user_pass})
    });
    
    const data= await res.json();

    if (data.status=="success_admin"){
        navigate('/admin',{state:{user_id:user_email}});
    }
    else if(data.status=="success_user"){
        navigate('/user',{state:{user_id:user_email}});
    }
    else{
        alert('Invalid Credentials!!');
    }
  }
    catch(error){
      console.error("Failed to Login!!");
      alert("Something Went Wrong!!");
    }
  }

  const Sign_handleform= async (e)=>{
    e.preventDefault();

    const sign_req=await fetch('http://localhost:5000/api/signup',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({user_name,user_email,user_pass})
    });

    const sign_res=await sign_req.json();

    if(sign_res.status=='success'){
      navigate('/signup_confirmation',{state:{user_email}});
    }
    else if(sign_res.status=='redundant'){
      alert(sign_res.message);
    }
    else{
      alert('Something Went Wrong!!');
    }
    
  }
  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input type="checkbox" className="toggle" />
          <span className="slider"></span>
          <span className="card-side"></span>
          <div className="flip-card__inner">
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form" onSubmit={log_handleform}>
                <input
                  className="flip-card__input"
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                  value={user_email}
                  onChange={(e)=>setUserEmail(e.target.value)}
                />
                <input
                  className="flip-card__input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                  value={user_pass}
                  onChange={(e)=>setUserPass(e.target.value)}
                />
                <button className="flip-card__btn">Let&apos;s go!</button>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" onSubmit={Sign_handleform}>
                <input
                  className="flip-card__input"
                  placeholder="Name"
                  type="text"
                  name="name"
                  required
                  value={user_name}
                  onChange={(e)=>setUserName(e.target.value)}
                />
                <input
                  className="flip-card__input"
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                  value={user_email}
                  onChange={(e)=>setUserEmail(e.target.value)}
                />
                <input
                  className="flip-card__input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                  value={user_pass}
                  onChange={(e)=>setUserPass(e.target.value)}
                />
                <button className="flip-card__btn">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default LandingPage;

