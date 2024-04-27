// WatchingAnimeList.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchWatchingAnime } from './../../hooks/authService';
import { useAuth } from '../../hooks/authContext';

const AnimeListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const AnimeCard = styled.div`
  width: 200px;
  border: 1px solid #ccc;
  border-radius: var(--global-border-radius);
  overflow: hidden;
`;

const AnimeCover = styled.img`
  width: 100%;
  height: auto;
`;

const AnimeTitle = styled.div`
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
`;

export const WatchingAnilist: React.FC = () => {
  const [animeList, setAnimeList] = useState([]);
  const { isLoggedIn } = useAuth();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      fetchWatchingAnime(accessToken)
        .then(setAnimeList)
        .catch((error) => console.error('Error loading anime list:', error));
    }
  }, [isLoggedIn, accessToken]);

  return (
    <AnimeListContainer>
      {animeList.map((anime: any) => (
        <AnimeCard key={anime.id}>
          <AnimeCover
            src={anime.coverImage.extraLarge}
            alt={anime.title.userPreferred}
          />
          <AnimeTitle>{anime.title.userPreferred}</AnimeTitle>
        </AnimeCard>
      ))}
    </AnimeListContainer>
  );
};
