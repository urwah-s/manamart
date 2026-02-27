import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './OrderConfirmation.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../axios';

const OrderConfirmation = () => {
    const cartItems = useSelector(state => state.cart);
    const [name, setName] = useState('');
    const cartId = localStorage.getItem('cartId');
    const [orderId, setOrderId] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);

    const total = cartItems.reduce((sum, item) => sum + (item.noOfItem * item.price), 0);

    const handleCheckout = async () => {
        if (!name.trim()) {
            toast.error("Please enter your name to place the order.");
            return;
        }

        const orderData = {
            cId: cartId,
            name,
            items: cartItems.map(item => ({
                pId: item.id,
                aId: item.aId,
                quantity: item.noOfItem,
                name: item.name,
                variantName: item.variantName,
                imageUrl: item.imageUrl,
                price: item.price
            }))
        };

        try {
            const res = await api.post('/api/order', orderData);

            if (res.status !== 201) {
                throw new Error('Failed to place order');
            }

            setOrderId(res.data.oId);
            setOrderPlaced(true);
            toast.success('Order placed successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="cart-container">
            <h1 className="cart-title">your order</h1>
            <div className="cart-content">
                <div className="cart-table">
                    <div className="cart-header">
                        <span>Product</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>Total</span>
                    </div>
                    {cartItems.length === 0 ? (
                        <p className="empty-message">Your cart is empty.</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="cart-row">
                                <div className="product-info">
                                    <span>{item.name}</span>
                                    {item.variantName && (
                                        <div className="variant-subtext">{item.variantName}</div>
                                    )}
                                </div>
                                <span>${item.price}</span>
                                <div className="quantity-control">
                                    <span>{item.noOfItem}</span>
                                </div>
                                <span>${(item.noOfItem * item.price).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>
                {orderPlaced ? (
                    <div className="summary-box">
                        <h3>Thank you, {name}!</h3>
                        <p>Your order has been placed.</p>
                        <p><strong>Order Number:</strong> {orderId}</p>
                    </div>
                ) : (
                    <div className="summary-box">
                        <h3>Subtotal</h3>
                        <p>${total.toFixed(2)}</p>

                        <input
                            type="text"
                            className="name-input"
                            placeholder="Enter your name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <button
                            className="checkout-button"
                            onClick={handleCheckout}
                        >
                            Place Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderConfirmation;
