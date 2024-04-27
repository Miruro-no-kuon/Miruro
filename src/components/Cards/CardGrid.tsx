import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { CardItem, Anime } from '../../index';

interface CardGridProps {
  animeData: Anime[];
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  animeData,
  hasNextPage,
  onLoadMore,
}) => {
  const handleLoadMore = useCallback(() => {
    if (hasNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, onLoadMore]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.offsetHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      let threshold = 0;

      if (window.innerWidth <= 450) {
        threshold = 1;
      }

      if (windowHeight + scrollTop >= documentHeight - threshold) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleLoadMore, hasNextPage]);

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
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  grid-template-rows: auto;
  gap: 2rem;
  transition: 0s;

  @media (max-width: 1000px) {
    gap: 1.5rem;
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: 1rem;
  }

  @media (max-width: 450px) {
    grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
    gap: 0.8rem;
  }
`;
