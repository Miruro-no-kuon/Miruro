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

interface CardItemContentProps {
  anime: Anime;
  onHover: () => void;
  onLeave: () => void;
  isHoveredInstant: boolean;
  isHoveredDelayed: boolean;
}

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

const CardItemContent: React.FC<CardItemContentProps> = React.memo(
  ({ anime, onHover, onLeave, isHoveredInstant, isHoveredDelayed }) => {
    const [isMobile, setIsMobile] = useState(isMobileDevice());
    const { width } = useWindowDimensions();
    const cardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
      // Check mobile device on window resize
      const handleResize = () => {
        setIsMobile(isMobileDevice());
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

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

    const imageSrc = anime.coverImage || anime.image || "";
    const animeColor = anime.color || "#999999";

    const popularityValue =
      typeof anime.popularity === "number"
        ? anime.popularity
        : anime.popularity?.anidb;

    return (
      <StyledCardWrapper
        onClick={handleCardClick}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        color={animeColor}
      >
        <StyledCardItem ref={cardRef}>
          <ImageDisplay
            imageSrc={imageSrc}
            altText={anime.title?.romaji || anime.title?.english || ""}
            type={anime.format || anime.type || ""}
            totalEpisodes={anime.totalEpisodes}
            rating={
              typeof anime.rating === "number"
                ? anime.rating
                : anime.rating?.anilist ?? undefined
            }
            color={animeColor}
            $ishovered={isHoveredInstant}
          />
          <TitleComponent $ishovered={isHoveredInstant} anime={anime} />
        </StyledCardItem>
        {!isMobile && isHoveredDelayed && (
          <InfoPopupContent
            title={anime.title?.romaji || anime.title?.english || ""}
            description={anime.description || ""}
            genres={anime.genres || []}
            $isPositionedLeft={
              cardRef.current &&
              getElementPosition(cardRef.current).left < width / 2
                ? true
                : false
            }
            color={animeColor}
            type={anime.format || anime.type || ""}
            status={anime.status || ""}
            popularity={popularityValue || 0}
            totalEpisodes={anime.totalEpisodes}
            currentEpisode={anime.currentEpisode}
            releaseDate={anime.releaseDate || anime.year || ""}
            cover={anime.image || anime.coverImage || ""}
            maxDescriptionLength={100}
          />
        )}
      </StyledCardWrapper>
    );
  }
);

export default CardItemContent;
