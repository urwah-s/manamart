import './Home.css';
import {useEffect, useState} from "react";
import MTGList from "../components/MTGList.jsx";
import api from "../axios.js";

function Home() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await api.get('/api/categories/best-seller/cards');
                setCards(res.data);
                setLoading(false);
            } catch (err) {
                console.error("❌ Failed to fetch best sellers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    return (
        <div className="homePageContainer">
            <h1>welcome to manamart</h1>
            <div className="sellerContainer">
                <h2>⭐ Best Sellers ⭐</h2>
                {loading ? (
                    <p>Loading best-seller cards...</p>
                ) : (
                    <MTGList cards={cards}/>
                )}
            </div>
        </div>
    );
}

export default Home;