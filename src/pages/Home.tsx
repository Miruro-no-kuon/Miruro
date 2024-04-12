import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  HomeCarousel as CarouselTrending,
  CardGrid,
  StyledCardGrid,
  SkeletonSlide,
  SkeletonCard,
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchTopAnime,
  fetchTopAiringAnime,
  fetchRecentEpisodes,
  HomeSideBar,
  EpisodeCard,
} from '../index';
import { Anime, Episode } from '../hooks/interface';

const SimpleLayout = styled.div`
  gap: 1rem;
  margin: 0 auto;
  max-width: 125rem;
  border-radius: var(--global-border-radius);
  display: flex;
  flex-direction: column;
`;
const ContentSidebarLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  @media (min-width: 1000px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const TabContainer = styled.div`
  display: flex; /* Make it a flex container */
  flex-direction: row;
  justify-content: center; /* This centers the children (tabs) horizontally */
  flex-wrap: wrap; /* Allows tabs to wrap if they don't fit */
  border-radius: var(--global-border-radius);
  width: 100%;
  gap: 0.5rem; /* Adds some space between your tabs if they wrap */
  margin: 1rem 0;
`;

const Tab = styled.div<{ $isActive: boolean }>`
  background: ${({ $isActive }) =>
    $isActive ? 'var(--primary-accent)' : 'transparent'};
  border-radius: var(--global-border-radius);
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: var(--global-text);
  position: relative;
  overflow: hidden;
  margin: 0 0 1rem 0;
  font-size: 0.8rem;
  padding: 1rem;

  transition: background-color 0.3s ease;

  &:hover,
  &:active,
  &:focus {
    background: var(--primary-accent);
  }
  @media (max-width: 500px) {
    padding: 0.5rem;
    margin: 0;
  }
`;

const Section = styled.section`
  padding: 0rem;
  border-radius: var(--global-border-radius);
`;

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
    window.innerWidth > 500 ? 18 : 12,
  );
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [topAiring, setTopAiring] = useState<Anime[]>([]);
  const [recentEpisodes, setRecentEpisodes] = useState<Anime[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    trending: true,
    popular: true,
    topRated: true,
    topAiring: true,
    recent: true,
  });
  const [activeTab, setActiveTab] = useState(() => {
    const savedData = localStorage.getItem('home tab');
    if (savedData) {
      const { tab, timestamp } = JSON.parse(savedData);
      const now = new Date().getTime();

      if (now - timestamp < 24 * 60 * 60 * 1000) {
        return tab;
      } else {
        localStorage.removeItem('home tab');
      }
    }
    return 'trending';
  });

  useEffect(() => {
    const handleResize = () => {
      setItemsCount(window.innerWidth > 500 ? 18 : 12);
    };

    window.addEventListener('resize', handleResize);

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
        const latestEpisodes: Episode[] = [];

        Object.keys(allEpisodes).forEach((animeId) => {
          const episodes = allEpisodes[animeId];

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

    const fetchCount = Math.ceil(itemsCount * 1.8);

    const fetchData = async () => {
      try {
        setError(null);

        const [trending, popular, topRated, topAiring, recent] =
          await Promise.all([
            fetchTrendingAnime(1, fetchCount),
            fetchPopularAnime(1, fetchCount),
            fetchTopAnime(1, fetchCount),
            fetchTopAiringAnime(1, 10),
            fetchRecentEpisodes(1, fetchCount),
          ]);
        const recentEpisodesTrimmed = recent.results.slice(0, itemsCount);
        setRecentEpisodes(recentEpisodesTrimmed);

        const filterAndTrimAnime = (animeList: any) =>
          animeList.results
            .filter(
              (anime: Anime) =>
                anime.totalEpisodes !== null &&
                anime.duration !== null &&
                anime.releaseDate !== null,
            )
            .slice(0, desiredItemCount);

        setTrendingAnime(filterAndTrimAnime(trending));
        setPopularAnime(filterAndTrimAnime(popular));
        setTopAnime(filterAndTrimAnime(topRated));
        setTopAiring(filterAndTrimAnime(topAiring));
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
          topRated: false,
          topAiring: false,
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
    animeData: Anime[],
    isLoading: boolean,
    hasError: boolean,
  ) => (
    <Section>
      {isLoading || hasError ? (
        <StyledCardGrid>
          {Array.from({ length: itemsCount }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </StyledCardGrid>
      ) : (
        <CardGrid
          animeData={animeData}
          hasNextPage={false}
          onLoadMore={() => {}}
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
      <ContentSidebarLayout>
        <div style={{ flexGrow: 1 }}>
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
              title='Top Rated Tab'
              $isActive={activeTab === 'topRated'}
              onClick={() => handleTabClick('topRated')}
            >
              TOP RATED
            </Tab>
            {/* <Tab
              title='Top Airing Tab'
              $isActive={activeTab === 'topAiring'}
              onClick={() => handleTabClick('topAiring')}
            >
              TOP AIRING
            </Tab> */}
            {/* <Tab
              title='Recent Episodes Tab'
              $isActive={activeTab === 'recent'}
              onClick={() => handleTabClick('recent')}
            >
              RECENTLY UPDATED
            </Tab> */}
          </TabContainer>

          {/* Render sections based on activeTab */}
          {activeTab === 'trending' &&
            renderCardGrid(trendingAnime, loading.trending, !!error)}
          {activeTab === 'popular' &&
            renderCardGrid(popularAnime, loading.popular, !!error)}
          {activeTab === 'topRated' &&
            renderCardGrid(topAnime, loading.topRated, !!error)}
          {activeTab === 'topAiring' &&
            renderCardGrid(topAiring, loading.topRated, !!error)}
          {activeTab === 'recent' &&
            renderCardGrid(recentEpisodes, loading.recent, !!error)}
        </div>
        <div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              margin: '0 0 0.5rem 0',
              padding: '1rem 0',
            }}
          >
            TOP AIRING
          </div>
          <HomeSideBar animeData={topAiring} />
        </div>
      </ContentSidebarLayout>
      <EpisodeCard />
    </SimpleLayout>
  );
};

export default Home;
