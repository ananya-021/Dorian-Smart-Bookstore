import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Papa from "papaparse";

import Navbar from "./components/Navbar/Navbar";
import Books from "./pages/Books/Books";
import Home from "./pages/Home/Home";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";

const App = () => {
  const [allBooks, setAllBooks] = useState([]); // all CSV books with prices
  const [books, setBooks] = useState([]);       // books to display
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // NEW: for highlighting

  const generatePrice = () => Math.floor(Math.random() * 500) + 200;

  useEffect(() => {
    // Load CSV once
    Papa.parse("/books.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    console.log("Books loaded:", results.data); // sanity check
    const parsedBooks = results.data.map((book) => ({
      title: (book.title || "Unknown Title").trim(),
      authors: (book.authors || "Unknown Author").trim(),
      thumbnail: book.thumbnail || "https://via.placeholder.com/150",
      price: generatePrice(),
    }));
    setAllBooks(parsedBooks);
    setBooks(parsedBooks);
  },
});


  }, []);

  return (
    <Router>
      <Navbar 
        allBooks={allBooks} 
        setBooks={setBooks} 
        setSearchQuery={setSearchQuery}  // pass setter
      />
      <Routes>
        <Route
          path="/books"
          element={
            <Books
              books={books}
              wishlist={wishlist}
              setWishlist={setWishlist}
              cart={cart}
              setCart={setCart}
              searchQuery={searchQuery}  // pass query for highlight
            />
          }
        />
        <Route
          path="/"
          element={
            <Home
              setBooks={setBooks}
              wishlist={wishlist}
              setWishlist={setWishlist}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/wishlist"
          element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} />}
        />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
