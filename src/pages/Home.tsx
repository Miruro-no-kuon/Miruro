import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Carousel from "../components/Home/Carousel";
import CardGrid, { StyledCardGrid } from "../components/Cards/CardGrid";
import CarouselSkeleton from "../components/Skeletons/CarouselSkeleton";
import CardSkeleton from "../components/Skeletons/CardSkeleton";
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchTopAnime,
} from "../hooks/useApi";
import { Link } from "react-router-dom";
const SimpleLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  max-width: 125rem;
  border-radius: var(--global-border-radius);
`;

const popInAnimation = keyframes`
  0% {
    opacity: 0.4;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0%);
  }
`;

const TabContainer = styled.div`
  display: flex; /* Make it a flex container */
  justify-content: center; /* This centers the children (tabs) horizontally */
  flex-wrap: wrap; /* Allows tabs to wrap if they don't fit */
  border-radius: var(--global-border-radius);
  width: 100%;
  gap: 1rem; /* Adds some space between your tabs if they wrap */
`;

// Correcting the type for the $isActive prop
interface TabProps {
  $isActive: boolean;
}
const Tab = styled.button<TabProps>`
  background: ${({ $isActive }) =>
    $isActive ? "var(--primary-accent)" : "transparent"};
  padding: 0.8rem 1rem 0.8rem 1rem;
  border-radius: var(--global-border-radius);
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: var(--global-text);
  position: relative;
  overflow: hidden;
  z-index: 1;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  transition: background-color 0.3s ease;

  &:hover {
    background: var(--primary-accent-bg);
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

const EpisodeCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 235px; // Adjust based on your layout needs
  border-radius: var(--global-border-radius);
  overflow: hidden;
  transition: 0.2s ease-in-out;
  
  img {
    animation: ${popInAnimation} 0.3s ease forwards;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9; // Ensure the image maintains a 16:9 aspect ratio
    object-fit: cover; // Crop the image to maintain aspect ratio
  }

  .episode-info {
    padding: 0.5rem;
    background: var(--global-shadow); // Adjust based on your theme

    .episode-title {
      font-size: 1rem;
      font-weight: bold;
      color: var(--global-text);
      margin: 0.5rem 0;
      min-height: 2rem;
      max-height: 2rem;
      @media (max-width: 500px) {
        font-size: 0.8rem;
        min-height: 2rem;
        max-height: 2rem;
        overflow: hidden;
      }
    }

    .episode-number {
      font-size: 0.9rem;
      color: var(--secondary-text);
      min-height: 2rem;
      max-height: 2rem;
      @media (max-width: 500px) {
        font-size: 0.8rem;
        min-height: 0.5rem;
        max-height: 0.5rem;
      }
    }
  }
  &:hover {
    transform: translateY(-10px);
    background: var(--primary-accent);
  }
  @media (max-width: 500px) {
    width: 175px; // Adjust based on your layout needs
    &:hover {
      transform: translateY(0px);
      background: var(--primary-accent); // Adjust based on your theme
    }
  }
`;

const EpisodeCardGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
  
  @media (max-width: 1200px) {
    gap: 2rem;
  }

  @media (max-width: 1000px) {
    gap: 1.5rem;
  }

  @media (max-width: 800px) {
    gap: 1.25rem;
  }

  @media (max-width: 450px) {
    gap: 0.9rem;
  }
`;

const FooterLink = styled(Link)`
  color: grey;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.05s ease-in-out;

  &:hover {
    color: var(--global-text);
  }
`;

const Home = () => {
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  const [itemsCount, setItemsCount] = useState(
    window.innerWidth > 500 ? 14 : 12
  );
  const [activeTab, setActiveTab] = useState(() => {
    const savedData = localStorage.getItem("home tab");
    if (savedData) {
      const { tab, timestamp } = JSON.parse(savedData);
      const now = new Date().getTime();
      // Check if the saved tab is older than 24 hours
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        return tab;
      } else {
        localStorage.removeItem("home tab"); // Clear expired data
      }
    }
    return "trending"; // Default tab if no/invalid saved data
  });
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    trending: true,
    popular: true,
    top: true,
  });
  useEffect(() => {
    const handleResize = () => {
      setItemsCount(window.innerWidth > 500 ? 14 : 12);
    };

    window.addEventListener("resize", handleResize);
    // Set initial value
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const fetchWatchedEpisodes = () => {
      const watchedEpisodesData = localStorage.getItem("watched-episodes");
      if (watchedEpisodesData) {
        const allEpisodes = JSON.parse(watchedEpisodesData);
        let latestEpisodes = [];

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
    const fetchData = async () => {
      try {
        // Reset error state on new fetch attempt
        setError(null);

        const [trending, popular, top] = await Promise.all([
          fetchTrendingAnime(1, itemsCount), // Use itemsCount here
          fetchPopularAnime(1, itemsCount), // And here
          fetchTopAnime(1, itemsCount), // And here
        ]);

        setTrendingAnime(trending.results);
        setPopularAnime(popular.results);
        setTopAnime(top.results);
      } catch (fetchError) {
        if (fetchError instanceof Error) {
          setError(fetchError.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading({ trending: false, popular: false, top: false });
      }
    };

    fetchData();
  }, [itemsCount]);

  useEffect(() => {
    document.title = `Miruro | Watch Anime for free in HD`;
  }, [activeTab]);

  useEffect(() => {
    const now = new Date().getTime();
    const tabData = JSON.stringify({ tab: activeTab, timestamp: now });
    localStorage.setItem("home tab", tabData);
  }, [activeTab]);

  const renderCardGrid = (
    animeData: any[],
    isLoading: boolean,
    hasError: boolean
  ) => (
    <Section>
      {isLoading || hasError ? (
        <StyledCardGrid>
          {Array.from({ length: 14 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </StyledCardGrid>
      ) : (
        <CardGrid
          animeData={animeData}
          totalPages={1} // Adjust as necessary
          hasNextPage={false} // Adjust as necessary
          onLoadMore={() => {}} // Placeholder for actual logic
        />
      )}
    </Section>
  );
  const EpisodeCardComponent = ({ episode, animeId }) => {
    const animeName = episode.id.split("-episode-")[0].replace(/-/g, " ");
    const truncatedAnimeName =
      animeName.length > 30 ? animeName.slice(0, 30) + "..." : animeName;

    const truncatedEpisodeTitle =
      episode.title && episode.title.length > 30
        ? episode.title.slice(0, 30) + "..."
        : episode.title;

    const episodeNumberText =
      window.innerWidth > 500
        ? `Episode ${episode.number}${
            truncatedEpisodeTitle ? `: ${truncatedEpisodeTitle}` : ""
          }`
        : `Episode ${episode.number}`;

    return (
      <FooterLink to={`/watch/${animeId}`} style={{ textDecoration: "none" }}>
        <EpisodeCard>
          <img src={episode.image} alt={`Cover for ${animeName}`} />
          <div className="episode-info">
            <p className="episode-title">
              {truncatedAnimeName
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
            <p className="episode-number">{episodeNumberText}</p>
          </div>
        </EpisodeCard>
      </FooterLink>
    );
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };
  const EpisodeCardGrid = ({ episodes }) => (
    <EpisodeCardGridContainer>
      {episodes.map((episode) => (
        <EpisodeCardComponent key={episode.id} episode={episode} />
      ))}
    </EpisodeCardGridContainer>
  );
  const renderWatchedEpisodes = () => {
    const watchedEpisodesData = localStorage.getItem("watched-episodes");
    let episodesToRender = [];

    if (watchedEpisodesData) {
      const allEpisodes = JSON.parse(watchedEpisodesData);

      for (const animeId in allEpisodes) {
        // Assuming we only want to render the last watched episode per anime
        const lastEpisode =
          allEpisodes[animeId][allEpisodes[animeId].length - 1];
        episodesToRender.push(
          <EpisodeCardComponent
            key={lastEpisode.id}
            episode={lastEpisode}
            animeId={animeId}
          />
        );
      }
    }

    return (
      <Section>
        <EpisodeCardGridContainer>{episodesToRender}</EpisodeCardGridContainer>
      </Section>
    );
  };

  return (
    <SimpleLayout>
      {error && (
        <ErrorMessage>
          <p>Error: {error}</p>
        </ErrorMessage>
      )}
      {loading.trending || error ? (
        <CarouselSkeleton />
      ) : (
        <Carousel data={trendingAnime} />
      )}

      <TabContainer>
        <Tab
          $isActive={activeTab === "trending"}
          onClick={() => handleTabClick("trending")}
        >
          Trending
        </Tab>
        <Tab
          $isActive={activeTab === "popular"}
          onClick={() => handleTabClick("popular")}
        >
          Popular
        </Tab>
        <Tab
          $isActive={activeTab === "top"}
          onClick={() => handleTabClick("top")}
        >
          Top Anime
        </Tab>
        {watchedEpisodes.length > 0 && (
          <Tab
            $isActive={activeTab === "continueWatching"}
            onClick={() => handleTabClick("continueWatching")}
          >
            Continue Watching
          </Tab>
        )}
      </TabContainer>

      {activeTab === "trending" &&
        renderCardGrid(trendingAnime, loading.trending, !!error)}
      {activeTab === "popular" &&
        renderCardGrid(popularAnime, loading.popular, !!error)}
      {activeTab === "top" && renderCardGrid(topAnime, loading.top, !!error)}
      {activeTab === "continueWatching" && renderWatchedEpisodes()}
    </SimpleLayout>
  );
};

export default Home;
