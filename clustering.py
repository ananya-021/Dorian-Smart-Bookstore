import numpy as np
import pandas as pd
import spacy
import matplotlib.pyplot as plt

from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.decomposition import TruncatedSVD
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE

books = pd.read_csv("books.csv")
books = books.dropna(subset=["description", "genre"]).reset_index(drop=True)

nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

def lemmatize_text(text):
    doc = nlp(str(text))
    return " ".join(
        token.lemma_ for token in doc
        if not token.is_punct and not token.is_space and token.lemma_ != "-PRON-"
    )

books["description"] = books["description"].apply(lemmatize_text)

extra_stopwords = [
    # editorial / publishing
    "originally", "publish", "publisher", "printing", "edition",
    "bestseller", "review", "award", "prize", "guide", "introduction",
    "include", "provide", "offer", "use", "note", "commentary",

    # generic book words
    "book", "novel", "author", "writer", "story", "series",
    "character", "plot", "chapter", "volume", "text",

    # vague meaning killers
    "thing", "way", "time", "year", "work", "make", "good", "great",
    "read", "come", "know", "set", "follow", "discover",

    # demographic noise
    "man", "woman", "girl", "boy", "young", "old", "people",

    # academic / meta
    "study", "essay", "translation", "prose", "drama",
    "english", "american", "york",

    # removed themes you don’t want to dominate
    "life", "world", "human", "male", "female", "binary"
]

all_stopwords = list(ENGLISH_STOP_WORDS.union(extra_stopwords))


tfidf = TfidfVectorizer(
    max_features=6000,
    stop_words=all_stopwords,
    min_df=5,
    max_df=0.55,
    ngram_range=(1, 2)   
)

desc_tfidf = tfidf.fit_transform(books["description"])


svd = TruncatedSVD(n_components=300, random_state=42)
desc_svd = svd.fit_transform(desc_tfidf)


genre_dummies = pd.get_dummies(books["genre"])
genre_weight = 3.0

genre_features = genre_dummies.values * genre_weight


X = np.hstack([desc_svd, genre_features])

kmeans = KMeans(
    n_clusters=8,
    random_state=42,
    n_init=20
)

books["cluster"] = kmeans.fit_predict(X)


'''tsne = TSNE(
    n_components=2,
    random_state=42,
    perplexity=50,
    learning_rate="auto"
)

X_2d = tsne.fit_transform(desc_svd)

plt.figure(figsize=(10, 6))
plt.scatter(
    X_2d[:, 0],
    X_2d[:, 1],
    c=books["cluster"],
    cmap="rainbow",
    alpha=0.6
)
plt.title("Book Clusters (TF-IDF + SVD + Genre + KMeans)")
plt.xlabel("Dim 1")
plt.ylabel("Dim 2")
plt.colorbar(label="Cluster")
plt.show()'''


'''feature_names = tfidf.get_feature_names_out()

    for cluster_id in range(8):
    idx = books.index[books["cluster"] == cluster_id]
    tfidf_sum = desc_tfidf[idx].sum(axis=0)

    top_indices = np.asarray(tfidf_sum).ravel().argsort()[::-1][:20]
    top_terms = [feature_names[i] for i in top_indices]

    print(f"\nCluster {cluster_id} top phrases:")
    print(top_terms)'''
    
cluster_moods = {
    0: ["love", "mystery", "sad", "romance", "tragic", "heart"],
    1: ["comfort", "nostalgic", "adventure", "uplifting", "happy", "hopeful"],
    2: ["inspiring", "introspective", "motivational", "mindful", "reflective"],
    3: ["intellectual", "serious", "thoughtful", "deep"],
    4: ["historical", "heavy", "educational", "documentary"],
    5: ["magic", "dark", "thrill", "fantasy", "supernatural", "mystical"],
    6: ["spiritual", "faith", "religious", "devotional"],
    7: ["artistic", "literary", "emotional", "poetic", "creative"]
}


'''books.to_csv("books_with_clusters.csv", index=False)
print("\nSaved → books_with_clusters.csv")'''


from sklearn.metrics.pairwise import cosine_similarity

def preprocess_input(text):
    """Clean user input similar to book descriptions."""
    doc = nlp(str(text))
    tokens = [
        token.lemma_.lower()
        for token in doc
        if not token.is_punct and not token.is_space and token.lemma_ != "-PRON-" and token.lemma_.lower() not in all_stopwords
    ]
    return " ".join(tokens)


def get_mood_clusters(user_input):
    """Return cluster IDs whose moods match user's input words (substring match)."""
    user_words = preprocess_input(user_input).split()
    matched_clusters = []
    for cluster_id, moods in cluster_moods.items():
        if any(any(mood in word or word in mood for word in user_words) for mood in moods):
            matched_clusters.append(cluster_id)
    if not matched_clusters:
        matched_clusters = list(cluster_moods.keys())
    return matched_clusters


def recommend_books(user_input, top_n=10):
    """Recommend books based on user's input and cluster moods, returning title, authors, cluster, thumbnail, similarity."""
    # Clean user input
    user_clean = preprocess_input(user_input)
    user_tfidf = tfidf.transform([user_clean])
    user_svd = svd.transform(user_tfidf)
    user_vec = np.hstack([user_svd, np.zeros((1, genre_features.shape[1]))])

    # Find matching clusters
    mood_clusters = get_mood_clusters(user_input)
    mask = books["cluster"].isin(mood_clusters)
    
    X_subset = X[mask.values]
    books_subset = books[mask].reset_index(drop=True)

    sims = cosine_similarity(user_vec, X_subset).flatten()
    top_indices = sims.argsort()[::-1][:top_n]
    
    recommendations = books_subset.iloc[top_indices][["title", "authors", "cluster", "thumbnail"]].copy()
    recommendations["similarity"] = sims[top_indices]
    return recommendations


if __name__ == "__main__":
    print("\n--- Mood-Based Book Recommender ---")
    user_input = input("Describe your current mood or feeling: ")
    recs = recommend_books(user_input, top_n=10)
    
    print("\nTop book recommendations for you:\n")
    for idx, row in recs.iterrows():
        print(f"{row['title']} by {row['authors']}  [Cluster: {row['cluster']}]  Similarity: {row['similarity']:.2f}")

