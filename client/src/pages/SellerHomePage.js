import React, { useState } from "react";
import './SellerHomePage.css'; 

export const SellerHomePage = () => {
        // State to manage search query
        const [searchQuery, setSearchQuery] = useState("");
  
        // Handle the change in input field
        const handleSearchChange = (e) => {
          setSearchQuery(e.target.value);
        };
      
        // Handle form submission or search button click
        const handleSearch = (e) => {
          e.preventDefault();
          // Logic for search (for now, just log the query)
          console.log("Searching for:", searchQuery);
        };
  return (
    <div className="sellerpage-container">
      <h1 className="sellerpage-title">Welcome to the Seller's portal!</h1>
             {/* Search section */}
      <div className="sellerpage-search">
        <form onSubmit={handleSearch} style={{ width: "100%" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
        </form>
      </div>
        
    
    
    </div>
  )
}
