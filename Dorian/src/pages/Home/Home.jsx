import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import hero_banner from "../../assets/hero_banner.jpg";
import back_img from "../../assets/bg.jpg";

// import your genre images
import fictionImg from "../../assets/fiction.png";
import nonfictionImg from "../../assets/nonfiction.png";
import childrenImg from "../../assets/children.jpeg";

const Home = ({ setBooks }) => {
  const [feeling, setFeeling] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generatePrice = () => Math.floor(Math.random() * 500) + 200;

  const handleRecommend = async () => {
    if (!feeling.trim()) {
      alert("Please write how you feel");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeling }),
      });

      const data = await res.json();

      const booksWithPrice = data.map((book) => ({
        ...book,
        price: generatePrice(),
      }));

      setBooks(booksWithPrice);
      navigate("books");
    } catch (err) {
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  // Handle genre click
  const handleGenreClick = async (genre) => {
  setLoading(true);
  try {
    const res = await fetch(
      `http://127.0.0.1:5000/genre?genre=${encodeURIComponent(genre)}`
    );

    const data = await res.json();

    const booksWithPrice = data.map((book) => ({
      ...book,
      price: generatePrice(),
    }));

    setBooks(booksWithPrice);
    navigate("/books");
  } catch (err) {
    alert("Backend error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero">
        <img src={hero_banner} alt="Hero Banner" className="hero-banner" />
        <div className="hero-caption">
          <h1>Feeling Something?</h1>
          <h1>Let Dorian Recommend Your Next Book...</h1>
        </div>
      </div>

      {/* Feeling Section */}
      <div className="feeling-section">
        <textarea
          placeholder="Tell Dorian how you're feeling..."
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />
        <button onClick={handleRecommend}>
          {loading ? "Thinking..." : "Recommend Books"}
        </button>
      </div>

      <div className="back-image-section">
  <img src={back_img} alt="Back Banner" className="back-image" />
  <div className="quote-overlay">
    <p>“If one cannot enjoy reading a book over and over again, there is no use in reading it at all.”
― Oscar Wilde</p>
  </div>
</div>

      {/* Genre Section */}
      <div className="genre-section">
        <div className="genre-thumbnails">
          <img
            src={fictionImg}
            alt="Fiction"
            className="genre-thumb"
            onClick={() => handleGenreClick("fiction")}
          />
          <img
            src={nonfictionImg}
            alt="Non-Fiction"
            className="genre-thumb"
            onClick={() => handleGenreClick("non-fiction")}
          />
          <img
            src={childrenImg}
            alt="Children"
            className="genre-thumb"
            onClick={() => handleGenreClick("children")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
