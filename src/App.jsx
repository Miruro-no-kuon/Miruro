import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Navigation/Nav";
import AnimeDetails from "./pages/AnimeDetails";
import RecentEpisodesAnime from "./pages/RecentEpisodesAnime";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import PopularAnime from "./pages/PopularAnime";
import SearchResults from "./pages/SearchResults";
import Top100Anime from "./pages/Top100Anime";
import PopularMovies from "./pages/PopularMovies";
import TrendingAnime from "./pages/TrendingAnime";
import WatchAnime from "./pages/WatchAnime";
import GlobalStyle from "./styles/globalStyles";
import PageNotFound from "./pages/PageNotFound";

function App() {
  // Function to change the title of the web page based on user navigation
  function changeMetaArr(propertyChanged, change) {
    document.title = change;
  }

  return (
    <Router>
      <GlobalStyle /> {/* Global CSS styles for your app */}
      <Nav /> {/* Navigation bar component at the top of the app */}
      <Routes>
        <Route path="/" element={<Home changeMetaArr={changeMetaArr} />} />{" "}
        {/* Home page */}
        <Route
          path="/popular"
          element={<PopularAnime changeMetaArr={changeMetaArr} />}
        />{" "}
        {/* Popular Anime page */}
        <Route
          path="/trending"
          element={<TrendingAnime changeMetaArr={changeMetaArr} />}
        />{" "}
        {/* Trending Anime page */}
        <Route
          path="/recent-episodes"
          element={<RecentEpisodesAnime changeMetaArr={changeMetaArr} />}
        />{" "}
        {/* Recent Episodes Anime page */}
        <Route
          path="/top100"
          element={<Top100Anime changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="/movies"
          element={<PopularMovies changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="/search/:name"
          element={<SearchResults changeMetaArr={changeMetaArr} />}
        />{" "}
        {/* Search Results page */}
        <Route
          path="/details/:slug"
          element={<AnimeDetails changeMetaArr={changeMetaArr} />}
        />{" "}
        {/* Anime Details page */}
        <Route
          path="/watch/:episode"
          element={<WatchAnime changeMetaArr={changeMetaArr} />}
        />{" "}
        {/* Watch Anime page */}
        <Route
          path="*"
          element={<PageNotFound changeMetaArr={changeMetaArr} />}
        />{" "}
        {/* Page Not Found - 404 error page */}
      </Routes>
      <Footer /> {/* Footer component at the bottom of the app */}
    </Router>
  );
}

export default App;
