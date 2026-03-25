"""
Movie Recommendation System - Backend
Uses content-based and collaborative filtering techniques
"""

import json
import random
from collections import defaultdict

# ─── Sample Movie Dataset ───────────────────────────────────────────────────
MOVIES = [
    {"id": 1,  "title": "Inception",            "year": 2010, "genres": ["Sci-Fi","Thriller","Action"],       "rating": 8.8, "votes": 2300000, "director": "Christopher Nolan",  "cast": ["Leonardo DiCaprio","Joseph Gordon-Levitt"], "poster": "🌀"},
    {"id": 2,  "title": "The Dark Knight",       "year": 2008, "genres": ["Action","Crime","Drama"],           "rating": 9.0, "votes": 2800000, "director": "Christopher Nolan",  "cast": ["Christian Bale","Heath Ledger"],             "poster": "🦇"},
    {"id": 3,  "title": "Interstellar",          "year": 2014, "genres": ["Sci-Fi","Adventure","Drama"],       "rating": 8.6, "votes": 1900000, "director": "Christopher Nolan",  "cast": ["Matthew McConaughey","Anne Hathaway"],       "poster": "🪐"},
    {"id": 4,  "title": "Pulp Fiction",          "year": 1994, "genres": ["Crime","Drama","Thriller"],         "rating": 8.9, "votes": 2100000, "director": "Quentin Tarantino", "cast": ["John Travolta","Uma Thurman"],               "poster": "💼"},
    {"id": 5,  "title": "The Shawshank Redemption","year":1994,"genres": ["Drama"],                            "rating": 9.3, "votes": 2700000, "director": "Frank Darabont",    "cast": ["Tim Robbins","Morgan Freeman"],              "poster": "🔑"},
    {"id": 6,  "title": "The Godfather",         "year": 1972, "genres": ["Crime","Drama"],                    "rating": 9.2, "votes": 1900000, "director": "Francis Ford Coppola","cast":["Marlon Brando","Al Pacino"],                 "poster": "🌹"},
    {"id": 7,  "title": "The Matrix",            "year": 1999, "genres": ["Sci-Fi","Action"],                  "rating": 8.7, "votes": 1900000, "director": "The Wachowskis",    "cast": ["Keanu Reeves","Laurence Fishburne"],         "poster": "💊"},
    {"id": 8,  "title": "Forrest Gump",          "year": 1994, "genres": ["Drama","Romance"],                  "rating": 8.8, "votes": 2100000, "director": "Robert Zemeckis",   "cast": ["Tom Hanks","Robin Wright"],                  "poster": "🏃"},
    {"id": 9,  "title": "Goodfellas",            "year": 1990, "genres": ["Crime","Drama","Biography"],        "rating": 8.7, "votes": 1200000, "director": "Martin Scorsese",   "cast": ["Ray Liotta","Robert De Niro"],               "poster": "🔫"},
    {"id": 10, "title": "Fight Club",            "year": 1999, "genres": ["Drama","Thriller"],                 "rating": 8.8, "votes": 2200000, "director": "David Fincher",     "cast": ["Brad Pitt","Edward Norton"],                 "poster": "🥊"},
    {"id": 11, "title": "Schindler's List",      "year": 1993, "genres": ["Drama","History","Biography"],      "rating": 8.9, "votes": 1400000, "director": "Steven Spielberg",  "cast": ["Liam Neeson","Ben Kingsley"],                "poster": "📜"},
    {"id": 12, "title": "The Silence of the Lambs","year":1991,"genres": ["Crime","Drama","Thriller","Horror"],"rating": 8.6, "votes": 1400000, "director": "Jonathan Demme",   "cast": ["Jodie Foster","Anthony Hopkins"],            "poster": "🦋"},
    {"id": 13, "title": "Gladiator",             "year": 2000, "genres": ["Action","Adventure","Drama"],       "rating": 8.5, "votes": 1400000, "director": "Ridley Scott",      "cast": ["Russell Crowe","Joaquin Phoenix"],           "poster": "⚔️"},
    {"id": 14, "title": "The Lion King",         "year": 1994, "genres": ["Animation","Adventure","Drama"],    "rating": 8.5, "votes": 1000000, "director": "Roger Allers",      "cast": ["Matthew Broderick","Jeremy Irons"],          "poster": "🦁"},
    {"id": 15, "title": "Parasite",              "year": 2019, "genres": ["Drama","Thriller","Comedy"],        "rating": 8.5, "votes": 800000,  "director": "Bong Joon-ho",      "cast": ["Song Kang-ho","Lee Sun-kyun"],               "poster": "🪜"},
    {"id": 16, "title": "Avengers: Endgame",     "year": 2019, "genres": ["Action","Adventure","Sci-Fi"],      "rating": 8.4, "votes": 1200000, "director": "The Russo Brothers","cast": ["Robert Downey Jr.","Chris Evans"],           "poster": "🦾"},
    {"id": 17, "title": "Joker",                 "year": 2019, "genres": ["Crime","Drama","Thriller"],         "rating": 8.4, "votes": 1000000, "director": "Todd Phillips",     "cast": ["Joaquin Phoenix","Robert De Niro"],          "poster": "🃏"},
    {"id": 18, "title": "Whiplash",              "year": 2014, "genres": ["Drama","Music"],                    "rating": 8.5, "votes": 800000,  "director": "Damien Chazelle",   "cast": ["Miles Teller","J.K. Simmons"],               "poster": "🥁"},
    {"id": 19, "title": "Mad Max: Fury Road",    "year": 2015, "genres": ["Action","Adventure","Sci-Fi"],      "rating": 8.1, "votes": 900000,  "director": "George Miller",     "cast": ["Tom Hardy","Charlize Theron"],               "poster": "🚗"},
    {"id": 20, "title": "La La Land",            "year": 2016, "genres": ["Drama","Music","Romance"],          "rating": 8.0, "votes": 700000,  "director": "Damien Chazelle",   "cast": ["Ryan Gosling","Emma Stone"],                 "poster": "🌆"},
    {"id": 21, "title": "Get Out",               "year": 2017, "genres": ["Horror","Mystery","Thriller"],      "rating": 7.7, "votes": 600000,  "director": "Jordan Peele",      "cast": ["Daniel Kaluuya","Allison Williams"],         "poster": "👁️"},
    {"id": 22, "title": "Blade Runner 2049",     "year": 2017, "genres": ["Sci-Fi","Drama","Mystery"],         "rating": 8.0, "votes": 500000,  "director": "Denis Villeneuve",  "cast": ["Ryan Gosling","Harrison Ford"],              "poster": "🌧️"},
    {"id": 23, "title": "Arrival",               "year": 2016, "genres": ["Sci-Fi","Drama","Mystery"],         "rating": 7.9, "votes": 600000,  "director": "Denis Villeneuve",  "cast": ["Amy Adams","Jeremy Renner"],                 "poster": "🛸"},
    {"id": 24, "title": "1917",                  "year": 2019, "genres": ["Drama","War","Action"],             "rating": 8.2, "votes": 500000,  "director": "Sam Mendes",        "cast": ["George MacKay","Dean-Charles Chapman"],      "poster": "🪖"},
    {"id": 25, "title": "Everything Everywhere All at Once","year":2022,"genres":["Sci-Fi","Comedy","Action"], "rating": 7.8, "votes": 400000,  "director": "Daniels",           "cast": ["Michelle Yeoh","Ke Huy Quan"],               "poster": "🌌"},
]

