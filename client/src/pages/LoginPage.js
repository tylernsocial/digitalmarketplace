import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";


export const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials), // Send login credentials to backend
      });

      if (response.ok) {
        const data = await response.json(); // Parse the successful response
        localStorage.setItem("id", data.member_id); // Store member_id
        alert(`Welcome back, ${data.name || "User"}!`);
        // Optionally redirect to a dashboard or another page
        // navigate('/dashboard');
        // Redirect based on role
        if (data.role === "buyer") {
          navigate("/buyer-home-page");
        } else if (data.role === "seller") {
          navigate("/seller-home-page");
        }

      } else {
        const errorData = await response.json(); // Extract error details from backend response
        alert(`Error: ${errorData.message || "Invalid email or password."}`);
      }
    } catch (error) {
      console.error("Error:", error); // Log the full error object for debugging
      alert(
        `Error: ${
          error.message ||
          "An unknown error occurred. Please check the console for more details."
        }`
      );
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <p>Welcome back! Please log in to your account.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};
