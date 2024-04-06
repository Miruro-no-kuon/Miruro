import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  HomeCarousel as CarouselTrending,
  CardGrid,
  StyledCardGrid, // Assuming StyledCardGrid is a named export you want to use directly
  SkeletonSlide,
  SkeletonCard,
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchTopAnime,
  fetchRecentEpisodes,
  EpisodeCard as AnimeEpisodeCardComponent, // Assuming EpisodeCard is the actual export name
} from '../index'; // Adjust the import path to point correctly to your index.ts location
import { Episode } from '../index';

const SimpleLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  max-width: 125rem;
  border-radius: var(--global-border-radius);
`;

const TabContainer = styled.div`
  display: flex; /* Make it a flex container */
  justify-content: center; /* This centers the children (tabs) horizontally */
  flex-wrap: wrap; /* Allows tabs to wrap if they don't fit */
  border-radius: var(--global-border-radius);
  width: 100%;
  gap: 1rem; /* Adds some space between your tabs if they wrap */
`;

const Tab = styled.button<{ $isActive: boolean }>`
  background: ${({ $isActive }) =>
    $isActive ? 'var(--primary-accent)' : 'transparent'};
  padding: 1rem;
  border-radius: var(--global-border-radius);
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: var(--global-text);
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  transition: background-color 0.3s ease;

  &:hover,
  &:active,
  &:focus {
    background: var(--primary-accent);
  }
  @media (max-width: 500px) {
    padding: 0.5rem;
    margin-top: 0rem;
    margin-bottom: 0rem;
  }
`;

const Section = styled.section`
  padding: 0rem;
  border-radius: var(--global-border-radius);
`;

// Styled component for error messages
const ErrorMessage = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  background-color: #ffdddd;
  border-left: 4px solid #f44336;
  color: #f44336;
  border-radius: var(--global-border-radius);

  p {
    margin: 0;
    font-weight: bold;
  }
`;

const Home = () => {
  const [, /* watchedEpisodes */ setWatchedEpisodes] = useState<Episode[]>([]);
  const [itemsCount, setItemsCount] = useState(
    window.innerWidth > 500 ? 14 : 12,
  );
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [recentEpisodes, setRecentEpisodes] = useState([]); // State for recent episodes
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    trending: true,
    popular: true,
    top: true,
    recent: true, // Flag for recent episodes loading state
  });
  const [activeTab, setActiveTab] = useState(() => {
    const savedData = localStorage.getItem('home tab');
    if (savedData) {
      const { tab, timestamp } = JSON.parse(savedData);
      const now = new Date().getTime();
      // Check if the saved tab is older than 24 hours
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        return tab;
      } else {
        localStorage.removeItem('home tab'); // Clear expired data
      }
    }
    return 'trending'; // Default tab if no/invalid saved data
  });

  useEffect(() => {
    const handleResize = () => {
      setItemsCount(window.innerWidth > 500 ? 14 : 12);
    };

    window.addEventListener('resize', handleResize);
    // Set initial value
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchWatchedEpisodes = () => {
      const watchedEpisodesData = localStorage.getItem('watched-episodes');
      if (watchedEpisodesData) {
        const allEpisodes = JSON.parse(watchedEpisodesData);
        const latestEpisodes: Episode[] = []; // Correctly typed

        Object.keys(allEpisodes).forEach((animeId) => {
          const episodes = allEpisodes[animeId];
          // Assuming episodes are stored in order, take the last one as the most recent
          const latestEpisode = episodes[episodes.length - 1];
          latestEpisodes.push(latestEpisode);
        });

        setWatchedEpisodes(latestEpisodes);
      }
    };

    fetchWatchedEpisodes();
  }, []);

  useEffect(() => {
    const desiredItemCount = itemsCount;
    // Increase initial fetch count by 40% to account for filtering
    const fetchCount = Math.ceil(itemsCount * 1.4);

    const fetchData = async () => {
      try {
        // Reset error state on new fetch attempt
        setError(null);

        const [trending, popular, top, recent] = await Promise.all([
          fetchTrendingAnime(1, fetchCount),
          fetchPopularAnime(1, fetchCount),
          fetchTopAnime(1, fetchCount),
          fetchRecentEpisodes(1, fetchCount),
        ]);
        const recentEpisodesTrimmed = recent.results.slice(0, 14); // Always trim to 14
        setRecentEpisodes(recentEpisodesTrimmed);

        // Filter out anime without totalEpisodes, duration, or releaseDate
        const filterAndTrimAnime = (animeList: any) =>
          animeList.results
            .filter(
              (anime: any) =>
                anime.totalEpisodes !== null &&
                anime.duration !== null &&
                anime.releaseDate !== null,
            )
            .slice(0, desiredItemCount); // Trim the list to the desired item count

        setTrendingAnime(filterAndTrimAnime(trending));
        setPopularAnime(filterAndTrimAnime(popular));
        setTopAnime(filterAndTrimAnime(top));
      } catch (fetchError) {
        if (fetchError instanceof Error) {
          setError(fetchError.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading({
          trending: false,
          popular: false,
          top: false,
          recent: false,
        });
      }
    };

    fetchData();
  }, [itemsCount]);

  useEffect(() => {
    document.title = `Miruro | Watch HD Anime for Free`;
  }, [activeTab]);

  useEffect(() => {
    const now = new Date().getTime();
    const tabData = JSON.stringify({ tab: activeTab, timestamp: now });
    localStorage.setItem('home tab', tabData);
  }, [activeTab]);

  const renderCardGrid = (
    animeData: any[],
    isLoading: boolean,
    hasError: boolean,
  ) => (
    <Section>
      {isLoading || hasError ? (
        <StyledCardGrid>
          {Array.from({ length: 14 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </StyledCardGrid>
      ) : (
        <CardGrid
          animeData={animeData}
          hasNextPage={false} // Adjust as necessary
          onLoadMore={() => {}} // Placeholder for actual logic
        />
      )}
    </Section>
  );
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <SimpleLayout>
      {error && (
        <ErrorMessage title='Error Message'>
          <p>ERROR: {error}</p>
        </ErrorMessage>
      )}
      {loading.trending || error ? (
        <SkeletonSlide />
      ) : (
        <CarouselTrending
          data={trendingAnime}
          loading={loading.trending}
          error={error}
        />
      )}
      <TabContainer>
        <Tab
          title='Trending Tab'
          $isActive={activeTab === 'trending'}
          onClick={() => handleTabClick('trending')}
        >
          TRENDING
        </Tab>
        <Tab
          title='Popular Tab'
          $isActive={activeTab === 'popular'}
          onClick={() => handleTabClick('popular')}
        >
          POPULAR
        </Tab>
        <Tab
          title='Top Anime Tab'
          $isActive={activeTab === 'top'}
          onClick={() => handleTabClick('top')}
        >
          TOP ANIME
        </Tab>
        <Tab
          title='Recent Episodes Tab'
          $isActive={activeTab === 'recent'}
          onClick={() => handleTabClick('recent')}
        >
          RECENTLY UPDATED
        </Tab>
      </TabContainer>
      {/* Render other sections based on activeTab */}
      {activeTab === 'trending' &&
        renderCardGrid(trendingAnime, loading.trending, !!error)}
      {activeTab === 'popular' &&
        renderCardGrid(popularAnime, loading.popular, !!error)}
      {activeTab === 'top' && renderCardGrid(topAnime, loading.top, !!error)}
      {activeTab === 'recent' &&
        renderCardGrid(recentEpisodes, loading.recent, !!error)}
      <AnimeEpisodeCardComponent />
    </SimpleLayout>
  );
};

export default Home;
