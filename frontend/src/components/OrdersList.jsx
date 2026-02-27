import React, { useEffect, useState } from 'react';
import './CartsList.css';
import api from "../axios.js";

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/api/order');
                setOrders(res.data);
            } catch (err) {
                console.error('Error loading orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="admin-carts-container">
            <h1 className="admin-carts-title">Orders List</h1>
            <div className="admin-carts-content">
                {loading ? (
                    <p className="admin-carts-message">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className="admin-carts-message">No orders found.</p>
                ) : (
                    orders.map((order, index) => (
                        <div key={index} className="admin-cart-group">
                            <h4 className="admin-cart-id">📦 Order ID: {order.oId}</h4>
                            <p><strong>Shopper:</strong> {order.name}</p>
                            <ul className="admin-cart-items">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="admin-cart-item">
                                        {item.name} ({item.variantName}) — Qty: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrdersList;
