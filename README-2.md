# 🎬 CineMatch — AI Movie Recommendation System

A full-stack movie recommendation system built with **Python** and **React**, featuring three intelligent recommendation algorithms implemented from scratch — no external ML libraries required.

---

## 🚀 Live Features

| Page | Description |
|------|-------------|
| 📊 **Dashboard** | Stats cards, genre distribution, decade ratings, featured picks |
| 🎬 **Discover** | Browse all 25 movies with live search & genre filter chips |
| ✨ **Recommend** | Pick a seed movie → get AI-powered suggestions via 3 algorithm tabs |
| 📈 **Analytics** | Rating distribution, genre performance, director spotlight, votes matrix |
| 🏆 **Top Charts** | Rankings by rating, votes, and release year |

---

## 🧠 Recommendation Algorithms

### 1. Content-Based Filtering
Builds a genre vector for each movie and computes **cosine similarity** between the seed movie and all others. Adds a director-match bonus for films by the same director.

### 2. Collaborative Filtering
Finds users with similar taste by comparing rating vectors, then surfaces movies that similar users loved but the current user hasn't seen yet.

### 3. Hybrid Engine
Interleaves results from both Content-Based and Collaborative filtering to deliver the best of both worlds in a single ranked list.

---

## 🗂️ Project Structure

```
CineMatch/
├── app.py                  # Python backend — recommendation engine & analytics
├── MovieRecommender.jsx    # React frontend — full dashboard (single file)
├── dashboard.html          # Standalone HTML version (no build step needed)
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Logic | Python 3 (zero ML dependencies) |
| Frontend | React 18 (Hooks — useState, useMemo, useCallback, useEffect) |
| Styling | Inline CSS-in-JS with CSS variables |
| Fonts | Bebas Neue · DM Sans (Google Fonts) |
| Algorithms | Cosine Similarity · User-Based Collaborative Filtering · Hybrid Ranking |

---

## 📦 Getting Started

### Run the Python Backend
```bash
python app.py
```
Outputs top-rated movies, content-based and collaborative recommendations directly to the terminal.

### Run the React Frontend

**Option A — Vite (recommended)**
```bash
npm create vite@latest cinematch -- --template react
cd cinematch
cp MovieRecommender.jsx src/App.jsx
npm install
npm run dev
```

**Option B — Create React App**
```bash
npx create-react-app cinematch
cd cinematch
cp MovieRecommender.jsx src/App.js
npm start
```

**Option C — No build step**
Open `dashboard.html` directly in any browser. No installation needed.

---

## 🎬 Dataset

25 hand-curated IMDb top-rated movies with the following fields:

```json
{
  "id": 1,
  "title": "Inception",
  "year": 2010,
  "genres": ["Sci-Fi", "Thriller", "Action"],
  "rating": 8.8,
  "votes": 2300000,
  "director": "Christopher Nolan",
  "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
  "poster": "🌀"
}
```

8 simulated user rating profiles (scale 1–5) power the collaborative filtering engine.

---

## 🧩 React Component Architecture

```
App
├── Sidebar (navigation)
├── DashboardPage
│   ├── StatCard ×4
│   ├── BarChart (genres)
│   ├── TopListItem ×8
│   ├── Decade Timeline
│   └── MovieCard ×6
├── DiscoverPage
│   ├── Search Input
│   ├── Genre Filter Chips
│   └── MovieCard grid
├── RecommendPage
│   ├── Algorithm Tabs
│   ├── Seed Search + Dropdown
│   ├── Movie Detail Panel
│   └── Recommendations Grid
├── AnalyticsPage
│   ├── BarChart (rating dist)
│   ├── BarChart (genre perf)
│   ├── Director Spotlight Cards
│   └── Votes Matrix
└── TopChartsPage
    └── TopListItem ×3 columns
```

---

## ✨ UI Highlights

- 🌑 Cinematic dark theme with gold accent (`#e8b84b`)
- 🎞️ `fadeUp` entry animations on every page transition
- 🖱️ Hover lift effects on all movie cards
- 🔍 Live search with instant filtering
- 📐 Fully responsive grid layout
- 🎨 14-color data visualization palette

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

> Built with ❤️ using Python + React · No external ML libraries
