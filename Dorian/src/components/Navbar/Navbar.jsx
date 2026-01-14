import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search.png";
import login_icon from "../../assets/login.png";
import wishlist_icon from "../../assets/wishlist.png";
import order_icon from "../../assets/order.png";
import home_icon from "../../assets/home.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ allBooks, setBooks, setSearchQuery }) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
  const query = input.trim().toLowerCase();

  // Save the search query for highlighting (optional)
  setSearchQuery(query);

  // If empty, show all books
  if (!query) {
    setBooks(allBooks);
    navigate("/books");
    return;
  }

  // Only search by title
  const filteredBooks = allBooks.filter((book) =>
    (book.title || "").trim().toLowerCase().includes(query)
  );

  setBooks(filteredBooks);
  navigate("/books");
  setInput("");
};


  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Dorian logo" className="navbar-logo" />
        <div className="navbar-text">
          <h1>DORIAN</h1>
          <h3>I feel like buying books</h3>
        </div>
      </div>

      <div className="navbar-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search books..."
            className="search-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnterKey}
          />
          <img
            src={search_icon}
            alt="icon"
            className="search-icon"
            onClick={handleSearch}
          />
        </div>

        <Link to="/" className="icon-btn">
          <img src={home_icon} alt="Home" className="icon" />
        </Link>
        <Link to="/wishlist" className="icon-btn">
          <img src={wishlist_icon} alt="Wishlist" className="icon" />
        </Link>
        <Link to="/cart" className="icon-btn">
          <img src={order_icon} alt="Order" className="icon" />
        </Link>
        <Link to="/login" className="icon-btn">
          <img src={login_icon} alt="Login" className="icon" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
