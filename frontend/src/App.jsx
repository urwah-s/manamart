import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import CardsList from "./pages/CardsList.jsx";
import Search from "./pages/Search.jsx";
import BestSeller from "./pages/BestSeller.jsx";
import CardDetails from "./pages/CardDetails.jsx";
import Cart from "./pages/Cart.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import Admin from './pages/Admin.jsx';
import { v4 as uuidv4 } from 'uuid';
import {useEffect} from "react";
import {ToastContainer} from "react-toastify";
import api from './axios';

function App() {
    useEffect(() => {
        let cartId = localStorage.getItem('cartId');
        console.log('cartId from localStorage:', cartId);

        if (!cartId) {
            cartId = uuidv4();
            localStorage.setItem('cartId', cartId);
            console.log('Generated new cartId:', cartId);

            api.post('/api/cart', { cId: cartId })
                .then(res => {
                    console.log('Cart POST response:', res.data);
                })
                .catch(err => {
                    console.error('POST request failed:', err);
                });
        }
    }, []);


    return (
        <>
        <Router>
            <div className="background">
                <NavBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cards" element={<CardsList />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/bestSeller" element={<BestSeller />} />
                        <Route path="/cards/:id" element={<CardDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orderConfirmation" element ={<OrderConfirmation />} />
                        <Route path="/admin" element ={<Admin />} />
                    </Routes>
            </div>
        </Router>
        <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={false} />
        </>
    );
}

export default App;
