import React, { useState, useEffect, useRef, useMemo } from "react";
import styled /* keyframes */ from "styled-components";
// Assuming CardItem and CardSkeleton are correctly typed elsewhere
import CardItem from "./CardItem";
import CardSkeleton from "../Skeletons/CardSkeleton";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";

// Define types for the props
interface CardGridProps {
  animeData: Anime[];
  totalPages: number;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

// Assuming you have a type for your anime data
interface Anime {
  id: string;
  coverImage?: string;
  image?: string;
  title: {
    romaji?: string;
    english?: string;
  };
  rating?: {
    anilist?: number;
  };
  color?: string;
  format?: string;
  type?: string;
  totalEpisodes?: number;
  currentEpisode?: number;
  description?: string;
  genres?: string[];
  status?: string;
  popularity?: {
    anidb?: number;
  };
  releaseDate?: string;
  year?: string;
}

const CardGrid: React.FC<CardGridProps> = ({
  animeData,
  // totalPages,
  hasNextPage,
  onLoadMore,
}) => {
  const [loading, setLoading] = useState(true);
  // const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [hoveredCardInstant, setHoveredCardInstant] = useState<string | null>(
    null
  );
  const [hoveredCardDelayed, setHoveredCardDelayed] = useState<string | null>(
    null
  );
  // const [loadMoreClicked, setLoadMoreClicked] = useState(false);
  const hoverTimeouts = useRef<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>({});

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
      // setShowLoadMoreButton(true);
      // setLoadMoreClicked(false);
    }, 0);
    return () => clearTimeout(loadingTimeout);
  }, [animeData]);

  const handleCardHover = useMemo(
    () => (animeId: string) => {
      setHoveredCardInstant(animeId); // Set instant hover state

      if (hoverTimeouts.current[animeId]) {
        clearTimeout(hoverTimeouts.current[animeId]);
      }

      hoverTimeouts.current[animeId] = setTimeout(() => {
        setHoveredCardDelayed(animeId); // Set delayed hover state
      }, 200);
    },
    []
  );

  const handleCardLeave = useMemo(
    () => (animeId: string) => {
      setHoveredCardInstant(null); // Clear instant hover state

      if (hoverTimeouts.current[animeId]) {
        clearTimeout(hoverTimeouts.current[animeId]);
      }
      setHoveredCardDelayed(null); // Clear delayed hover state
    },
    []
  );

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      setLoading(true);
      onLoadMore();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasNextPage]);

  return (
    <StyledCardGrid>
      {loading
        ? Array.from({ length: animeData.length }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        : animeData.map((anime) => (
            <CardItem
              key={anime.id}
              anime={anime}
              onHover={() => handleCardHover(anime.id)}
              onLeave={() => handleCardLeave(anime.id)}
              isHoveredInstant={hoveredCardInstant === anime.id}
              isHoveredDelayed={hoveredCardDelayed === anime.id}
            />
          ))}
    </StyledCardGrid>
  );
};

// No changes below this line, assuming Styled Components are correctly typed
export const StyledCardGrid = styled.div`
  margin: 0 auto;
  display: grid;
  position: relative;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  grid-template-rows: auto;
  gap: 1.75rem;
  transition: grid-template-columns 0.5s ease-in-out;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: 1rem;
  }
`;

/* const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`; */

/* const LoadMoreButton = styled.button`
  display: flex;
  align-items: center;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  justify-content: center;
  text-align: center;
  color: var(--global-card-button-shadow);
  border: 1px solid var(--global-card-button-shadow);
  border-radius: 0.2rem;
  margin: 0 0 2.5rem 0;
  padding: 1rem 1rem;
  background: transparent;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s ease;

  &:hover {
    border: 1px solid var(--global-text);
    color: var(--global-text);
  }

  .icon {
    margin-right: 0.8rem;
  }
`; */

/* const LoadMoreText = styled.span`
  font-size: 1rem;
`; */

export default CardGrid;