# ─── User Ratings (simulated collaborative data) ─────────────────────────────
USER_RATINGS = {
    "user_001": {1:5,2:5,3:4,7:5,16:4,19:3},
    "user_002": {4:5,6:5,9:5,10:4,12:4,17:3},
    "user_003": {5:5,8:5,11:5,14:4,18:4,20:4},
    "user_004": {1:4,3:5,7:4,22:5,23:5,25:4},
    "user_005": {2:5,13:5,16:5,19:4,24:4,21:3},
    "user_006": {6:5,4:4,9:4,12:5,15:4,17:5},
    "user_007": {18:5,20:5,14:4,8:4,5:3,11:4},
    "demo":     {1:5,3:4,7:5,10:4},
}

# ─── Recommendation Engine ────────────────────────────────────────────────────
def get_genre_vector(movie):
    all_genres = set(g for m in MOVIES for g in m["genres"])
    return {g: (1 if g in movie["genres"] else 0) for g in all_genres}

def cosine_similarity(v1, v2):
    keys = set(v1) | set(v2)
    dot = sum(v1.get(k,0) * v2.get(k,0) for k in keys)
    mag1 = sum(x**2 for x in v1.values()) ** 0.5
    mag2 = sum(x**2 for x in v2.values()) ** 0.5
    return dot / (mag1 * mag2) if mag1 and mag2 else 0

