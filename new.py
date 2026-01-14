import pandas as pd
import numpy as np

# -------------------------------
# 1. Load Dataset
# -------------------------------
books = pd.read_csv('data.csv')

# -------------------------------
# 2. Drop Unnecessary Columns
# -------------------------------
books.drop(
    ['isbn13', 'isbn10', 'subtitle', 'published_year',
     'num_pages', 'ratings_count'],
    axis=1,
    inplace=True,
    errors='ignore'
)

# -------------------------------
# 3. Handle Missing Values
# -------------------------------
books.dropna(subset=['description'], inplace=True)
books.dropna(subset=['thumbnail'], inplace=True)
books.dropna(subset=['categories'], inplace=True)

books.fillna({'average_rating': books['average_rating'].mean()}, inplace=True)
books.fillna({'authors': 'Unknown'}, inplace=True)

# -------------------------------
# 4. Rename Columns
# -------------------------------
books.rename(columns={'categories': 'genre'}, inplace=True)

# -------------------------------
# 5. Clean Description Text
# -------------------------------
books['description'] = books['description'].str.lower()
books['description'] = books['description'].str.strip()
books['description'] = books['description'].str.replace(r'[^a-zA-Z0-9\s]', '', regex=True)
books['description'] = books['description'].str.replace(r'\s+', ' ', regex=True)

# -------------------------------
# 6. Normalize Genre Text
# -------------------------------
books['genre'] = books['genre'].str.lower().str.strip()

# -------------------------------
# 7. Divide Genre into 3 Categories
# -------------------------------
def map_genre(cat):
    if pd.isna(cat):
        return 'Non-Fiction'
    
    cat = cat.lower()

    # Children
    if 'children' in cat or 'juvenile' in cat:
        return 'Children'

    # Fiction
    elif (
        'fiction' in cat or
        'fantasy' in cat or
        'mystery' in cat or
        'adventure' in cat or
        'drama' in cat or
        'novel' in cat
    ):
        return 'Fiction'

    # Everything else
    else:
        return 'Non-Fiction'

books['main_genre'] = books['genre'].apply(map_genre)

# -------------------------------
# 8. Final Check
# -------------------------------
print(books['main_genre'].value_counts())
print(books.head())

# -------------------------------
# 9. Save Clean Dataset
# -------------------------------
books.to_csv('books.csv', index=False)
bk=pd.read_csv('books.csv')
bk.head()
bk.columns
bk['main_genre']