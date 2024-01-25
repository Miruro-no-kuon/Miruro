import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CardItem from "./CardItem";
import CardSkeleton from "../Skeletons/CardSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";

const CardGrid = ({ animeData, totalPages, hasNextPage, onLoadMore }) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setShowLoadMoreButton(true);
    }, 1000); // Adjust the timeout as needed
  }, []);

  const renderLoadMoreButton = () => {
    if (hasNextPage && showLoadMoreButton) {
      return (
        <LoadMoreButton onClick={onLoadMore} disabled={loadingMore}>
          <FontAwesomeIcon icon={faArrowCircleDown} className="icon" />
          <LoadMoreText>
            {loadingMore ? "Loading..." : "Load More"}
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
        : animeData.map((anime) => <CardItem key={anime.id} anime={anime} />)}
      {renderLoadMoreButton()}
    </StyledCardGrid>
  );
};

const StyledCardGrid = styled.div`
  margin: 0 auto;
  display: grid;
  position: relative;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  grid-template-rows: auto;
  gap: 1.25rem;
  transition: grid-template-columns 0.5s ease-in-out;
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
  color: var(--global-text);
  border: 1px solid var(--global-text);
  border-radius: 0.2rem;
  margin: 0 0 2.5rem 0;
  padding: 1rem 1rem;
  background: transparent;
  cursor: pointer;
  font-weight: bold;
  transition: outline 0.1s ease;

  &:hover {
    outline: 3px solid var(--global-text);
  }

  .icon {
    margin-right: 0.8rem;
  }
}
`;

const LoadMoreText = styled.span`
  font-size: 1rem;
`;

export default CardGrid;
