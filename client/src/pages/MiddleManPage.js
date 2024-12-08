import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './SellerOrderPage.css';

export const MiddleManPage = () => {
  const memberId = localStorage.getItem("id");
  const memberName = localStorage.getItem("name");
  

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);


  const handleStatus = async (orderId, orderStatus) => {
    try {
        if (orderStatus === "Order Received") { 
            await axios.put(`http://localhost:8800/orders/${orderId}`, {
                order_status: "Completed",
                funds_released: true // flag
            });
            window.location.reload();
        }
    } catch (err) {
        console.log("Error updating item:", err);
    }
};

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
        <h1 className="sellerpage-title">Welcome to Your Portal, {memberName}!</h1>
        <div className="middleman-page">
            {orders.map((order) => (
                <div className="order" key={order.order_id}>
                    <h3>Order ID: {order.order_id}</h3>
                    <h3>Buyer: {order.buyer_fname + " " + order.buyer_lname}</h3>
                    <h3>Seller: {order.seller_fname + " " + order.seller_lname}</h3>
                    <h3>Total Cost: ${parseFloat(order.cost).toFixed(2)}</h3>

                    <div className="order-details">
                        <h4>Item Details:</h4>
                        <p>Item Name: {order.item_name}</p>
                        <p>Price: ${parseFloat(order.price).toFixed(2)}</p>
                    </div>
                    
                    <div className="order-status">
                        <h4>Order Status: {order.order_status}</h4>
                        <h4>Funds Status: {order.funds_released ? 'Released' : 'Pending'}</h4>
                        {order.item_photo && (
                            <img 
                                className="order-photo"
                                src={order.item_photo} 
                                alt={order.item_name} 
                            />
                        )}
                    </div>

                    {order.order_status === "Order Received" && !order.funds_released && (
                        <button 
                            className="release-funds" 
                            onClick={() => handleStatus(order.order_id, order.order_status)}
                        >
                            Release Funds
                        </button>
                    )}
                </div>
            ))}
        </div>
    </div>
);
};

