import React, { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import ImageDisplay from "./ImageDisplay";
import InfoPopupContent from "./InfoPopup";
import TitleComponent from "./TitleDisplay";
import {
  useWindowDimensions,
  getElementPosition,
} from "../../hooks/useWindowDimensions";

const popInAnimation = keyframes`
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const StyledCardWrapper = styled.div`
  animation: ${popInAnimation} 0.4s ease forwards;
  &:hover {
    z-index: 2;
  }
`;

const StyledCardItem = styled.div`
  max-width: 100%;
  border-radius: 0.2rem;
  cursor: pointer;
  transform: scale(1);
  transition: 0.2s;
`;

const CardItemContent = ({ anime }) => {
  const [hoverState, setHoverState] = useState({
    isHovered: false,
    isPositionedLeft: true,
  });
  const [showInfoPopup, setShowInfoPopup] = useState(false); // Added state to control popup visibility
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const handleCardHover = useCallback(() => {
    const cardPosition = getElementPosition(cardRef.current);
    const isLeft = cardPosition.left < width / 2;
    setHoverState((prevState) => ({
      ...prevState,
      isPositionedLeft: isLeft,
    }));

    // Set a delay (e.g., 500ms) before showing the InfoPopupContent
    const delayTimeout = setTimeout(() => {
      setShowInfoPopup(true);
    }, 0);

    // Clear the timeout if the user moves the cursor out before the delay
    return () => clearTimeout(delayTimeout);
  }, [width]);

  const handleCardClick = useCallback(() => {
    navigate(`/watch/${anime.id}`);
  }, [anime.id, navigate]);

  const cardRef = React.useRef(null);

  return (
    <StyledCardWrapper
      onClick={handleCardClick}
      onMouseEnter={() => setHoverState({ ...hoverState, isHovered: true })}
      onMouseLeave={() => {
        setHoverState({ ...hoverState, isHovered: false });
        setShowInfoPopup(false); // Hide the popup when the cursor leaves
      }}
      onMouseOver={handleCardHover}
      color={anime.color}
    >
      <StyledCardItem ref={cardRef}>
        <ImageDisplay
          imageSrc={anime.image}
          altText={anime.title.userPreferred}
          type={anime.type}
          totalEpisodes={anime.totalEpisodes}
          rating={anime.rating}
          color={anime.color}
          $ishovered={hoverState.isHovered}
        />

        <TitleComponent
          $ishovered={hoverState.isHovered}
          anime={anime}
        />
      </StyledCardItem>

      {hoverState.isHovered && showInfoPopup && (
        <InfoPopupContent
          title={anime.title.userPreferred}
          description={anime.description}
          genres={anime.genres}
          $isPositionedLeft={hoverState.isPositionedLeft}
          color={anime.color}
          type={anime.type}
          status={anime.status}
          popularity={anime.popularity}
          totalEpisodes={anime.totalEpisodes}
          currentEpisode={anime.currentEpisode}
          releaseDate={anime.releaseDate}
          cover={anime.cover}
          maxDescriptionLength={100}
        />
      )}
    </StyledCardWrapper>
  );
};

export default CardItemContent;
