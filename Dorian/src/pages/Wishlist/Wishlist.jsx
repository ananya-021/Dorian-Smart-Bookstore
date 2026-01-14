import React from 'react';
import './Wishlist.css';

const Wishlist = ({ wishlist }) => {
  return (
    <div className="wishlist-page">
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty. Add some books!</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((book, i) => (
            <div className="book-card" key={i}>
              <img src={book.thumbnail} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.authors}</p>
              <p className="rating">Rating: {book.similarity ? (book.similarity*5).toFixed(1) : "4.5"} ⭐</p>
              <span className="price">{book.price || `₹${Math.floor(Math.random() * 500) + 200}`}</span>
              <div className="book-actions">
                <button className="cart-btn">🛒 Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist;
