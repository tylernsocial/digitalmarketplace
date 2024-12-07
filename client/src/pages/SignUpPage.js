import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    address: "",
    email: "",
    password: "",
    phone: "",
    role: "buyer",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data to backend
      });

      if (response.ok) {
        alert("Sign-up successful!");
        navigate("/login"); // Redirect to login page after successful sign-up
      } else {
        const errorData = await response.json(); // Extract error details from backend response
        alert(`Error: ${errorData.message || "Sign-up failed. Please try again."}`);
    }
  } catch (error) {
      console.error("Error:", error); // Log the full error object for debugging
      alert(`Error: ${error.message || "An unknown error occurred. Please check the console for more details."}`);
  }
};

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <p>Welcome! Please create your account here.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          value={formData.fname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          value={formData.lname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
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
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="buyer"
              checked={formData.role === "buyer"}
              onChange={handleChange}
            />
            Buyer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="seller"
              checked={formData.role === "seller"}
              onChange={handleChange}
            />
            Seller
          </label>
          {/* for testing, delete later */}
          <label>
            <input
              type="radio"
              name="role"
              value="middleman"
              checked={formData.role === "middleman"}
              onChange={handleChange}
            />
            middleman
          </label>
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
