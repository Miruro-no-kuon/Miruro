import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import styled from 'styled-components';
import {
  EpisodeList,
  Player,
  EmbedPlayer,
  WatchAnimeData as AnimeData,
  AnimeDataList,
  MediaSource,
  fetchAnimeEmbeddedEpisodes,
  fetchAnimeEpisodes,
  fetchAnimeData,
  fetchAnimeInfo,
  SkeletonPlayer,
} from '../index';
import { Episode } from '../index';

// Styled Components

const WatchContainer = styled.div``;

const WatchWrapper = styled.div`
  font-size: 0.9rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--global-primary-bg);
  color: var(--global-text);

  @media (min-width: 1000px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const DataWrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr; // Aim for a 3:1 ratio
  width: 100%; // Make sure this container can expand enough
  @media (max-width: 1000px) {
    grid-template-columns: auto;
  }
`;

const SourceAndData = styled.div<{ $videoPlayerWidth: string }>`
  width: ${({ $videoPlayerWidth }) => $videoPlayerWidth};
`;

const RalationsTable = styled.div`
  paddding: 0;
  margin-top: 1rem;
  @media (max-width: 500px) {
    margin-top: 0rem;
  }
`;
const VideoPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--global-border-radius);

  @media (min-width: 1000px) {
    flex: 1 1 auto;
  }
`;

const EpisodeListContainer = styled.div`
  width: 100%;
  max-height: 100%;

  @media (min-width: 1000px) {
    flex: 1 1 500px;
    max-height: 100%;
  }

  @media (max-width: 1000px) {
    padding-left: 0rem;
  }
`;

const NoEpsFoundDiv = styled.div`
  text-align: center;
  margin-top: 15rem;
  margin-bottom: 15rem;
  @media (max-width: 1000px) {
    margin-top: 10rem;
    margin-bottom: 10rem;
  }
`;

const GoToHomePageButton = styled.a`
  position: absolute;
  color: white;
  border-radius: var(--global-border-radius);
  background-color: var(--primary-accent);
  margin-top: 1rem;
  padding: 1rem;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease-in-out;
  text-decoration: none;

  &:hover,
  &:active,
  &:focus {
    transform: translate(-50%, -50%) scale(1.05);
  }
  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

const IframeTrailer = styled.iframe`
  position: relative;
  border-radius: var(--global-border-radius);
  border: none;
  top: 0;
  left: 0;
  width: 70%;
  height: 100%;
  text-items: center;
  @media (max-width: 1000px) {
    width: 100%;
    height: 100%;
  }
`;

// Constants

const LOCAL_STORAGE_KEYS = {
  LAST_WATCHED_EPISODE: 'last-watched-',
  WATCHED_EPISODES: 'watched-episodes-',
};

