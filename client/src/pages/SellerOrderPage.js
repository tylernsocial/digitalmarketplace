import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './BuyerOrderPage.css';
import './SellerOrderPage.css';

export const SellerOrderPage = () => {
  const memberId = localStorage.getItem("id");
  const memberName = localStorage.getItem("name");

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [archivedOrders, setArchivedOrders] = useState([]);

  const [order, addOrder] = useState({
    order_status: "",
    member_id: memberId // Automatically add member_id to the item object
  });

  const handleArchive = async (orderId, orderStatus) => {
    try {
        if (orderStatus === "Completed") {
            // Update the order to archived
            await axios.put(`http://localhost:8800/orders/archive/${orderId}`);
            window.location.reload(); // Reload to reflect the changes
        } else {
            alert("Only completed orders can be archived.");
        }
    } catch (err) {
        console.error("Error archiving the order:", err);
        alert("There was an error archiving the order.");
    }
};

  const handleStatus = async (orderId, orderStatus) => {
    try {
      if (orderStatus === "Pending") {
          await axios.put(`http://localhost:8800/orders/${orderId}`, {
          order_status: "Shipping",
        });
      window.location.reload(); // Reload to show updated data
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
        const res = await axios.get(`http://localhost:8800/orders/seller/${memberId}?`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching active orders:", err);
        alert("There was an error loading your active orders.");
      }
    };

    const fetchArchivedOrders = async () => {
      if (!memberId) {
        alert("You must be logged in to view your orders.");
        navigate("/login");
        return;
      }

      try {
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
    <button 
        className="ship-order" 
        onClick={() => handleStatus(order.order_id, order.order_status)}
    >
        Ship Order
    </button>
) : order.order_status === "Completed" && (
  <button
    className="ship-order" 
    onClick={() => handleArchive(order.order_id, order.order_status)}>
    Archive Order
  </button>
)}


  return (
    <div className="sellerorder-container">
      <div className="order-container">
      <button
      className="back-button"
      onClick={() => navigate("/seller-home-page")}
    >
      Back
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
                  onClick={() => handleArchive(order.order_id, order.order_status)}
                >
                  Archive Order
                </button>
              )}
            </div>
          ))}
        </div>
  {/* Archived Orders */}
  <div className="archived-orders-container">
    <div>
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
    </div>
  );
};