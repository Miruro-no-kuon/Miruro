import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Episode } from '../../index';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const LOCAL_STORAGE_KEYS = {
  WATCHED_EPISODES: 'watched-episodes',
  LAST_ANIME_VISITED: 'last-anime-visited',
};

interface LastEpisodes {
  [key: string]: Episode;
}

interface LastVisitedData {
  [key: string]: {
    timestamp?: number;
    titleEnglish?: string;
    titleRomaji?: string;
  };
}

const StyledSwiperContainer = styled(Swiper)`
  position: relative;
  max-width: 100%;
  height: auto;
  border-radius: var(--global-border-radius);
  cursor: grab;
`;

const StyledSwiperSlide = styled(SwiperSlide)``;

const PlayIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 2.5rem;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnimeEpisodeCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  padding: 0;
  border-radius: var(--global-border-radius);
  overflow: hidden;
  transition: 0.2s ease-in-out;
  transition-delay: 0.25s;

  &:hover,
  &:active,
  &:focus {
    box-shadow: 2px 2px 10px var(--global-card-hover-shadow);
    ${PlayIcon} {
      opacity: 1;
    }

    img {
      filter: brightness(0.5); // Optional: Slightly darken the image itself
    }
  }

  @media (min-width: 768px) {
    &:hover,
    &:active,
    &:focus {
      // transform: translateY(-10px);
    }
  }

  img {
    animation: slideDown 0.5s ease-in-out;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    transition: filter 0.2s ease-in-out; // Smooth transition for the filter
  }
  .episode-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0.5rem;
    background: linear-gradient(
      360deg,
      rgba(8, 8, 8, 1) -15%,
      transparent 100%
    );
    color: white;
    .episode-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.95rem;
      font-weight: bold;
      margin: 0.25rem 0;
    }
    .episode-number {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.65);
      margin: 0;
    }
  }
`;

const Section = styled.section`
  padding: 0rem;
  border-radius: var(--global-border-radius);
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.25rem;
  border-radius: var(--global-border-radius);
  background-color: var(--primary-accent);
  transition: width 0.3s ease-in-out;
`;

const ContinueWatchingTitle = styled.h2`
  color: var(--global-text);
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: none;
  animation: slideDown 0.25s ease-in-out;
  transition: 0.2s ease-in-out;
  padding-right: 0.2rem;
  padding-top: 0.2rem;

  svg {
    transition: 0.2s ease-in-out;
    transform: scale(0.95);
    font-size: 1.75rem;
    &:hover,
    &:active,
    &:focus {
      transform: scale(1);
    }
  }
  ${AnimeEpisodeCard}:hover & {
    display: block; // Show only on hover
  }
`;

const FaCircle = styled(IoIosCloseCircleOutline)`
  font-size: 2.25rem;
`;

const calculateSlidesPerView = (windowWidth: number): number => {
  if (windowWidth >= 1200) return 5;
  if (windowWidth >= 1000) return 4;
  if (windowWidth >= 700) return 3;
  if (windowWidth >= 500) return 2;
  return 2;
};

export const EpisodeCard: React.FC = () => {
  const [watchedEpisodesData, setWatchedEpisodesData] = useState(
    localStorage.getItem('watched-episodes'),
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const lastVisitedData = useMemo<LastVisitedData>(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_ANIME_VISITED);
    return data ? JSON.parse(data) : {};
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    const debouncedResize = setTimeout(handleResize, 200);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(debouncedResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const episodesToRender = useMemo(() => {
    if (!watchedEpisodesData) return [];
    try {
      const allEpisodes: Record<string, Episode[]> =
        JSON.parse(watchedEpisodesData);

      const lastEpisodes = Object.entries(allEpisodes).reduce<LastEpisodes>(
        (acc, [animeId, episodes]) => {
          const lastEpisode = episodes[episodes.length - 1]; // Assuming the episodes are in order
          if (lastEpisode) {
            acc[animeId] = lastEpisode;
          }
          return acc;
        },
        {},
      );

      const orderedAnimeIds = Object.keys(lastEpisodes).sort((a, b) => {
        const lastVisitedA = lastVisitedData[a]?.timestamp || 0;
        const lastVisitedB = lastVisitedData[b]?.timestamp || 0;
        return lastVisitedB - lastVisitedA;
      });

      return orderedAnimeIds.map((animeId) => {
        const episode = lastEpisodes[animeId];
        const playbackInfo = JSON.parse(
          localStorage.getItem('all_episode_times') || '{}',
        ) as { [key: string]: { playbackPercentage: number } };

        const playbackPercentage =
          playbackInfo[episode.id]?.playbackPercentage || 0;

        // Determine anime title, preferring English, falling back to Romaji, then to "Episode Title"
        const animeTitle =
          lastVisitedData[animeId]?.titleEnglish ||
          lastVisitedData[animeId]?.titleRomaji ||
          '';

        // Conditional title display
        const displayTitle = `${animeTitle}${episode.title ? ` - ${episode.title}` : ''}`;

        const handleRemoveAllEpisodes = (animeId: string) => {
          const updatedEpisodes = JSON.parse(watchedEpisodesData || '{}');
          delete updatedEpisodes[animeId];

          const newWatchedEpisodesData = JSON.stringify(updatedEpisodes);
          localStorage.setItem('watched-episodes', newWatchedEpisodesData);
          setWatchedEpisodesData(newWatchedEpisodesData); // Trigger re-render
        };

        return (
          <StyledSwiperSlide key={episode.id}>
            <AnimeEpisodeCard
              to={`/watch/${animeId}`}
              style={{ textDecoration: 'none' }}
              title={`Continue Watching ${displayTitle}`}
            >
              <img src={episode.image} alt={`Cover for ${animeTitle}`} />
              <PlayIcon aria-label='Play Episode'>
                <FaPlay />
              </PlayIcon>
              <div className='episode-info'>
                <p className='episode-title'>{displayTitle}</p>
                <p className='episode-number'>{`Episode ${episode.number}`}</p>
              </div>
              <ProgressBar
                style={{ width: `${Math.max(playbackPercentage, 5)}%` }}
              />
              <CloseButton
                onClick={(e) => {
                  e.preventDefault(); // Prevents the default action of the event
                  e.stopPropagation(); // Prevents the event from bubbling up to any parent elements
                  handleRemoveAllEpisodes(animeId);
                }}
              >
                <FaCircle aria-label='Close' />
              </CloseButton>
            </AnimeEpisodeCard>
          </StyledSwiperSlide>
        );
      });
    } catch (error) {
      console.error('Failed to parse watched episodes data:', error);
      return [];
    }
  }, [watchedEpisodesData, lastVisitedData]);

  const swiperSettings = useMemo(
    () => ({
      spaceBetween: 20,
      slidesPerView: calculateSlidesPerView(windowWidth),
      loop: true,
      freeMode: true,
      grabCursor: true,
      keyboard: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
    }),
    [windowWidth],
  );

  return (
    <Section aria-labelledby='continueWatchingTitle'>
      {episodesToRender.length > 0 && (
        <ContinueWatchingTitle id='continueWatchingTitle'>
          CONTINUE WATCHING
        </ContinueWatchingTitle>
      )}
      <StyledSwiperContainer {...swiperSettings} aria-label='Episodes carousel'>
        {episodesToRender}
      </StyledSwiperContainer>
    </Section>
  );
};
