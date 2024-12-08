// BuyerOrderPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyerOrderPage.css';

export const BuyerOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const memberId = localStorage.getItem("id");
    const memberName = localStorage.getItem("name");
    const navigate = useNavigate();

    // Handle order received
    const handleOrderReceived = async (orderId, orderStatus) => {
        try {
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

    useEffect(() => {
        const fetchData = async () => {
            if (!memberId) {
                alert("You must be logged in to view your orders.");
                navigate("/login");
                return;
            }

            try {
                // Fetch both orders and transactions
                const [ordersResponse, transactionsResponse] = await Promise.all([
                    axios.get(`http://localhost:8800/orders/buyer/${memberId}`),
                    axios.get(`http://localhost:8800/transactions/buyer/${memberId}`)
                ]);
                
                setOrders(ordersResponse.data);
                setTransactions(transactionsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Error loading data");
            }
        };

        fetchData();
    }, [memberId, navigate]);


    return (
        <div className="buyerorder-container">
            <h1 className="buyerpage-title">Welcome to the Buyer's Portal, {memberName}!</h1>
            <div className="buyerorder-page">
                <div className="orders-container">
                    <h2 className="section-title">Current Orders</h2>
                    <div className="orders-grid">
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
    
                <div className="transactions-container">
                    <h2 className="section-title">Transaction History</h2>
                    <div className="transactions-grid">
                        {transactions.map((transaction) => (
                            <div className="order" key={transaction.transaction_id}>
                                <h3>Transaction ID: {transaction.transaction_id}</h3>
                                <div className="order-details">
                                    <p>Date: {new Date(transaction.transaction_date).toLocaleDateString()}</p>
                                    <p>Payment Status: {transaction.transaction_status}</p>
                                    <p>Cost: ${parseFloat(transaction.total_cost).toFixed(2)}</p>
                                    <p>Payment Type: {transaction.payment_type}</p>
                                    <p>Seller: {transaction.seller_fname} {transaction.seller_lname}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};