import React from "react";
import "./Books.css";

const Books = ({ books, wishlist, setWishlist, cart, setCart }) => {
  // If no books are available, show a message
  if (books.length === 0) {
    return (
      <div className="books-page">
        <h2>Recommended For You</h2>
        <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
          😔 No books found matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="books-page">
      <h2>Recommended For You</h2>

      <div className="book-results">
        {books.map((book, i) => (
          <div className="book-card" key={i}>
            <img src={book.thumbnail} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.authors}</p>
            <span className="price">₹{book.price}</span>

            <div className="book-actions">
              <button
                onClick={() =>
                  !wishlist.find((b) => b.title === book.title) &&
                  setWishlist([...wishlist, book])
                }
              >
                ❤️ Wishlist
              </button>

              <button
                onClick={() =>
                  !cart.find((b) => b.title === book.title) &&
                  setCart([...cart, { ...book, quantity: 1 }])
                }
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
