import React, { useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
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

const CardItemContent = React.memo(({ anime, onHover, onLeave, isHovered }) => {
  const { width } = useWindowDimensions();
  const cardRef = useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (cardRef.current) {
      const cardPosition = getElementPosition(cardRef.current);
      const isLeft = cardPosition.left < width / 2;
      // No need to maintain hoverState state, compute directly in InfoPopupContent
    }
  }, [width]);

  const handleCardClick = () => {
    // Use React Router's navigate function for navigation
    navigate(`/watch/${anime.id}`);
  };

  return (
    <StyledCardWrapper
      onClick={handleCardClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
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
          $ishovered={isHovered}
        />

        <TitleComponent $ishovered={isHovered} anime={anime} />
      </StyledCardItem>

      {isHovered && (
        <InfoPopupContent
          title={anime.title.userPreferred}
          description={anime.description}
          genres={anime.genres}
          // Pass the position directly, if needed
          $isPositionedLeft={
            cardRef.current &&
            getElementPosition(cardRef.current).left < width / 2
          }
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
});

export default CardItemContent;
