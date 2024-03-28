import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Preferences,
  Navbar,
  Footer,
  Home,
  Watch,
  SearchSort,
  Page404,
  About,
  PolicyTerms,
  ShortcutsPopup,
  ScrollToTop,
  usePreserveScrollOnReload,
} from './index';

function App() {
  usePreserveScrollOnReload();

  return (
    <Router>
      <Navbar />
      <ShortcutsPopup />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchSort />} />
        <Route path="/watch/:animeId" element={<Watch />} />
        <Route
          path="/watch/:animeId/:animeTitle/:episodeNumber"
          element={<Watch />}
        />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/about" element={<About />} />
        <Route path="/pptos" element={<PolicyTerms />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
