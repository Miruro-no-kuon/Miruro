import React, { useState, useEffect, useRef, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import CardItem from "./CardItem";
import CardSkeleton from "../Skeletons/CardSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";

const CardGrid = ({ animeData, totalPages, hasNextPage, onLoadMore }) => {
  const [loading, setLoading] = useState(true);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loadMoreClicked, setLoadMoreClicked] = useState(false);
  const hoverTimeouts = useRef({});

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
      setShowLoadMoreButton(true);
      setLoadMoreClicked(false); // Reset the load more click state when new data is loaded
    }, 0);

    return () => clearTimeout(loadingTimeout);
  }, [animeData]); // Update the dependency array to include animeData

  const handleLoadMoreClick = () => {
    setLoadMoreClicked(true); // Disable the button once clicked
    onLoadMore();
  };

  const handleCardHover = useMemo(
    () => (animeId) => {
      if (hoverTimeouts.current[animeId]) {
        clearTimeout(hoverTimeouts.current[animeId]);
      }

      hoverTimeouts.current[animeId] = setTimeout(() => {
        if (hoveredCard !== animeId) {
          setHoveredCard(animeId);
        }
      }, 0);
    },
    [hoveredCard]
  );

  const handleCardLeave = useMemo(
    () => (animeId) => {
      if (hoverTimeouts.current[animeId]) {
        clearTimeout(hoverTimeouts.current[animeId]);
      }
      if (hoveredCard !== null) {
        setHoveredCard(null);
      }
    },
    [hoveredCard]
  );

  const renderLoadMoreButton = () => {
    if (hasNextPage && showLoadMoreButton) {
      return (
        <LoadMoreButton
          onClick={handleLoadMoreClick}
          disabled={loading || loadMoreClicked} // Button is disabled when loading or already clicked
        >
          <FontAwesomeIcon icon={faArrowCircleDown} className="icon" />
          <LoadMoreText>
            {loading || loadMoreClicked ? "Loading..." : "Load More"}
          </LoadMoreText>
        </LoadMoreButton>
      );
    }
    return null;
  };

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
              isHovered={hoveredCard === anime.id}
            />
          ))}
      {renderLoadMoreButton()}
    </StyledCardGrid>
  );
};

export const StyledCardGrid = styled.div`
  margin: 0 auto;
  display: grid;
  position: relative;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  grid-template-rows: auto;
  gap: 1.75rem;
  transition: grid-template-columns 0.5s ease-in-out;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(
      auto-fill,
      minmax(10rem, 1fr)
    ); // smaller columns on tablets and smaller devices
    gap: 1.5rem;
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(
      auto-fill,
      minmax(8rem, 1fr)
    ); // even smaller columns on mobile devices
    gap: 1rem;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const LoadMoreButton = styled.button`
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
`;

const LoadMoreText = styled.span`
  font-size: 1rem;
`;

export default CardGrid;
