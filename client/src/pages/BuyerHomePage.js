import React, { useState, useEffect } from "react";
import './BuyerHomePage.css'; 
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const BuyerHomePage = () => {
    const memberId = localStorage.getItem("id");
    const navigate = useNavigate(); 

    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]); // State to hold shopping cart items
    const [orderStatuses, setOrderStatuses] = useState({});

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get("http://localhost:8800/items");
                if (Array.isArray(res.data)) {
                    setItems(res.data.filter(item => item.member_id !== memberId));
                } else {
                    console.error("Unexpected response when fetching items");
                    setItems([]);
                }
            } catch (err) {
                console.error("Error fetching items:", err);
                alert("There was an error loading the items.");
            }
        };
    
        const fetchOrderStatuses = async () => {
            try {
                const res = await axios.get("http://localhost:8800/orders");
                const statuses = {};
                res.data.forEach(order => {
                    statuses[order.items_id] = order.order_status;
                });
                setOrderStatuses(statuses);
            } catch (err) {
                console.error("Error fetching order statuses:", err);
            }
        };
    
        // Call both functions
        const fetchData = async () => {
            await fetchItems();
            await fetchOrderStatuses();
        };
    
        fetchData();
    }, [memberId]);


  // Add item to cart function
  const addToCart = (item) => {
    if (orderStatuses[item.item_id]) {
        alert("This item is currently under purchase");
        return;
    }
    
    const validatedItem = {
        ...item,
        item_name: item.item_name || 'N/A',
        item_condition: item.item_condition || 'N/A',
        size: item.size || 'N/A',
        description: item.description || 'N/A',
        price: item.price || '0.00',
        item_photo: item.item_photo || '/placeholder-image.jpg'
    };
    setCartItems(prevCart => [...prevCart, validatedItem]);
};


  // Remove item from cart function
  const removeFromCart = (itemId) => {
      setCartItems(prevCart => prevCart.filter(item => item.item_id !== itemId)); // Remove item with the given ID
  };

    // Add this function
    const handleCheckout = () => {
        navigate('/checkout-page', { state: { cartItems } });
    };

  return (
      <div className="buyerpage-container">
          <h1 className="buyerpage-title">Welcome to the Digital Marketplace!</h1>
          <div className="order-container">
            <button className="checkorders">
                <Link to="/buyer-orders">Check Orders</Link>
            </button>
            <button className="back-button">
                <Link to="/">Logout</Link>
            </button>
        </div>
          <div className="buyer-content">
              {/* Display Items */}
              <div className="buyer-left">
                  <div className="item-grid">
                  {items.map((item, index) => (
                    <div 
                        className={`item-single ${orderStatuses[item.item_id] ? 'item-unavailable' : ''}`} 
                        key={item.item_id || index}
                    >
                        {item.item_photo && (
                            <img src={item.item_photo} alt={item.item_name} />
                        )}
                        <h2>{item.item_name}</h2>
                        <div className="item-details-inline">
                            <p>${item.price}</p>
                            <p>Size: {item.size}</p>
                        </div>
                        <button 
                            onClick={() => addToCart(item)}
                            disabled={orderStatuses[item.item_id]}
                        >
                            {orderStatuses[item.item_id] ? 'Under Purchase' : 'Add to Cart'}
                        </button>
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
                                <div className="cart-item-image">
                                    {cartItem.item_photo && (
                                        <img src={cartItem.item_photo} alt={cartItem.item_name} />
                                    )}
                                </div>
                                <div className="cart-item-details">
                                    <h2>{cartItem.item_name}</h2>
                                    <p data-label="Price: ">${cartItem.price}</p>
                                    <p data-label="Condition: ">{cartItem.item_condition}</p>
                                    <p data-label="Size: ">{cartItem.size}</p>
                                    <p data-label="Description: ">{cartItem.description}</p>
                                    <button onClick={() => removeFromCart(cartItem.item_id)}>Remove from Cart</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            <div className="checkout-button-container">
                <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    </div>
</div>
  );
};
