import React, { useState, useEffect } from "react";
import './SellerHomePage.css'; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SellerHomePage = () => {
        const memberId = localStorage.getItem("id");

        const navigate = useNavigate()

        const [items, setItems] = useState([])

        const [item, addItem] = useState({
          item_name: "",
          item_condition: "",
          size: "",
          description: "",
          price: "",
          item_photo: "",
          member_id: memberId // Automatically add member_id to the item object
        });
        
        const handleChange = (e) => {
          const { name, value } = e.target;
          addItem(prev => ({ ...prev, [name]: value }));
      };

      const handleClick = async (e) => {
        e.preventDefault();
        try {
          await axios.post("http://localhost:8800/items", item);
          navigate(0); // Refresh the page after adding the item
        } catch (err) {
          console.log(err);
        }
        }

        console.log(item);

        useEffect(() => {
          const fetchItems = async () => {
              if (!memberId) {
                  alert("You must be logged in to view your items.");
                  navigate("/login"); // Redirect to login if no member_id
                  return;
              }
  
              try {
                  // Call the backend API with member_id in the query params
                  const res = await axios.get(`http://localhost:8800/items/member?member_id=${memberId}`);
                  setItems(res.data); // Update state with the fetched items
              } catch (err) {
                  console.error("Error fetching items:", err);
                  alert("There was an error loading your items.");
              }
          };
  
          fetchItems(); // Trigger the fetch when the component mounts
      }, [memberId, navigate]);
      
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
    // Seller title
    <div className="sellerpage-container">
      <h1 className="sellerpage-title">Welcome to the Seller's portal!</h1>
    {/*Seller Search*/}
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
      <div className ="sellerpage-left">
      <div className="item-grid">
          {items.map((item, index)=>(
            <div className="item-single" key={item.id || index}>
              {item.item_photo && (
                <img src={item.item_photo} alt={item.item_name} />
              )}
              <h2>{item.item_name}</h2>
              <div className="item-details-inline">
              <p>${item.price}</p>
              <p>Size: {item.size}</p>
            </div>
            </div>
          ))}
        </div>
        </div>

 {/* Add Item Form */}
 <div className="sellerpage-right">
                <h1 className="add-item-title">Add New Item</h1>
                
                <form>
                    {/* Item Name */}
                    <input
                        type="text"
                        name="item_name"
                        placeholder="Item Name"
                        value={item.item_name}
                        onChange={handleChange}
                    />

                    {/* Item Condition */}
                    <div>
                        <label>Condition:</label>
                        <div>
                            <input
                                type="radio"
                                name="item_condition"
                                value="New"
                                onChange={handleChange}
                            />
                            <label>New</label>
                            <input
                                type="radio"
                                name="item_condition"
                                value="Used-Barely Worn"
                                onChange={handleChange}
                            />
                            <label>Used - Barely Worn</label>
                            <input
                                type="radio"
                                name="item_condition"
                                value="Used-Old"
                                onChange={handleChange}
                            />
                            <label>Used - Old</label>
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label>Size:</label>
                        <select name="size" value={item.size} onChange={handleChange}>
                            <option value="">Select Size</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                        </select>
                    </div>

                    {/* Description */}
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={item.description}
                        onChange={handleChange}
                    />

                    {/* Price */}
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={item.price}
                        onChange={handleChange}
                    />

                    {/* Item Photo URL */}
                    <input
                        type="text"
                        name="item_photo"
                        placeholder="Item Photo URL"
                        value={item.item_photo}
                        onChange={handleChange}
                    />

                    {/* Submit Button */}
                    <button onClick={handleClick}>Add Item</button>
                </form>
            </div>
        </div>
        
  )
}