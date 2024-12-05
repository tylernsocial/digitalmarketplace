import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './SellerOrderPage.css';

export const SellerOrderPage = () => {
  const memberId = localStorage.getItem("id");
  const memberName = localStorage.getItem("name");

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!memberId) {
        alert("You must be logged in to view your orders.");
        navigate("/login"); // Redirect to login if no member_id
        return;
      }

      try {
        // Call the backend API to fetch orders
        const res = await axios.get(`http://localhost:8800/orders`);
        setOrders(res.data); // Update state with the fetched orders
      } catch (err) {
        console.error("Error fetching orders:", err);
        alert("There was an error loading your orders.");
      }
    };

    fetchOrders(); // Trigger the fetch when the component mounts
  }, [memberId, navigate]);

  return (
    <div className="sellerorder-container">
      <h1 className="sellerpage-title">Welcome to the Seller's Portal, {memberName}!</h1>

      {/* Display Orders */}
      <div className="sellerorder-page">
        <div className="item-grid">
          {orders.map((order) => (
            <div className="item-single" key={order.order_id}>
              <h2>Order ID: {order.order_id}</h2>
              <h2>Total Cost: ${order.total_cost}</h2>
              <h3>Item Details:</h3>
              <p>Item Name: {order.item_name}</p>
              <p>Price: ${order.price}</p>
              <p>Description: {order.description}</p>
              {order.item_photo && (
                <img src={order.item_photo} alt={order.item_name} style={{ width: "200px" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
