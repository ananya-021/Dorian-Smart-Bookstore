from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

from clustering import recommend_books  # your existing function

app = Flask(__name__)
CORS(app)

# --------------------------
# LOAD CSV CORRECTLY (FIX)
# --------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "books.csv")

books_df = pd.read_csv(CSV_PATH)

print("✅ Books CSV loaded successfully")
print("Rows:", len(books_df))
print("Columns:", books_df.columns.tolist())

# --------------------------
# RECOMMEND ROUTE
# --------------------------
@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        feeling = data.get("feeling", "")
        print("Received feeling:", feeling)

        recs = recommend_books(feeling, top_n=10)
        print("Recommendations found:", len(recs))

        return jsonify(
            recs[["title", "authors", "thumbnail"]].to_dict(orient="records")
        )

    except Exception as e:
        print("❌ RECOMMEND ERROR:", e)
        return jsonify({"error": str(e)}), 500


# --------------------------
# GENRE ROUTE
# --------------------------
@app.route("/genre", methods=["GET"])
def get_books_by_genre():
    try:
        genre = request.args.get("genre")
        print("Genre received:", genre)

        genre_map = {
            "fiction": "Fiction",
            "non-fiction": "Non-Fiction",
            "children": "Children"
        }

        selected_genre = genre_map.get(genre)
        if not selected_genre:
            return jsonify([])

        filtered_books = books_df[
            books_df["main_genre"] == selected_genre
        ][["title", "authors", "thumbnail"]]

        print(f"Books found for {selected_genre}: {len(filtered_books)}")

        return jsonify(filtered_books.to_dict(orient="records"))

    except Exception as e:
        print("❌ GENRE ERROR:", e)
        return jsonify({"error": str(e)}), 500


# --------------------------
# RUN SERVER
# --------------------------
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
