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
  const location = useLocation();
  const prevPathnameRef = useRef(null);

  useEffect(() => {
    // Attempt to restore the scroll position if it exists
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem(location.pathname);
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    };

    // Save the scroll position for the current path before navigating away
    const saveScrollPosition = () =>
      sessionStorage.setItem(location.pathname, window.scrollY.toString());

    // Add event listeners
    window.addEventListener("beforeunload", saveScrollPosition);
    window.addEventListener("popstate", restoreScrollPosition);

    // Initial scroll restoration or scroll to top
    const ignoreRoutePattern = /^\/watch\/[^/]+\/[^/]+\/[^/]+$/;
    // Only scroll to if pathname has changed and does not match the ignore pattern
    if (
      prevPathnameRef.current !== location.pathname &&
      !ignoreRoutePattern.test(location.pathname)
    ) {
      if (location.state?.preserveScroll) {
        restoreScrollPosition();
      } else {
        window.scrollTo(0, 0);
      }
    }

    // Update the previous pathname reference for the next render
    prevPathnameRef.current = location.pathname;

    // Cleanup event listeners
    return () => {
      window.removeEventListener("beforeunload", saveScrollPosition);
      window.removeEventListener("popstate", restoreScrollPosition);
    };
  }, [location]);

  return null;
}

const usePreserveScrollOnReload = () => {
  useEffect(() => {
    // Restore scroll position
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }

    // Save scroll position before reload
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

function App() {
  usePreserveScrollOnReload();
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
