import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './SellerOrderPage.css';

export const SellerOrderPage = () => {
  const memberId = localStorage.getItem("id");
  const memberName = localStorage.getItem("name");

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [order, addOrder] = useState({
    order_status: "",
    member_id: memberId // Automatically add member_id to the item object
  });

  const handleDelete = async (itemId, orderStatus) => {
    try{
      if (orderStatus == "Completed"){
      await axios.delete(`http://localhost:8800/items/${itemId}`)
      window.location.reload()
      }
    } catch(err){
      console.log(err)
    }
  }
  const handleStatus = async (orderId, orderStatus) => {
    try {
      if (orderStatus == "Pending") {
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
        navigate("/login"); // Redirect to login if no seller_id
        return;
      }
  
      try {
        // Fetch orders for items sold by the logged-in seller
        const res = await axios.get(`http://localhost:8800/orders`)// Send member_id as a query parameter
        console.log("Fetched Orders:", res.data); // Debugging log
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
          {orders.map((order) => (
            <div className="order" key={order.order_id}>
              <h3>Order ID: {order.order_id}</h3>
              <h3>Placed By: {order.fname + " " + order.lname}</h3>
              <h3>Total Cost: ${order.total_cost}</h3>

              <div className="order-details">
        <h4>Item Details:</h4>
        <p>Item Name: {order.item_name}</p>
        <p>Price: ${order.price}</p>
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

      <button 
        className="ship-order" 
        onClick={() => handleStatus(order.order_id, order.order_status)}
      >
        Ship Order
      </button>
      <button
        className="delete-item"
        onClick={() => handleDelete(order.item_id, order.order_status)}>
        Delete Item
      </button>
    </div>
  ))}
</div>
    </div>
  );
};