const useCountdown = (targetDate: number | null) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) {
      return; // Exit early if targetDate is null or undefined
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('Airing now or aired');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// Main Component
const getSourceTypeKey = (animeId: string | undefined) => `source-[${animeId}]`;
const getLanguageKey = (animeId: string | undefined) => `subOrDub-[${animeId}]`;
const Watch: React.FC = () => {
  const videoPlayerContainerRef = useRef<HTMLDivElement>(null);
  const [videoPlayerWidth, setVideoPlayerWidth] = useState('100%'); // Default to 100%

  const updateVideoPlayerWidth = useCallback(() => {
    if (videoPlayerContainerRef.current) {
      const width = `${videoPlayerContainerRef.current.offsetWidth}px`;
      setVideoPlayerWidth(width);
    }
  }, [setVideoPlayerWidth, videoPlayerContainerRef]);

  useEffect(() => {
    updateVideoPlayerWidth(); // Update on mount

    // Enhanced to ensure the function itself is correctly triggered
    const handleResize = () => {
      updateVideoPlayerWidth();
    };

    window.addEventListener('resize', handleResize); // Update on resize

    return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
  }, [updateVideoPlayerWidth]);

  const [maxEpisodeListHeight, setMaxEpisodeListHeight] =
    useState<string>('100%');

  const { animeId, animeTitle, episodeNumber } = useParams<{
    animeId?: string;
    animeTitle?: string;
    episodeNumber?: string;
  }>();

  const STORAGE_KEYS = {
    SOURCE_TYPE: `source-[${animeId}]`,
    LANGUAGE: `subOrDub-[${animeId}]`,
  };

  const navigate = useNavigate();
  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<string>('');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>({
    id: '0',
    number: 1,
    title: '',
    image: '',
    description: '',
    imageHash: '',
    airDate: '',
  });
  const [animeInfo, setAnimeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEpisodeChanging, setIsEpisodeChanging] = useState(false);
  const [showNoEpisodesMessage, setShowNoEpisodesMessage] = useState(false);
  const [lastKeypressTime, setLastKeypressTime] = useState(0);
  const [sourceType, setSourceType] = useState(
    () => localStorage.getItem(STORAGE_KEYS.SOURCE_TYPE) || 'default',
  );
  const [embeddedVideoUrl, setEmbeddedVideoUrl] = useState('');
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'sub',
  );
  const [downloadLink, setDownloadLink] = useState('');
  const nextEpisodeAiringTime =
    animeInfo && animeInfo.nextAiringEpisode
      ? animeInfo.nextAiringEpisode.airingTime * 1000 // Convert seconds to milliseconds
      : null;
  const nextEpisodenumber = animeInfo?.nextAiringEpisode?.episode;
  const countdown = useCountdown(nextEpisodeAiringTime);
  const currentEpisodeIndex = episodes.findIndex(
    (ep) => ep.id === currentEpisode.id,
  );

  useEffect(() => {
    const defaultSourceType = 'default';
    const defaultLanguage = 'sub';

    // Optionally, you can implement logic here to decide if you want to reset to defaults
    // or maintain the setting from the previous anime. This example resets to defaults.

    setSourceType(
      localStorage.getItem(getSourceTypeKey(animeId || '')) ||
        defaultSourceType,
    );
    setLanguage(
      localStorage.getItem(getLanguageKey(animeId || '')) || defaultLanguage,
    );
  }, [animeId]);

  // Effects to save settings to localStorage
  useEffect(() => {
    localStorage.setItem(getSourceTypeKey(animeId), sourceType);
  }, [sourceType, animeId]);

  useEffect(() => {
    localStorage.setItem(getLanguageKey(animeId), language);
  }, [language, animeId]);
  const [languageChanged, setLanguageChanged] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const fetchInfo = async () => {
      if (!animeId) {
        console.error('Anime ID is null.');
        setLoading(false);
        return;
      }

      setLoading(true); // Indicate that loading has started

      try {
        const info = await fetchAnimeData(animeId);
        if (isMounted) {
          setAnimeInfo(info);
          // setLoading(false); // Data fetched successfully, loading complete
        }
      } catch (error) {
        console.error(
          'Failed to fetch anime data, trying fetchAnimeInfo as a fallback:',
          error,
        );
        try {
          const fallbackInfo = await fetchAnimeInfo(animeId);
          if (isMounted) {
            setAnimeInfo(fallbackInfo);
          }
        } catch (fallbackError) {
          console.error(
            'Also failed to fetch anime info as a fallback:',
            fallbackError,
          );
          // If this fails too, consider showing an error message to the user
        } finally {
          if (isMounted) setLoading(false); // Ensure loading is set to false after all attempts
        }
      }
    };

    fetchInfo();

    return () => {
      isMounted = false;
    };
  }, [animeId]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      if (!animeId) return;

      try {
        const isDub = language === 'dub';
        const animeData = await fetchAnimeEpisodes(animeId, undefined, isDub);
        if (isMounted && animeData) {
          const transformedEpisodes = animeData
            .filter((ep: any) => ep.id.includes('-episode-')) // Continue excluding entries without '-episode-'
            .map((ep: any) => {
              const episodePart = ep.id.split('-episode-')[1];
              // New regex to capture the episode number including cases like "7-5"
              const episodeNumberMatch = episodePart.match(/^(\d+(?:-\d+)?)/);
              return {
                ...ep,
                number: episodeNumberMatch ? episodeNumberMatch[0] : ep.number,
                id: ep.id,
                title: ep.title,
                image: ep.image,
              };
            });

          setEpisodes(transformedEpisodes);

          // Navigate based on language change, URL parameters, or saved episode
          const navigateToEpisode = (() => {
            if (languageChanged) {
              const currentEpisodeNumber =
                episodeNumber || currentEpisode.number;
              // Try to find the current episode in the new language or default to the last available episode
              return (
                transformedEpisodes.find(
                  (ep: any) => ep.number === currentEpisodeNumber,
                ) || transformedEpisodes[transformedEpisodes.length - 1]
              );
            } else if (animeTitle && episodeNumber) {
              // Navigate based on URL parameters
              const episodeId = `${animeTitle}-episode-${episodeNumber}`;
              return (
                transformedEpisodes.find((ep: any) => ep.id === episodeId) ||
                navigate(`/watch/${animeId}`, { replace: true })
              );
            } else {
              // Navigate based on the last watched episode saved in localStorage
              const savedEpisodeData = localStorage.getItem(
                LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId,
              );
              const savedEpisode = savedEpisodeData
                ? JSON.parse(savedEpisodeData)
                : null;
              return savedEpisode
                ? transformedEpisodes.find(
                    (ep: any) => ep.number === savedEpisode.number,
                  ) || transformedEpisodes[0]
                : transformedEpisodes[0];
            }
          })();

          if (navigateToEpisode) {
            setCurrentEpisode({
              id: navigateToEpisode.id,
              number: navigateToEpisode.number,
              image: navigateToEpisode.image,
              title: navigateToEpisode.title,
              description: navigateToEpisode.description,
              imageHash: navigateToEpisode.imageHash,
              airDate: navigateToEpisode.airDate,
            });

            const newAnimeTitle = navigateToEpisode.id.split('-episode-')[0];
            navigate(
              `/watch/${animeId}/${newAnimeTitle}/${navigateToEpisode.number}`,
              { replace: true },
            );
            setLanguageChanged(false); // Reset the languageChanged flag after handling the navigation
          }
        }
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [
    animeId,
    animeTitle,
    episodeNumber,
    navigate,
    language,
    languageChanged,
    currentEpisode.number,
  ]);

  useEffect(() => {
    if (!loading && episodes.length === 0) {
      setShowNoEpisodesMessage(true);
    } else {
      setShowNoEpisodesMessage(false);
    }
  }, [loading, episodes]);

  useEffect(() => {
    const updateBackgroundImage = () => {
      const episodeImage = currentEpisode.image;
      const bannerImage = animeInfo?.cover || animeInfo?.artwork[3].img;

      if (episodeImage && episodeImage !== animeInfo.image) {
        const img = new Image();
        img.onload = () => {
          if (img.width > 500) {
            setSelectedBackgroundImage(episodeImage);
          } else {
            setSelectedBackgroundImage(bannerImage);
          }
        };
        img.onerror = () => {
          setSelectedBackgroundImage(bannerImage);
        };
        img.src = episodeImage;
      } else {
        setSelectedBackgroundImage(bannerImage);
      }
    };

    if (animeInfo && currentEpisode.id !== '0') {
      updateBackgroundImage();
    }
  }, [animeInfo, currentEpisode]);

  const handleEpisodeSelect = useCallback(
    async (selectedEpisode: Episode) => {
      setIsEpisodeChanging(true);
      const animeTitle = selectedEpisode.id.split('-episode')[0];

      setCurrentEpisode({
        id: selectedEpisode.id,
        number: selectedEpisode.number,
        image: selectedEpisode.image,
        title: selectedEpisode.title,
        description: selectedEpisode.description,
        imageHash: selectedEpisode.imageHash,
        airDate: selectedEpisode.airDate,
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId,
        JSON.stringify({
          id: selectedEpisode.id,
          title: selectedEpisode.title,
          number: selectedEpisode.number,
        }),
      );

      updateWatchedEpisodes(selectedEpisode);

      navigate(
        `/watch/${animeId}/${encodeURI(animeTitle)}/${selectedEpisode.number}`,
        {
          replace: true,
        },
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      setIsEpisodeChanging(false);
    },
    [animeId, navigate],
  );

  //next episode shortcut with 500ms delay.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the event target is an input or textarea element
      const targetTagName = (event.target as HTMLElement).tagName.toLowerCase();
      if (targetTagName === 'input' || targetTagName === 'textarea') {
        return; // Exit the function if event is from input or textarea
      }

      if (!event.shiftKey || !['N', 'P'].includes(event.key.toUpperCase()))
        return;
      const now = Date.now();
      if (now - lastKeypressTime < 200) return; // Debounce check

      setLastKeypressTime(now);

      const currentIndex = episodes.findIndex(
        (ep) => ep.id === currentEpisode.id,
      );
      if (
        event.key.toUpperCase() === 'N' &&
        currentIndex < episodes.length - 1
      ) {
        // Move to next episode
        const nextEpisode = episodes[currentIndex + 1];
        handleEpisodeSelect(nextEpisode);
      } else if (event.key.toUpperCase() === 'P' && currentIndex > 0) {
        // Move to previous episode
        const prevEpisode = episodes[currentIndex - 1];
        handleEpisodeSelect(prevEpisode);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [episodes, currentEpisode, handleEpisodeSelect, lastKeypressTime]);

  useEffect(() => {
    if (animeInfo && animeInfo.title) {
      document.title =
        'Miruro | ' +
        (animeInfo.title.english ||
          animeInfo.title.romaji ||
          animeInfo.title.romaji ||
          '');
    } else {
      document.title = 'Miruro';
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      const isSearchBox =
        event.target instanceof HTMLInputElement &&
        (event.target.type === 'text' || event.target.type === 'search');

      if (event.code === 'Space' && !isSearchBox) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [animeInfo]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!episodes || episodes.length === 0) {
        setShowNoEpisodesMessage(true);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [loading, episodes]);

  const updateWatchedEpisodes = (episode: Episode) => {
    const watchedEpisodesJson = localStorage.getItem(
      LOCAL_STORAGE_KEYS.WATCHED_EPISODES + animeId,
    );
    const watchedEpisodes: Episode[] = watchedEpisodesJson
      ? JSON.parse(watchedEpisodesJson)
      : [];

    if (!watchedEpisodes.some((ep) => ep.id === episode.id)) {
      watchedEpisodes.push(episode);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.WATCHED_EPISODES + animeId,
        JSON.stringify(watchedEpisodes),
      );
    }
  };

  // Assuming you need to determine which episode's URL to use
  const fetchEmbeddedUrl = async (episodeId: string) => {
    try {
      const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId);
      if (embeddedServers && embeddedServers.length > 0) {
        // Attempt to find the "Gogo server" in the list of servers
        const gogoServer = embeddedServers.find(
          (server: any) => server.name === 'Gogo server',
        );
        // If "Gogo server" is found, use it; otherwise, use the first server
        const selectedServer = gogoServer || embeddedServers[0];
        setEmbeddedVideoUrl(selectedServer.url); // Use the URL of the selected server
      }
    } catch (error) {
      console.error(
        'Error fetching gogo servers for episode ID:',
        episodeId,
        error,
      );
    }
  };

  const fetchVidstreamingUrl = async (episodeId: string) => {
    try {
      // Fetch embedded servers for the episode
      const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId);
      if (embeddedServers && embeddedServers.length > 0) {
        // Attempt to find the "Vidstreaming" server in the list of servers
        const vidstreamingServer = embeddedServers.find(
          (server: any) => server.name === 'Vidstreaming',
        );
        // If "Vidstreaming" server is found, use it; otherwise, use the first server
        const selectedServer = vidstreamingServer || embeddedServers[0];
        setEmbeddedVideoUrl(selectedServer.url); // Use the URL of the selected server
      }
    } catch (error) {
      console.error(
        'Error fetching Vidstreaming servers for episode ID:',
        episodeId,
        error,
      );
    }
  };

  // Call this function with the appropriate episode ID when an episode is selected
  useEffect(() => {
    if (sourceType === 'vidstreaming' && currentEpisode.id) {
      fetchVidstreamingUrl(currentEpisode.id).catch(console.error);
    } else if (sourceType === 'gogo' && currentEpisode.id) {
      fetchEmbeddedUrl(currentEpisode.id).catch(console.error);
    }
  }, [sourceType, currentEpisode.id]);

  useEffect(() => {
    const updateMaxHeight = () => {
      if (videoPlayerContainerRef.current) {
        const height = videoPlayerContainerRef.current.offsetHeight;
        setMaxEpisodeListHeight(`${height}px`);
      }
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);

    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchInfo = async () => {
      if (!animeId) {
        console.error('Anime ID is undefined.');
        return; // Exit if animeId is undefined
      }

      try {
        const info = await fetchAnimeData(animeId);
        if (isMounted) {
          setAnimeInfo(info); // Update animeInfo state
        }
      } catch (error) {
        console.error('Failed to fetch anime info:', error);
      }
    };

    fetchInfo();

    return () => {
      isMounted = false;
    };
  }, [animeId]); // Dependency array to re-run the effect when animeId changes

  const updateDownloadLink = useCallback((link: string) => {
    setDownloadLink(link);
  }, []);

  //Auto Next episode logic
  const handleEpisodeEnd = async () => {
    const nextEpisodeIndex = currentEpisodeIndex + 1;

    if (nextEpisodeIndex >= episodes.length) {
      console.log('No more episodes.');
      return; // No more episodes to play
    }

    const nextEpisode = episodes[nextEpisodeIndex];
    handleEpisodeSelect(nextEpisode);
  };

  // Next and previous Episode logic through Videplayer Buttons
  const onPrevEpisode = () => {
    const prevIndex = currentEpisodeIndex - 1;
    if (prevIndex >= 0) {
      const prevEpisode = episodes[prevIndex];
      handleEpisodeSelect(prevEpisode);
    }
  };

  const onNextEpisode = () => {
    const nextIndex = currentEpisodeIndex + 1;
    if (nextIndex < episodes.length) {
      const nextEpisode = episodes[nextIndex];
      handleEpisodeSelect(nextEpisode);
    }
  };

  return (
    <WatchContainer>
      {animeInfo &&
      animeInfo.status === 'Not yet aired' &&
      animeInfo.trailer ? (
        // Display the trailer if the anime has not yet aired and has a trailer
        <div style={{ textAlign: 'center' }}>
          <strong>
            <h2>Time until next episode:</h2>
          </strong>
          <p>
            <h4>
              {animeInfo &&
              animeInfo.nextAiringEpisode &&
              countdown !== 'Airing now or aired' ? (
                <>
                  <FaBell /> {countdown}
                </>
              ) : (
                'Unknown'
              )}
            </h4>
          </p>
          {animeInfo.trailer && (
            <IframeTrailer
              src={`https://www.youtube.com/embed/${animeInfo.trailer.id}`}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          )}
        </div>
      ) : showNoEpisodesMessage ? (
        // Condition for displaying the "No episodes found" div
        <NoEpsFoundDiv>
          <h2>No episodes found :(</h2>
          <GoToHomePageButton href='/home'>Go back Home</GoToHomePageButton>
        </NoEpsFoundDiv>
      ) : (
        // Render content when episodes are found
        <WatchWrapper>
          {!showNoEpisodesMessage && (
            <>
              <VideoPlayerContainer ref={videoPlayerContainerRef}>
                {loading ? (
                  <SkeletonPlayer />
                ) : sourceType === 'default' ? (
                  <Player
                    episodeId={currentEpisode.id}
                    malId={animeInfo?.malId}
                    banner={selectedBackgroundImage}
                    updateDownloadLink={updateDownloadLink}
                    onEpisodeEnd={handleEpisodeEnd}
                    onPrevEpisode={onPrevEpisode}
                    onNextEpisode={onNextEpisode}
                  />
                ) : (
                  <EmbedPlayer src={embeddedVideoUrl} />
                )}
              </VideoPlayerContainer>
              <EpisodeListContainer style={{ maxHeight: maxEpisodeListHeight }}>
                {loading ? (
                  <SkeletonPlayer />
                ) : (
                  <EpisodeList
                    animeId={animeId}
                    episodes={episodes}
                    selectedEpisodeId={currentEpisode.id}
                    onEpisodeSelect={(episodeId: string) => {
                      const episode = episodes.find((e) => e.id === episodeId);
                      if (episode) {
                        handleEpisodeSelect(episode);
                      }
                    }}
                    maxListHeight={maxEpisodeListHeight}
                  />
                )}
              </EpisodeListContainer>
            </>
          )}
        </WatchWrapper>
      )}
      <DataWrapper>
        <SourceAndData $videoPlayerWidth={videoPlayerWidth}>
          {/* Conditionally render MediaSource based on anime airing status */}
          {animeInfo && animeInfo.status !== 'Not yet aired' && (
            <MediaSource
              sourceType={sourceType}
              setSourceType={setSourceType}
              language={language}
              setLanguage={setLanguage}
              downloadLink={downloadLink}
              episodeId={currentEpisode.number.toString()}
              airingTime={
                animeInfo && animeInfo.status === 'Ongoing'
                  ? countdown
                  : undefined
              }
              nextEpisodenumber={nextEpisodenumber}
            />
          )}
          {animeInfo && <AnimeData animeData={animeInfo} />}
        </SourceAndData>
        <RalationsTable>
          {animeInfo && <AnimeDataList animeData={animeInfo} />}
        </RalationsTable>
      </DataWrapper>
    </WatchContainer>
  );
};

export default Watch;
