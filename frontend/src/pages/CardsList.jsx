import React, { useEffect, useState } from 'react';
import '../App.css';
import MTGList from '../components/MTGList.jsx';
import api from "../axios.js";

export default function CardsList() {
    const [cards, setCards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/api/categories');
                setCategories(['All', ...res.data]);
            } catch (err) {
                console.error('❌ Failed to fetch categories:', err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            try {
                const res =
                    selectedCategory === 'All'
                        ? await api.get('/api/cards')
                        : await api.get(`/api/categories/${encodeURIComponent(selectedCategory)}/cards`);

                setCards(res.data);
            } catch (err) {
                console.error('❌ Failed to fetch cards:', err);
                setCards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [selectedCategory]);

    return (
        <>
            <h1>magic: the gathering cards</h1>

            {loading ? (
                <p>Loading cards...</p>
            ) : (
                <>
                    <div className="card">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <MTGList cards={cards}/>
                </>
            )}
        </>
    );
}
