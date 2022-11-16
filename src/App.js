import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Navigation/Nav';
import AnimeDetails from './pages/AnimeDetails';
import FavouriteAnime from './pages/FavouriteAnime';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import PopularAnime from './pages/PopularAnime';
import SearchResults from './pages/SearchResults';
import Top100Anime from './pages/Top100Anime';
import TrendingAnime from './pages/TrendingAnime';
import WatchAnime from './pages/WatchAnime';
import GlobalStyle from './styles/globalStyles';
import PageNotFound from './pages/PageNotFound';
// import { useState } from "react";

function App() {
  // const [metaArr, setMetaArr] = useState({"title": "Miruro - Watch The Best Quality Anime Online", "description": "Miruro. An ad-free anime streaming site. Catch your favourite shows and movies right here! Help us by contributing to the project on github."})
  function changeMetaArr(propertyChanged, change) {
    document.title = change;
  }
  return (
    <Router>
      <GlobalStyle />
      <Nav />
      <Routes>
        <Route path="/" element={<Home changeMetaArr={changeMetaArr} />} />
        <Route
          path="/popular"
          element={<PopularAnime changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="/trending"
          element={<TrendingAnime changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="/favourites"
          element={<FavouriteAnime changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="/top100"
          element={<Top100Anime changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="/search/:name"
          element={<SearchResults changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="/category/:slug"
          element={<AnimeDetails changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="/watch/:episode"
          element={<WatchAnime changeMetaArr={changeMetaArr} />}
        />
        <Route
          path="*"
          element={<PageNotFound changeMetaArr={changeMetaArr} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;