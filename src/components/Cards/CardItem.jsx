import React, { useEffect, useRef, useState } from "react";
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

const CardItemContent = React.memo(
  ({ anime, onHover, onLeave, isHoveredInstant, isHoveredDelayed }) => {
    const [isMobile, setIsMobile] = useState(isMobileDevice());
    const { width } = useWindowDimensions();
    const cardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(isMobileDevice());
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      if (cardRef.current) {
        const cardPosition = getElementPosition(cardRef.current);
        const isLeft = cardPosition.left < width / 2;
      }
    }, [width]);

    const {
      coverImage,
      bannerImage,
      releaseDate,
      popularity,
      format,
      type,
      totalEpisodes,
      currentEpisode,
      description,
      genres,
    } = anime;

    const altText = anime.title?.romaji || anime.title?.english;

    // Use rating.anilist if available, otherwise null
    const ratingValue =
      typeof anime.rating === "number"
        ? anime.rating
        : anime.rating?.anilist ?? null;

    function isMobileDevice() {
      const userAgent =
        typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return mobileRegex.test(userAgent) || window.innerWidth <= 768;
    }

    const handleCardClick = () => {
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
            imageSrc={anime.coverImage || anime.image}
            altText={altText}
            type={format || type}
            totalEpisodes={totalEpisodes}
            rating={ratingValue}
            color={anime.color}
            $ishovered={isHoveredInstant}
          />

          <TitleComponent $ishovered={isHoveredInstant} anime={anime} />
        </StyledCardItem>

        {!isMobile && isHoveredDelayed && (
          <InfoPopupContent
            title={altText}
            description={description}
            genres={genres}
            $isPositionedLeft={
              cardRef.current &&
              getElementPosition(cardRef.current).left < width / 2
            }
            color={anime.color}
            type={format || type}
            status={anime.status}
            popularity={popularity?.anidb || popularity}
            totalEpisodes={totalEpisodes}
            currentEpisode={currentEpisode}
            releaseDate={releaseDate || anime.year}
            cover={bannerImage || anime.cover}
            maxDescriptionLength={100}
          />
        )}
      </StyledCardWrapper>
    );
  }
);

export default CardItemContent;
