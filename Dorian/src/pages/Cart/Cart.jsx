import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = ({ cart, setCart }) => {
  const [quantities, setQuantities] = useState([]);

  // Initialize quantities to 1
  useEffect(() => {
    setQuantities(cart.map(() => 1));
  }, [cart]);

  const handleQtyChange = (index, value) => {
    const newQty = [...quantities];
    if (value < 1) value = 1;
    newQty[index] = value;
    setQuantities(newQty);
  };

  const handleRemove = (index) => {
    const newCart = [...cart];
    const newQty = [...quantities];
    newCart.splice(index, 1);
    newQty.splice(index, 1);
    setCart(newCart);
    setQuantities(newQty);
  };

  const totalPrice = cart.reduce((sum, book, i) => {
    const price = book.price || Math.floor(Math.random() * 500) + 200;
    return sum + price * quantities[i];
  }, 0);

  return (
    <div className="cart-page">
      <h1>Your Cart 🛒</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Add some books!</p>
      ) : (
        <div className="cart-grid">
          {cart.map((book, i) => {
            const price = book.price || Math.floor(Math.random() * 500) + 200;
            return (
              <div className="cart-item" key={i}>
                <img src={book.thumbnail} alt={book.title} />
                <div className="cart-details">
                  <h3>{book.title}</h3>
                  <p>{book.authors}</p>
                  <p className="price">₹{price}</p>
                  <p className="rating">Rating: {book.similarity ? (book.similarity*5).toFixed(1) : "4.5"} ⭐</p>

                  {/* Quantity Selector */}
                  <div className="quantity-selector">
                    <button onClick={() => handleQtyChange(i, quantities[i]-1)}>-</button>
                    <input 
                      type="number" 
                      value={quantities[i]} 
                      onChange={(e) => handleQtyChange(i, parseInt(e.target.value))} 
                    />
                    <button onClick={() => handleQtyChange(i, quantities[i]+1)}>+</button>
                  </div>

                  <p className="subtotal">Subtotal: ₹{price * quantities[i]}</p>

                  <button className="remove-btn" onClick={() => handleRemove(i)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {cart.length > 0 && (
        <div className="cart-total">
          <h2>Total: ₹{totalPrice}</h2>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}
    </div>
  )
}

export default Cart;
