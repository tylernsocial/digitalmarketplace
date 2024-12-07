// BuyerOrderPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './BuyerOrderPage.css';

export const BuyerOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const memberId = localStorage.getItem("id");
    const memberName = localStorage.getItem("name");
    const navigate = useNavigate();

    // Handle order received
    const handleOrderReceived = async (orderId, orderStatus) => {
        try {
            // Only allow status update if order is in "Shipping" status
            if (orderStatus === "Shipping") {
                await axios.put(`http://localhost:8800/orders/${orderId}`, {
                    order_status: "Order Received" 
                });
                window.location.reload();
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Error updating order status");
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!memberId) {
                alert("You must be logged in to view your orders.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8800/orders/buyer/${memberId}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                alert("Error loading orders");
            }
        };

        fetchOrders();
    }, [memberId, navigate]);

    return (
        <div className="buyerorder-container">
            <div className="order-container">
            <button className="buyerback-button">
                <Link to="/buyer-home-page">Back</Link>
            </button>
            </div>
            <h1 className="buyerpage-title">Welcome to the Buyer's Portal, {memberName}!</h1>

            <div className="buyerorder-page">
                {orders.map((order) => (
                    <div className="order" key={order.order_id}>
                        <h3>Order ID: {order.order_id}</h3>
                        <h3>Seller: {order.seller_fname + " " + order.seller_lname}</h3>
                        <h3>Total Cost: ${parseFloat(order.cost).toFixed(2)}</h3>

                        <div className="order-details">
                            <h4>Item Details:</h4>
                            <p>Item Name: {order.item_name}</p>
                            <p>Price: ${parseFloat(order.price).toFixed(2)}</p>
                            <p>Size: {order.size}</p>
                            <p>Condition: {order.item_condition}</p>
                        </div>

                        <div className="order-status">
                            <h4>Order Status: {order.order_status}</h4>
                            {order.item_photo && (
                                <img 
                                    src={order.item_photo} 
                                    alt={order.item_name} 
                                />
                            )}
                        </div>

                        {order.order_status === "Shipping" && (
                            <button 
                                className="receive-order"
                                onClick={() => handleOrderReceived(order.order_id, order.order_status)}
                            >
                                Order Received
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};