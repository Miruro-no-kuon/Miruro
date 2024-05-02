// * ==== Components ====
// TODO Shared components
export { StatusIndicator } from './components/shared/StatusIndicator';

// TODO Basic UI Components
export { Navbar } from './components/Navigation/Navbar';
export { Footer } from './components/Navigation/Footer';
export { DropDownSearch } from './components/Navigation/DropSearch';
export { SearchFilters } from './components/Navigation/SearchFilters';
export { ShortcutsPopup } from './components/ShortcutsPopup';
export { ThemeProvider, useTheme } from './components/ThemeContext';

// TODO Cards
export * from './components/Cards/CardGrid';
export { CardItem } from './components/Cards/CardItem';

// TODO Home Page Specific
export { EpisodeCard } from './components/Home/EpisodeCard';
export { HomeCarousel } from './components/Home/HomeCarousel';
export { HomeSideBar } from './components/Home/HomeSideBar';

// TODO Skeletons for Loading States
export {
  SkeletonCard,
  SkeletonSlide,
  SkeletonPlayer,
} from './components/Skeletons/Skeletons';

// TODO Watching Anime Functionality
export { EpisodeList } from './components/Watch/EpisodeList';
export { EmbedPlayer } from './components/Watch/Video/EmbedPlayer';
export { Player } from './components/Watch/Video/Player'; // Notice: This is not a default export
export { MediaSource } from './components/Watch/Video/MediaSource';
export { WatchAnimeData } from './components/Watch/WatchAnimeData';
export { AnimeDataList } from './components/Watch/AnimeDataList';
export { Seasons } from './components/Watch/Seasons';

// TODO User Components
export { Settings } from './components/Profile/Settings';
export {
  SettingsProvider,
  useSettings,
} from './components/Profile/SettingsProvider';
export { WatchingAnilist } from './components/Profile/WatchingAnilist';

// * ==== Hooks ====
// TODO Utilizing API and Other Functionalities
export * from './hooks/useApi';
export * from './hooks/animeInterface';
export * from './hooks/useScroll';
export * from './hooks/useTIme';
export * from './hooks/useFilters';
export * from './hooks/useCountdown';

// * ==== Client ====
export { ApolloClientProvider } from './client/ApolloClient';
export * from './client/userInfoTypes';
export * from './client/authService';
export * from './client/useAuth';

// * ==== Pages ====
// TODO Main Pages of the Application
export { default as Home } from './pages/Home';
export { default as Search } from './pages/Search';
export { default as Watch } from './pages/Watch';
export { default as Profile } from './pages/Profile';
export { default as About } from './pages/About';
export { default as PolicyTerms } from './pages/PolicyTerms';
export { default as Page404 } from './pages/404';
export { default as Callback } from './pages/Callback';
