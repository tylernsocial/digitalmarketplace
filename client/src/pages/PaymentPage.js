import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/CheckoutPage.css'; 

export const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cartItems = location.state?.cartItems || [];
    const memberId = localStorage.getItem("id");
    
    const [paymentInfo, setPaymentInfo] = useState({
        payment_type: 'credit',
        card_number: '',
        expiration_date: '',
        cvc: ''
    });

    const totalCost = cartItems.reduce((sum, item) => {
        return sum + parseFloat(item.price || 0);
    }, 0);

    const formatExpirationDate = (value) => {
        // Remove any non-digit characters
        const cleaned = value.replace(/\D/g, '');
        
        // Add slash after MM if there are more than 2 digits
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          // 1. Create payment record (sending paymentInfo directly)
          const paymentResponse = await axios.post("http://localhost:8800/payments", paymentInfo);
          const paymentId = paymentResponse.data.paymentId;
  
          // 2. Create orders and transactions
          for (const item of cartItems) {
              const orderData = {
                  total_cost: parseFloat(item.price),
                  order_status: "Pending",
                  member_id: parseInt(memberId),
                  items_id: parseInt(item.item_id)
              };
              
              const orderResponse = await axios.post("http://localhost:8800/orders", orderData);
              const orderId = orderResponse.data.orderId;
  
              const transactionData = {
                  transaction_status: "Completed",
                  transaction_date: new Date().toISOString().split('T')[0],
                  total_cost: parseFloat(item.price),
                  order_id: orderId,
                  member_id: parseInt(memberId),
                  payment_id: paymentId
              };
  
              await axios.post("http://localhost:8800/transactions", transactionData);
          }
  
          alert("Payment successful!");
          navigate("/buyer-home-page");
      } catch (error) {
          console.error("Error processing payment:", error);
          alert("There was an error processing your payment: " + (error.response?.data || error.message));
      }
  };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'expiration_date') {
            setPaymentInfo(prev => ({
                ...prev,
                [name]: formatExpirationDate(value)
            }));
        } else if (name === 'card_number') {
            // Only allow numbers
            const cleaned = value.replace(/\D/g, '');
            setPaymentInfo(prev => ({
                ...prev,
                [name]: cleaned
            }));
        } else if (name === 'cvc') {
            // Only allow numbers
            const cleaned = value.replace(/\D/g, '');
            setPaymentInfo(prev => ({
                ...prev,
                [name]: cleaned
            }));
        } else {
            setPaymentInfo(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Payment Information</h1>
            <div className="order-summary" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h2 className="summary-title">Enter Payment Details</h2>
                
                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="payment-field">
                        <label>Payment Type</label>
                        <select
                            name="payment_type"
                            value={paymentInfo.payment_type}
                            onChange={handleInputChange}
                            className="payment-input"
                        >
                            <option value="credit">Credit Card</option>
                            <option value="debit">Debit Card</option>
                        </select>
                    </div>

                    <div className="payment-field">
                        <label>Card Number</label>
                        <input
                            type="text"
                            name="card_number"
                            value={paymentInfo.card_number}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="16"
                            className="payment-input"
                            required
                        />
                    </div>

                    <div className="payment-field">
                        <label>Expiration Date</label>
                        <input
                            type="text"
                            name="expiration_date"
                            value={paymentInfo.expiration_date}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="payment-input"
                            required
                        />
                    </div>

                    <div className="payment-field">
                        <label>CVC</label>
                        <input
                            type="text"
                            name="cvc"
                            value={paymentInfo.cvc}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="4"
                            className="payment-input"
                            required
                        />
                    </div>

                    <div className="total-cost">
                        <h3>Total Amount: ${totalCost.toFixed(2)}</h3>
                    </div>

                    <button 
                        type="submit"
                        className="purchase-button"
                    >
                        Complete Payment
                    </button>
                </form>
            </div>
        </div>
    );
};