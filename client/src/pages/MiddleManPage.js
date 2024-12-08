import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './BuyerOrderPage.css';

export const MiddleManPage = () => {
    const memberId = localStorage.getItem("id");
    const memberName = localStorage.getItem("name");
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const handleStatus = async (orderId, orderStatus) => {
        try {
            if (orderStatus === "Order Received") {
                await axios.put(`http://localhost:8800/orders/${orderId}`, {
                    order_status: "Completed",
                    funds_released: true
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
                navigate("/login");
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8800/orders`);
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                alert("There was an error loading your orders.");
            }
        };

        fetchOrders();
    }, [memberId, navigate]);

    return (
        <div className="buyerorder-container">
            <button className="back-button">
                <Link to="/">Logout</Link>
            </button>
            
            <h1 className="buyerpage-title">Welcome to Your Portal, {memberName}!</h1>

            <div className="buyerorder-page">
                <div className="orders-container">
                    <h2 className="section-title">All Orders</h2>
                    <div className="orders-grid">
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
                                            src={order.item_photo} 
                                            alt={order.item_name} 
                                        />
                                    )}
                                </div>

                                {order.order_status === "Order Received" && !order.funds_released && (
                                    <button 
                                        className="receive-order"
                                        onClick={() => handleStatus(order.order_id, order.order_status)}
                                    >
                                        Release Funds
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};