import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import SearchResults from "./pages/SearchResults";
import PageNotFound from "./pages/404";
import ScrollToTopButton from "./components/ScrollUp";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && document.activeElement) {
        document.activeElement.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/faq" element={<Splash />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/watch/:animeId" element={<Watch />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ScrollToTopButton />
      <Footer />
    </Router>
  );
}

export default App;
