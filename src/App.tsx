import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Profile,
  Navbar,
  ThemeProvider,
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
  Callback,
  AuthProvider,
} from './index';
import { register } from 'swiper/element/bundle';

register();

function App() {
  usePreserveScrollOnReload();

  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <Navbar />
          <ShortcutsPopup />
          <ScrollToTop />
          <div style={{ minHeight: '35rem' }}>
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
              <Route path='/callback' element={<Callback />} />
              <Route path='*' element={<Page404 />} />
            </Routes>
          </div>
          <Footer />
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
