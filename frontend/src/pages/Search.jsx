import React, { useState } from 'react';
import './Search.css';
import MTGList from '../components/MTGList.jsx';
import api from '../axios';  // import your axios instance

export default function Search() {
    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setHasSearched(true);
        setLoading(true);
        setError('');

        try {
            const res = await api.get('/api/cards/search', {
                params: { q: searchTerm }
            });

            setCards(res.data);
        } catch (err) {
            const message = err.response?.data?.error || '❌ Failed to fetch search results';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-page">
            <h1 className="search-title">search</h1>
            <p className="search-subtitle">Find Magic: The Gathering cards by keyword</p>

            <div className="search-input-wrapper">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search by name, description, category, or variant"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{color: '#f25c5c'}}>{error}</p>}
            {hasSearched && !loading && cards.length === 0 && !error && (
                <p style={{marginTop: '2rem', textAlign: 'center'}}>No products found.</p>
            )}
            {cards.length > 0 && <MTGList cards={cards} />}
        </div>
    );
}
