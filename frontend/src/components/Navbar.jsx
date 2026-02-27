import { Link } from 'react-router-dom';
import './NavBar.css';

// Nav bar design: https://dribbble.com/shots/22170684-Aspire-Digital-Credit-Card-Website

export default function NavBar() {
    return (
        <nav className="navbar">

            <div className="navbar-logo">
                <div className="navbar-logo-icon" />
                <span className="navbar-logo-text">manamart</span>
            </div>


            <div className="navbar-links">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/cards">Cards</Link>
                <span>/</span>
                <Link to="/bestSeller">Best Sellers</Link>
                <span>/</span>
                <Link to="/search">Search</Link>
                <span>/</span>
                <Link to="/admin">Admin</Link>
            </div>

            <Link to="/cart" className="navbar-cart">Cart</Link>
        </nav>
    );
}
