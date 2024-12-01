import React, { useState, useEffect } from "react";
import './SellerHomePage.css'; 
import axios from "axios";

export const SellerHomePage = () => {

        const [item, setItem] = useState([])
        useEffect(() => {
          const fetchAllItem = async () =>{
            try{
              const res = await axios.get("http://localhost:8800/item")
              setItem(res.data)
            }catch(err){
              console.log(err)
            }
          }
          fetchAllItem()
        },[])

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
      
      {/*Display Items */}
      <div className="sellerpage-left">
        <div className="item-grid">
        <div className ="item">
            {item.map(item_single =>(
              <div className ="item_single" key={item_single.id}>
                {item_single.item_photo && <img src={item_single.item_photo} alt="" />}
                <h2>{item_single.item_name}</h2>
                <p>{item_single.price}</p>
                <p>{item_single.size}</p>
              </div>
            ))}
          </div>
          </div>


      </div>
      </div>
        
  )
}