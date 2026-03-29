import React from "react";
import { useLocation, useNavigate} from "react-router-dom";
import "../styles/admin.css"; // Make sure to create this file or use inline styles

const AdminPage = () => {
  const location=useLocation();
  const {user_id}=location.state ||{};
  const navigate=useNavigate();
  
  const Add_User = () => {
    //window.location.href = "/add_user"; // Redirect to Add User page
    navigate("/add_user",{state:{user_id}});
  };
  const Pending_Requests = () => {
   // window.location.href = "/pending_requests"; // Redirect to Pending Requests page
   navigate("/pending_requests",{state:{user_id}});
  }
  const Approve_Changes = () => {
   // window.location.href = "/lab_select"; // Redirect to Lab Selection page
   navigate("/lab_select",{state:{user_id}});
  };
  const User_Page = () => {
   // window.location.href = "/user"; // Redirect to User Dashboard
   navigate("/user",{state:{user_id}});
  }
  return (
    <div classname="card">
      <h1>Welcome {user_id} !!</h1>
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <div className="admin-buttons">
          <button className="admin-btn" onClick={Add_User}>Add User</button>
          <button className="admin-btn" onClick={Pending_Requests}>Pending Requests</button>
          <button className="admin-btn" onClick={Approve_Changes}>Approve Changes</button>
          <button className="admin-btn" onClick={User_Page}>User Page</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

