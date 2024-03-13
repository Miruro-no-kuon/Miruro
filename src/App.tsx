import { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import SearchResults from "./pages/SearchResults";
import PageNotFound from "./pages/404";
import About from "./pages/About";
import PolicyTerms from "./pages/PolicyTerms";
import ShortcutsPopup from "./components/ShortcutsPopup";

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const ignoreRoutePattern = /^\/watch\/[^/]+\/[^/]+\/[^/]+$/;
    // Only scroll to if pathname has changed and does not match the ignore pattern
    if (
      prevPathnameRef.current !== pathname &&
      !ignoreRoutePattern.test(pathname)
    ) {
      window.setTimeout(() => {
        window.scrollTo({
          top: 0,
          // behavior: "smooth",
        });
      });
    }

    // Update the previous pathname reference for the next render
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        document.activeElement instanceof HTMLElement
      ) {
        document.activeElement.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Router>
      <Navbar />
      <ShortcutsPopup />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/watch/:animeId" element={<Watch />} />
        <Route
          path="/watch/:animeId/:animeTitle/:episodeNumber"
          element={<Watch />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/pptos" element={<PolicyTerms />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
