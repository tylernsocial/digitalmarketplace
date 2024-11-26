import React from 'react'
import './HomePage.css'; 
import topIMG from './assets/pic.png'
import { useNavigate } from 'react-router-dom';


export const HomePage = () => {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate('/signup'); // Navigate to the SignUp page
  };

  const handleLogin = () => {
    navigate('/login'); // Navigate to the Login page
  };

  return (
    <div className="homepage-container">
      <img src={topIMG} className="homepage-image" />
      <h1 className="homepage-title">Welcome to the Clothing Digital Marketplace</h1>
      <p className="homepage-description">
        Your one-stop platform for buying and selling clothing securely through a middleman!
      </p>
      <div className="homepage-buttons">
        <button className="homepage-button signup-button" onClick={handleSignUp}>
          Sign Up
        </button>
        <button className="homepage-button login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}