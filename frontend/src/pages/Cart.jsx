import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Cart.css';
import api from '../axios';

const Cart = () => {
    const cartItems = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartId = localStorage.getItem('cartId');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get(`/api/cart/${cartId}/items`);
                const data = res.data;

                const formatted = data.map(item => ({
                    id: item.pId,
                    aId: item.aId,
                    name: item.name,
                    noOfItem: item.quantity,
                    variantName: item.variantName,
                    imageUrl: item.imageUrl,
                    price: item.price,
                }));

                dispatch({ type: 'SET_CART', payload: formatted });
            } catch (err) {
                console.error('Failed to load cart from backend:', err);
            }
        };

        fetchCart();
    }, [dispatch, cartId]);

    const increaseQuantity = async (item) => {
        dispatch({ type: 'ADD', payload: { ...item, noOfItem: 1 } });

        try {
            await api.post(`/api/cart/${cartId}/items`, {
                name: item.name,
                pId: item.id,
                aId: item.aId,
                quantity: 1,
                variantName: item.variantName,
                imageUrl: item.imageUrl,
                price: item.price,
            });

            toast.success('Quantity increased!');
        } catch (err) {
            console.error('Failed to increase card quantity:', err);
            toast.error('Network error increasing quantity.');
        }
    };

    const decreaseQuantity = async (item) => {
        try {
            const res = await api.patch(`/api/cart/${cartId}/items/${item.id}/${item.aId}/decrease`);
            const data = res.data;

            if (res.status === 200) {
                if (data.item) {
                    dispatch({ type: 'DECREASE', payload: { id: item.id, aId: item.aId } });
                    toast.info('Quantity decreased');
                } else {
                    dispatch({ type: 'DELETE', payload: { id: item.id, aId: item.aId } });
                    toast.warn('Item removed from cart');
                }
            }
        } catch (err) {
            console.error('Error decreasing quantity:', err);
            toast.error('Network error decreasing quantity');
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (item.noOfItem * item.price), 0);

    const handleCheckout = () => {
        navigate('/orderConfirmation');
    };

    return (
        <div className="cart-container">
            <h1 className="cart-title">your cart</h1>
            <div className="cart-content">
                <div className="cart-table">
                    <div className="cart-header">
                        <span>Product</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>Total</span>
                    </div>
                    {cartItems.length === 0 ? (
                        <p className="empty-message">Your order is empty.</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="cart-row">
                                <div className="product-info">
                                    <img src={item.imageUrl} alt={item.name} className="product-image" />
                                    <span>{item.name}</span>
                                    {item.variantName && (
                                        <div className="variant-subtext">{item.variantName}</div>
                                    )}
                                </div>
                                <span>${item.price}</span>
                                <div className="quantity-control">
                                    <button onClick={() => decreaseQuantity(item)}>-</button>
                                    <span>{item.noOfItem}</span>
                                    <button onClick={() => increaseQuantity(item)}>+</button>
                                </div>
                                <span>${(item.noOfItem * item.price).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>
                <div className="cart-summary">
                    <div className="summary-box">
                        <h3>Subtotal</h3>
                        <p>${total.toFixed(2)}</p>
                        <button className="checkout-button" onClick={handleCheckout}>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
