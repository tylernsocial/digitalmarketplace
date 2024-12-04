import React, { useState, useEffect } from "react";
import './BuyerHomePage.css'; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const BuyerHomePage = () => {
    const memberId = localStorage.getItem("id");

    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]); // State to hold shopping cart items

    useEffect(() => {
      const fetchItems = async () => {
          try {
              const res = await axios.get("http://localhost:8800/items"); // Get all items from the database
              if (Array.isArray(res.data)) {
                  setItems(res.data.filter(item => item.member_id !== memberId)); // Update state with the fetched items, excluding items by the current user
              } else {
                  console.error("Unexpected response when fetching items");
                  setItems([]);
              }
          } catch (err) {
              console.error("Error fetching items:", err);
              alert("There was an error loading the items.");
          }
      };

      fetchItems(); // Trigger the fetch when the component mounts
  }, [memberId]);

  // Add item to cart function
  const addToCart = (item) => {
      setCartItems(prevCart => [...prevCart, item]); // Add the selected item to the cart
  };

  // Remove item from cart function
  const removeFromCart = (itemId) => {
      setCartItems(prevCart => prevCart.filter(item => item.item_id !== itemId)); // Remove item with the given ID
  };

  return (
      <div className="buyerpage-container">
          <h1 className="buyerpage-title">Welcome to the Digital Marketplace!</h1>
          <div className="buyer-content">
              {/* Display Items */}
              <div className="buyer-left">
                  <div className="item-grid">
                      {items.map((item, index) => (
                          <div className="item-single" key={item.item_id || index}>
                              {item.item_photo && (
                                  <img src={item.item_photo} alt={item.item_name} />
                              )}
                              <h2>{item.item_name}</h2>
                              <div className="item-details-inline">
                                  <p>${item.price}</p>
                                  <p>Size: {item.size}</p>
                              </div>
                              <button onClick={() => addToCart(item)}>Add to Cart</button>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Shopping Cart */}
              <div className="buyerpage-right">
                  <h1 className="cart-title">Shopping Cart</h1>
                  <div className="cart-items">
                      {cartItems.length === 0 ? (
                          <p>Your cart is empty.</p>
                      ) : (
                          cartItems.map((cartItem, index) => (
                              <div className="cart-item" key={cartItem.item_id || index}>
                                  <h2>{cartItem.item_name}</h2>
                                  <p>Price: ${cartItem.price}</p>
                                  <p>Size: {cartItem.size}</p>
                                  <p>Description: {cartItem.description}</p> {/* Add more details */}
                                  <button onClick={() => removeFromCart(cartItem.item_id)}>Remove from Cart</button> {/* Remove button */}
                              </div>
                          ))
                      )}
                  </div>
                  <div className="checkout-button-container">
                      <button className="checkout-button">Checkout</button>
                  </div>
              </div>
          </div>
      </div>
  );
};
