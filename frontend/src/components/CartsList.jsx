import React, { useEffect, useState } from 'react';
import './CartsList.css';
import api from "../axios.js";

const CartsList = () => {
    const [groupedCarts, setGroupedCarts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartsAndItems = async () => {
            try {
                const idsRes = await api.get('/api/cart/ids');
                const carts = await idsRes.data;

                const grouped = {};

                await Promise.all(carts.map(async (cart) => {
                    const itemsRes = await api.get(`/api/cart/${cart.cId}/items`);
                    const items = await itemsRes.data;

                    if (Array.isArray(items) && items.length > 0) {
                        grouped[cart.cId] = items;
                    }
                }));

                setGroupedCarts(grouped);
                setLoading(false);
            } catch (err) {
                console.error('❌ Error loading carts and items:', err);
                setLoading(false);
            }
        };

        fetchCartsAndItems();
    }, []);

    return (
        <div className="admin-carts-container">
            <h1 className="admin-carts-title">Shopping Carts List</h1>
            <div className="admin-carts-content">
                {loading ? (
                    <p className="admin-carts-message">Loading carts...</p>
                ) : Object.keys(groupedCarts).length === 0 ? (
                    <p className="admin-carts-message">No active carts found.</p>
                ) : (
                    Object.entries(groupedCarts).map(([cId, items]) => (
                        <div key={cId} className="admin-cart-group">
                            <h4 className="admin-cart-id">🛒 Cart ID: {cId}</h4>
                            <ul className="admin-cart-items">
                                {items.map((item, index) => (
                                    <li key={index} className="admin-cart-item">
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

export default CartsList;
