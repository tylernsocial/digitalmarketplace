import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

export const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rawCartItems = location.state?.cartItems || [];

    // Process cart items to ensure all fields have values
    const cartItems = rawCartItems.map(item => ({
        ...item,
        item_name: item.item_name || 'N/A',
        item_condition: item.item_condition || 'N/A',
        size: item.size || 'N/A',
        description: item.description || 'N/A',
        price: item.price || '0.00',
        item_photo: item.item_photo || '/placeholder-image.jpg'
    }));

    // Calculate total cost with validation
    const totalCost = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + price;
    }, 0);

    // Simple navigation to payment page with cart items
    const handlePurchase = () => {
        navigate('/payment', { 
            state: { 
                cartItems: cartItems,
                totalCost: totalCost 
            } 
        });
    };

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Checkout</h1>
            <div className="order-summary">
                <h2 className="summary-title">Order Summary</h2>
                <div className="checkout-grid">
                    {cartItems.map((item, index) => (
                        <div key={index} className="checkout-item">
                            <div className="item-image">
                                <img 
                                    src={item.item_photo} 
                                    alt={item.item_name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                            <div className="item-info">
                                <h3 className="item-name">{item.item_name}</h3>
                                <div className="item-details-list">
                                    <div className="detail-row">
                                        <span>Condition:</span>
                                        <span>{item.item_condition}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Size:</span>
                                        <span>{item.size}</span>
                                    </div>
                                    <div className="detail-row description">
                                        <span>Description:</span>
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="detail-row price">
                                        <span>Price:</span>
                                        <span>${parseFloat(item.price).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="total-cost">
                    <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
                </div>
                <button className="purchase-button" onClick={handlePurchase}>
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};