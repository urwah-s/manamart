import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import api from "../axios.js";

const MTGList = ({ cards }) => {
    const [cardImages, setCardImages] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            const newImages = {};

            for (const card of cards) {
                try {
                    const res = await api.get(`/api/cards/${card.id}`);
                    const data = res.data;

                    // Try to match the variant using aId
                    const matchingVariant = data.variants.find(v => v.aId === card.aId);

                    // Fallback to Standard Art if aId doesn't match anything
                    const fallbackVariant = data.variants.find(v => v.name === "Standard Art");

                    const selectedVariant = matchingVariant || fallbackVariant;

                    if (selectedVariant?.imageUrl) {
                        newImages[card.id] = selectedVariant.imageUrl;
                    }
                } catch (err) {
                    console.error(`❌ Failed to fetch card ${card.id}:`, err);
                }
            }

            setCardImages(newImages);
        };

        fetchImages();
    }, [cards]);

    return (
        <div className="card-gallery">
            {Array.isArray(cards) ? (
                cards.map((item) => (
                    <Link key={item.id} to={`/cards/${item.id}`}>
                        <img
                            src={cardImages[item.id]}
                            className="logo"
                            alt={item.name}
                        />
                    </Link>
                ))
            ) : (
                <p>No cards data available</p>
            )}
        </div>
    );
};

export default MTGList;
