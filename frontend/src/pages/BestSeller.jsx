import './BestSeller.css';
import { useState, useEffect } from "react";
import MTGList from "../components/MTGList.jsx";
import api from "../axios.js";

function BestSeller() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await api.get('/api/categories/best-seller/cards');
                setCards(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch best sellers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    return (
        <div className="container">
            <h1>⭐ best sellers ⭐</h1>
            <div className="sellerContainer">
                {loading ? (
                    <p>Loading best-seller cards...</p>
                ) : (
                    <MTGList cards={cards} />
                )}
            </div>
        </div>
    );
}

export default BestSeller;
