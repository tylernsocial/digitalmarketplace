import React from 'react'
import './HomePage.css'; 
import topIMG from './assets/pic.png'
export const HomePage = () => {
  return (
    <div className="homepage-container">
      <img src={topIMG} className="homepage-image" />
      <h1 className="homepage-title">Welcome to the Clothing Digital Marketplace</h1>
      <p className="homepage-description">
        Your one-stop platform for buying and selling clothing securely through a middleman!
      </p>
      <div className="homepage-buttons">
        <button className="homepage-button signup-button">Sign Up</button>
        <button className="homepage-button login-button">Login</button>
      </div>
    </div>
  );
};