def content_based_recommend(movie_id, n=6):
    target = next((m for m in MOVIES if m["id"] == movie_id), None)
    if not target:
        return []
    target_vec = get_genre_vector(target)
    target_vec["rating"] = target["rating"] / 10
    scores = []
    for m in MOVIES:
        if m["id"] == movie_id:
            continue
        vec = get_genre_vector(m)
        vec["rating"] = m["rating"] / 10
        # Boost same director
        director_bonus = 0.2 if m["director"] == target["director"] else 0
        sim = cosine_similarity(target_vec, vec) + director_bonus
        scores.append((m, sim))
    scores.sort(key=lambda x: x[1], reverse=True)
    return [m for m, _ in scores[:n]]

def collaborative_recommend(user_id, n=6):
    user_ratings = USER_RATINGS.get(user_id, {})
    if not user_ratings:
        return get_top_rated(n)
    # Find similar users
    similarities = {}
    for other_id, other_ratings in USER_RATINGS.items():
        if other_id == user_id:
            continue
        common = set(user_ratings) & set(other_ratings)
        if len(common) < 2:
            continue
        v1 = {k: user_ratings[k] for k in common}
        v2 = {k: other_ratings[k] for k in common}
        sim = cosine_similarity(v1, v2)
        similarities[other_id] = (sim, other_ratings)
    # Aggregate scores
    movie_scores = defaultdict(float)
    movie_counts = defaultdict(int)
    for other_id, (sim, other_ratings) in similarities.items():
        for mid, rating in other_ratings.items():
            if mid not in user_ratings:
                movie_scores[mid] += sim * rating
                movie_counts[mid] += 1
    ranked = sorted(movie_scores.keys(), key=lambda x: movie_scores[x]/movie_counts[x], reverse=True)
    result = []
    for mid in ranked[:n]:
        m = next((x for x in MOVIES if x["id"] == mid), None)
        if m:
            result.append(m)
    return result or get_top_rated(n)

def get_top_rated(n=6):
    return sorted(MOVIES, key=lambda x: x["rating"], reverse=True)[:n]

def get_genre_stats():
    genre_count = defaultdict(int)
    genre_rating = defaultdict(list)
    for m in MOVIES:
        for g in m["genres"]:
            genre_count[g] += 1
            genre_rating[g].append(m["rating"])
    return {g: {"count": genre_count[g], "avg_rating": round(sum(genre_rating[g])/len(genre_rating[g]),2)} for g in genre_count}

def get_dashboard_stats():
    return {
        "total_movies": len(MOVIES),
        "total_users": len(USER_RATINGS),
        "avg_rating": round(sum(m["rating"] for m in MOVIES)/len(MOVIES), 2),
        "top_genre": max(get_genre_stats().items(), key=lambda x: x[1]["count"])[0],
        "highest_rated": max(MOVIES, key=lambda x: x["rating"])["title"],
        "most_voted": max(MOVIES, key=lambda x: x["votes"])["title"],
    }

if __name__ == "__main__":
    print("=== Movie Recommendation System ===\n")
    print("Dashboard Stats:", json.dumps(get_dashboard_stats(), indent=2))
    print("\nTop Rated Movies:")
    for m in get_top_rated(5):
        print(f"  {m['poster']} {m['title']} ({m['year']}) — ⭐ {m['rating']}")
    print("\nContent-Based Recommendations for 'Inception':")
    for m in content_based_recommend(1, 5):
        print(f"  {m['poster']} {m['title']} ({m['year']}) — ⭐ {m['rating']}")
    print("\nCollaborative Recommendations for demo user:")
    for m in collaborative_recommend("demo", 5):
        print(f"  {m['poster']} {m['title']} ({m['year']}) — ⭐ {m['rating']}")
