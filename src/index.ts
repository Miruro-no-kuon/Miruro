// * ==== Components ====
// TODO Basic UI Components
export { default as Carousel } from './components/Carousel';
export { default as DropDownSearch } from './components/DropDownSearch';
export { default as Footer } from './components/Footer';
export { default as Navbar } from './components/Navbar';
export { default as ShortcutsPopup } from './components/ShortcutsPopup';

// TODO Cards
export { default as CardGrid } from './components/Cards/CardGrid';
export * from './components/Cards/CardGrid';
export { default as CardItem } from './components/Cards/CardItem';

// TODO Home Page Specific
export { default as EpisodeCard } from './components/Home/EpisodeCard';
export { default as HomeCarousel } from './components/Home/HomeCarousel';

// TODO Skeletons for Loading States
export { default as CardSkeleton } from './components/Skeletons/CardSkeleton';
export { default as CarouselSkeleton } from './components/Skeletons/CarouselSkeleton';
export { default as VideoPlayerSkeleton } from './components/Skeletons/VideoPlayerSkeleton';

// TODO Watching Anime Functionality
export { default as EpisodeList } from './components/Watch/EpisodeList';
export { default as EmbedPlayer } from './components/Watch/Video/EmbedPlayer';
export { Player } from './components/Watch/Video/Player'; // Notice: This is not a default export
export { default as VideoSourceSelector } from './components/Watch/VideoSourceSelector';
export { default as WatchAnimeData } from './components/Watch/WatchAnimeData';
export { default as WatchAnimeDataSideBar } from './components/Watch/WatchAnimeDataSidebar';
export { default as WatchAnimeDataSeasons } from './components/Watch/WatchAnimeDataSeasons';

// * ==== Hooks ====
// Utilizing API and Other Functionalities
export * from './hooks/useApi';
export * from './hooks/interface';
export * from './hooks/useScroll';

// * ==== Pages ====
// TODO Main Pages of the Application
export { default as Home } from './pages/Home';
export { default as SearchSort } from './pages/SearchSort';
export { default as Watch } from './pages/Watch';
export { default as Profile } from './pages/Profile';
export { default as About } from './pages/About';
export { default as PolicyTerms } from './pages/PolicyTerms';
export { default as Page404 } from './pages/404';
