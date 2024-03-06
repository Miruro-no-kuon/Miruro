import { useEffect } from "react";
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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Pattern to match the specific route to ignore
    const ignoreRoutePattern = /^\/watch\/[^/]+\/[^/]+\/[^/]+$/;

    // Only scroll to top if the current pathname does not match the ignore pattern
    if (!ignoreRoutePattern.test(pathname)) {
      // Delay the scroll to top to allow content to render
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 0); // Adjust the delay as needed

      return () => clearTimeout(timer); // Cleanup the timer
    }
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
        <Route path="/policyterms" element={<PolicyTerms />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
