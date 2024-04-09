import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import {
  Profile,
  Navbar,
  Footer,
  Home,
  Watch,
  Search,
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
      <div style={{ minHeight: '85rem' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/watch/:animeId' element={<Watch />} />
          <Route
            path='/watch/:animeId/:animeTitle/:episodeNumber'
            element={<Watch />}
          />
          <Route path='/profile' element={<Profile />} />
          <Route path='/about' element={<About />} />
          <Route path='/pptos' element={<PolicyTerms />} />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
      <Footer />
      <Analytics mode={'production'} />;
    </Router>
  );
}

export default App;
