import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import CardSkeleton from "../Skeletons/CardSkeleton";
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
  episodes?: number;

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
  border-radius: var(--global-border-radius);
  cursor: pointer;
  transform: scale(1);
  transition: 0.2s ease-in-out;
`;

const ImageDisplayWrapper = styled.div`
  transition: 0.2s ease-in-out;
  &:hover {
    transform: translateY(-10px); /* Move card up by 10 pixels on hover */
  }
`;

const CardItemContent: React.FC<CardItemContentProps> = React.memo(
  ({ anime, onHover, onLeave, isHoveredInstant, isHoveredDelayed }) => {
    const [isMobile, setIsMobile] = useState(isMobileDevice());
    const [loading, setLoading] = useState(true); // Added loading state
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

    useEffect(() => {
      // Simulate loading of card data
      // In a real application, this might be replaced with an API call
      const timer = setTimeout(() => {
        setLoading(false); // Set loading to false after data is "loaded"
      }, 50); // Simulate a loading time

      return () => clearTimeout(timer);
    }, [anime.id]); // Dependency array includes anime.id to re-run effect if it changes

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
      <>
        {loading ? (
          <CardSkeleton />
        ) : (
          <StyledCardWrapper
            onClick={handleCardClick}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            color={animeColor}
          >
            <StyledCardItem ref={cardRef}>
              <ImageDisplayWrapper>
                <ImageDisplay
                  imageSrc={imageSrc}
                  altText={anime.title?.english || anime.title?.romaji || ""}
                  type={anime.format || anime.type || ""}
                  totalEpisodes={
                    anime.currentEpisode ||
                    anime.totalEpisodes ||
                    anime.episodes
                  }
                  rating={
                    typeof anime.rating === "number"
                      ? anime.rating
                      : anime.rating?.anilist ?? undefined
                  }
                  color={animeColor}
                  $ishovered={isHoveredInstant}
                />
              </ImageDisplayWrapper>
              <TitleComponent isHovered={isHoveredInstant} anime={anime} />
            </StyledCardItem>
            {/* {!isMobile && isHoveredDelayed && (
              <InfoPopupContent
                title={anime.title?.english || anime.title?.romaji || ""}
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
            )} */}
          </StyledCardWrapper>
        )}
      </>
    );
  }
);

export default CardItemContent;
