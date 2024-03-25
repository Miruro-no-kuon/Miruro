import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CardItem from "./CardItem";

interface CardGridProps {
  animeData: Anime[];
  hasNextPage: boolean;
  onLoadMore: () => void;
}

interface Anime {
  id: string;
  coverImage?: string;
  image?: string;
  title: {
    romaji?: string;
    english?: string;
  };
  rating: number;
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

const CardGrid: React.FC<CardGridProps> = ({
  animeData,
  hasNextPage,
  onLoadMore,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 0);
    return () => clearTimeout(loadingTimeout);
  }, [animeData]);

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      setLoading(true);
      onLoadMore();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.offsetHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      const threshold = 1000;

      if (windowHeight + scrollTop >= documentHeight - threshold) {
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
      {animeData.map((anime) => (
        <CardItem key={anime.id} anime={anime} />
      ))}
    </StyledCardGrid>
  );
};

export const StyledCardGrid = styled.div`
  margin: 0 auto;
  display: grid;
  position: relative;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  grid-template-rows: auto;
  gap: 2.75rem;
  transition: 0s;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 2rem;
  }

  @media (max-width: 1000px) {
    gap: 1.5rem;
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: 450px) {
    grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
    gap: 0.9rem;
  }
`;

export default CardGrid;
