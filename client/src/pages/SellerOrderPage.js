import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './BuyerOrderPage.css';
import './SellerOrderPage.css';

export const SellerOrderPage = () => {
  const memberId = localStorage.getItem("id"); // get member id
  const memberName = localStorage.getItem("name"); // get member name

  const navigate = useNavigate(); 

  const [orders, setOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);

  const [order] = useState({});

  // handle archive function
  const handleArchive = async (orderId, orderStatus) => {
    try {
        if (orderStatus === "Completed") { // if order status is completed
            await axios.put(`http://localhost:8800/orders/archive/${orderId}`); // bring order to archived
            window.location.reload(); // reload page
        }
    } catch (err) {
        console.error("Error archiving the order:", err);
    }
  };

  // handle status function
  const handleStatus = async (orderId, orderStatus) => {
    try {
      if (orderStatus === "Pending") { // if order status is pending
          await axios.put(`http://localhost:8800/orders/${orderId}`, { // change order status
          order_status: "Shipping" }); // order status to shipping
          window.location.reload(); // Reload to show updated data
      }
    } catch (err) {
      console.log("Error updating item:", err);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!memberId) { // check if member signed in
        alert("You must be logged in to view your orders.");
        navigate("/login");
        return;
      }

      try {
        // get active orders
        const res = await axios.get(`http://localhost:8800/orders/seller/${memberId}?`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching active orders:", err);
        alert("There was an error loading your active orders.");
      }
    };

    const fetchArchivedOrders = async () => {
      if (!memberId) { // check if member signed in
        alert("You must be logged in to view your orders.");
        navigate("/login");
        return;
      }

      try {
        // get archived orders
        const res = await axios.get(`http://localhost:8800/orders/seller/archieved/${memberId}?`);
        setArchivedOrders(res.data);
      } catch (err) {
        console.error("Error fetching archived orders:", err);
        alert("There was an error loading your archived orders.");
      }
    };

    fetchOrders();
    fetchArchivedOrders();
  }, [memberId, navigate]);

  {order.order_status === "Pending" ? (
    // button for when order status is pending
    <button 
      className="ship-order" 
      onClick={() => handleStatus(order.order_id, order.order_status)}> Ship Order
    </button>
  ) : order.order_status === "Completed" && (
    // button for when order status is completed
    <button
      className="ship-order" 
      onClick={() => handleArchive(order.order_id, order.order_status)}> Archive Order
    </button>
  )}

  // front end
  return (
    <div className="sellerorder-container">
      <div className="order-container">
        <button
          className="back-button"
          onClick={() => navigate("/seller-home-page")}> Back
        </button>
      </div>
      <h1 className="sellerpage-title">Welcome to the Seller's Portal, {memberName}!</h1>
      <div className="sellerorder-page">

       {/* Active Orders */}
       <div className="active-orders-container">
          <h2 className="orders-heading">Active Orders</h2>
          {orders.map(order => (
            <div className="order" key={order.order_id}>
              <h3>Order ID: {order.order_id}</h3>
              <h3>Placed By: {order.buyer_fname} {order.buyer_lname}</h3>
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
                {order.item_photo && <img src={order.item_photo} alt={order.item_name} />}
              </div>
              {order.order_status === "Pending" ? (
                <button
                  className="ship-order"
                  onClick={() => handleStatus(order.order_id, order.order_status)}
                >
                  Ship Order
                </button>
              ) : order.order_status === "Completed" && (
                <button
                  className="archive-order"
                  onClick={() => handleArchive(order.order_id, order.order_status)}> Archive Order
                </button>
              )}
            </div>
          ))}
        </div>

      {/* Archived Orders */}
      <div className="archived-orders-container">
          <h2 className="orders-heading">Archived Orders</h2>
          {archivedOrders.map(order => (
            <div className="order" key={order.order_id}>
              <h3>Order ID: {order.order_id}</h3>
              <h3>Placed By: {order.buyer_fname} {order.buyer_lname}</h3>
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
                {order.item_photo && <img src={order.item_photo} alt={order.item_name} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};