import React, { useState } from 'react';
import ShoppingCartsList from '../components/CartsList.jsx';
import OrdersList from '../components/OrdersList.jsx';
import './Admin.css';

const Admin = () => {
    const [selectedView, setSelectedView] = useState('carts');

    const categories = ['Shopping Carts List', 'Orders List'];

    return (
        <div className="admin-container">
            <h1>Admin</h1>

            <div className="admin-card">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedView(category === 'Shopping Carts List' ? 'carts' : 'orders')}
                        className={`admin-category-button ${selectedView === (category === 'Shopping Carts List' ? 'carts' : 'orders') ? 'selected' : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div>
                {selectedView === 'carts' ? (
                    <ShoppingCartsList />
                ) : (
                    <OrdersList />
                )}
            </div>
        </div>
    );
};

export default Admin;
