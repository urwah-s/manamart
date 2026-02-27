import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../App.css';
import './CardDetails.css';
import api from "../axios.js";

export default function CardDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [card, setCard] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const res = await api.get(`/api/cards/${id}`);
                const data = res.data;

                setCard(data);
                setVariants(data.variants || []);

                const standard = data.variants.find(v => v.name === "Standard Art");
                setSelectedVariant(standard);

            } catch (err) {
                console.error('❌ Failed to fetch card:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [id]);

    const addToCart = async () => {
        const cartId = localStorage.getItem('cartId');

        try {
            await api.post(`/api/cart/${cartId}/items`, {
                pId: card.id,
                aId: selectedVariant.aId,
                name: card.name,
                quantity: 1,
                variantName: selectedVariant.name,
                imageUrl: selectedVariant.imageUrl,
                price: selectedVariant.price
            });

            dispatch({
                type: "ADD",
                payload: {
                    ...card,
                    noOfItem: 1,
                    aId: selectedVariant.aId,
                    variantName: selectedVariant.name,
                    price: selectedVariant.price,
                    imageUrl: selectedVariant.imageUrl
                }
            });

            toast.success(`${card.name} added to cart!`);
        } catch (error) {
            console.error('Add to cart failed:', error);
            toast.error('Failed to add item to cart');
        }
    };


    if (loading) return <p>Loading card details...</p>;
    if (!card || !selectedVariant) return <p>Card not found or missing variant.</p>;

    return (
        <div className="card-details-container">
            <div className="card-details-flex">
                <div className="card-left">
                    <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                    <img
                        src={selectedVariant.imageUrl}
                        alt={card.name}
                        className="card-image"
                    />
                </div>
                <div className="card-info">
                    <h1>{card.name}</h1>
                    <p><strong>Price:</strong> ${selectedVariant.price}</p>
                    <p><strong>Category:</strong> {card.category}</p>
                    <p><strong>Description:</strong> {card.description}</p>

                    {/* Variant Options */}
                    <div style={{marginTop: '1rem'}}>
                        <strong>Available Variants:</strong>
                        <div className="variant-selector">
                            {variants.map((variant, index) => (
                                <span
                                    key={variant.name}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`variant-link ${selectedVariant.name === variant.name ? 'selected' : ''}`}
                                >
                                    {variant.name}
                                    {index !== variants.length - 1 && <span className="separator"> / </span>}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        className="add-to-cart-button"
                        onClick={() => {
                            addToCart();
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
