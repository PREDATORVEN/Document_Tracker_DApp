import React, { useState } from "react";
import "../styles/add_user.css"; // Create this CSS file for styling

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
// Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.status === 'success') {
      alert('User added successfully!');
    } else if (result.status === 'redundant') {
      alert('Email already exists!');
    } else {
      alert('Failed to add user');
    }
    console.log("Server Response:", result);
  } catch (err) {
    console.error("Error:", err);
    alert("Server error");
  }
};
  

  return (
    <div className="form-container">
      <h2 className="form-title">Add New User</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="USER"
              checked={formData.role === "USER"}
              onChange={handleChange}
            />
            USER
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="ADMIN"
              checked={formData.role === "ADMIN"}
              onChange={handleChange}
            />
            ADMIN
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
