import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import styled from 'styled-components';
import Image404URL from '/src/assets/404.webp';
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
  useCountdown,
} from '../index';
import { Episode } from '../index';

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
  grid-template-columns: 1fr 1fr; // TODO Aim for a 3:1 ratio
  width: 100%; // TODO Make sure this container can expand enough
  @media (max-width: 1000px) {
    grid-template-columns: auto;
  }
`;

const SourceAndData = styled.div<{ $videoPlayerWidth: string }>`
  width: ${({ $videoPlayerWidth }) => $videoPlayerWidth};
`;

const RalationsTable = styled.div`
  padding: 0;
  margin-top: 1rem;
  @media (max-width: 1000px) {
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
  margin-top: 7.5rem;
  margin-bottom: 10rem;
  @media (max-width: 1000px) {
    margin-top: 2.5rem;
    margin-bottom: 6rem;
  }
`;

const NoEpsImage = styled.div`
  margin-bottom: 3rem;
  max-width: 100%;

  img {
    border-radius: var(--global-border-radius);
    max-width: 100%;
    @media (max-width: 500px) {
      max-width: 70%;
    }
  }
`;

const StyledHomeButton = styled.button`
  color: white;
  border-radius: var(--global-border-radius);
  border: none;
  background-color: var(--primary-accent);
  margin-top: 0.5rem;
  font-weight: bold;
  padding: 1rem;
  position: absolute;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease-in-out;
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

const LOCAL_STORAGE_KEYS = {
  LAST_WATCHED_EPISODE: 'last-watched-',
  WATCHED_EPISODES: 'watched-episodes-',
  LAST_ANIME_VISITED: 'last-anime-visited',
};

// TODO Main Component
const Watch: React.FC = () => {
  const videoPlayerContainerRef = useRef<HTMLDivElement>(null);
  const [videoPlayerWidth, setVideoPlayerWidth] = useState('100%');
  const getSourceTypeKey = (animeId: string | undefined) =>
    `source-[${animeId}]`;
  const getLanguageKey = (animeId: string | undefined) =>
    `subOrDub-[${animeId}]`;
  const updateVideoPlayerWidth = useCallback(() => {
    if (videoPlayerContainerRef.current) {
      const width = `${videoPlayerContainerRef.current.offsetWidth}px`;
      setVideoPlayerWidth(width);
    }
  }, [setVideoPlayerWidth, videoPlayerContainerRef]);
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
      ? animeInfo.nextAiringEpisode.airingTime * 1000
      : null;
  const nextEpisodenumber = animeInfo?.nextAiringEpisode?.episode;
  const countdown = useCountdown(nextEpisodeAiringTime);
  const currentEpisodeIndex = episodes.findIndex(
    (ep) => ep.id === currentEpisode.id,
  );
  const [languageChanged, setLanguageChanged] = useState(false);

  //----------------------------------------------MORE VARIABLES----------------------------------------------
  const GoToHomePageButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/home');
    };

    return (
      <StyledHomeButton onClick={handleClick}>Go back Home</StyledHomeButton>
    );
  };
  // TODO FETCH VIDSTREAMING VIDEO
  const fetchVidstreamingUrl = async (episodeId: string) => {
    try {
      const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId);
      if (embeddedServers && embeddedServers.length > 0) {
        const vidstreamingServer = embeddedServers.find(
          (server: any) => server.name === 'Vidstreaming',
        );
        const selectedServer = vidstreamingServer || embeddedServers[0];
        setEmbeddedVideoUrl(selectedServer.url);
      }
    } catch (error) {
      console.error(
        'Error fetching Vidstreaming servers for episode ID:',
        episodeId,
        error,
      );
    }
  };

  // TODO FETCH GOGO VIDEO
  const fetchEmbeddedUrl = async (episodeId: string) => {
    try {
      const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId);
      if (embeddedServers && embeddedServers.length > 0) {
        const gogoServer = embeddedServers.find(
          (server: any) => server.name === 'Gogo server',
        );
        const selectedServer = gogoServer || embeddedServers[0];
        setEmbeddedVideoUrl(selectedServer.url);
      }
    } catch (error) {
      console.error(
        'Error fetching gogo servers for episode ID:',
        episodeId,
        error,
      );
    }
  };

  // TODO SAVE TO LOCAL STORAGE NAVIGATED/CLICKED EPISODES
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

  // TODO UPDATES CURRENT EPISODE INFORMATION, UPDATES WATCHED EPISODES AND NAVIGATES TO NEW URL
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

  // TODO UPDATE DOWNLOAD LINK WHEN EPISODE ID CHANGES
  const updateDownloadLink = useCallback((link: string) => {
    setDownloadLink(link);
  }, []);

  // TODO AUTOPLAY BUTTON TOGGLE PROPS
  const handleEpisodeEnd = async () => {
    const nextEpisodeIndex = currentEpisodeIndex + 1;
    if (nextEpisodeIndex >= episodes.length) {
      console.log('No more episodes.');
      return;
    }
    handleEpisodeSelect(episodes[nextEpisodeIndex]);
  };

  // TODO NAVIGATE TO NEXT AND PREVIOUS EPISODES WITH SHIFT+N/P KEYBOARD COMBINATIONS (500MS DELAY)
  const onPrevEpisode = () => {
    const prevIndex = currentEpisodeIndex - 1;
    if (prevIndex >= 0) {
      handleEpisodeSelect(episodes[prevIndex]);
    }
  };
  const onNextEpisode = () => {
    const nextIndex = currentEpisodeIndex + 1;
    if (nextIndex < episodes.length) {
      handleEpisodeSelect(episodes[nextIndex]);
    }
  };

  //----------------------------------------------USEFFECTS----------------------------------------------
  // TODO SETS DEFAULT SOURCE TYPE AND LANGUGAE TO DEFAULT AND SUB
  useEffect(() => {
    const defaultSourceType = 'default';
    const defaultLanguage = 'sub';
    setSourceType(
      localStorage.getItem(getSourceTypeKey(animeId || '')) ||
        defaultSourceType,
    );
    setLanguage(
      localStorage.getItem(getLanguageKey(animeId || '')) || defaultLanguage,
    );
  }, [animeId]);

  // TODO SAVES LANGUAGE PREFERENCE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(getLanguageKey(animeId), language);
  }, [language, animeId]);

  //FETCHES ANIME DATA AND ANIME INFO AS BACKUP
  useEffect(() => {
    let isMounted = true;
    const fetchInfo = async () => {
      if (!animeId) {
        console.error('Anime ID is null.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const info = await fetchAnimeData(animeId);
        if (isMounted) {
          setAnimeInfo(info);
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
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    fetchInfo();

    return () => {
      isMounted = false;
    };
  }, [animeId]);

  // TODO FETCHES ANIME EPISODES BASED ON LANGUAGE, ANIME ID AND UPDATES COMPONENTS
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
            .filter((ep: any) => ep.id.includes('-episode-')) // TODO Continue excluding entries without '-episode-'
            .map((ep: any) => {
              const episodePart = ep.id.split('-episode-')[1];
              // TODO New regex to capture the episode number including cases like "7-5"
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
          const navigateToEpisode = (() => {
            if (languageChanged) {
              const currentEpisodeNumber =
                episodeNumber || currentEpisode.number;
              return (
                transformedEpisodes.find(
                  (ep: any) => ep.number === currentEpisodeNumber,
                ) || transformedEpisodes[transformedEpisodes.length - 1]
              );
            } else if (animeTitle && episodeNumber) {
              const episodeId = `${animeTitle}-episode-${episodeNumber}`;
              return (
                transformedEpisodes.find((ep: any) => ep.id === episodeId) ||
                navigate(`/watch/${animeId}`, { replace: true })
              );
            } else {
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
            setLanguageChanged(false); // TODO Reset the languageChanged flag after handling the navigation
          }
        }
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // TODO Last visited cache to order continue watching
    const updateLastVisited = () => {
      if (!animeInfo || !animeId) return; // TODO Ensure both animeInfo and animeId are available

      const lastVisited = localStorage.getItem(
        LOCAL_STORAGE_KEYS.LAST_ANIME_VISITED,
      );
      const lastVisitedData = lastVisited ? JSON.parse(lastVisited) : {};
      lastVisitedData[animeId] = {
        timestamp: Date.now(),
        titleEnglish: animeInfo.title.english, // TODO Assuming animeInfo contains the title in English
        titleRomaji: animeInfo.title.romaji, // TODO Assuming animeInfo contains the title in Romaji
      };

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LAST_ANIME_VISITED,
        JSON.stringify(lastVisitedData),
      );
    };

    if (animeId) {
      updateLastVisited();
    }

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

  // TODO FETCH EMBEDDED EPISODES IF VIDSTREAMING OR GOGO HAVE BEEN SELECTED
  useEffect(() => {
    if (sourceType === 'vidstreaming' && currentEpisode.id) {
      fetchVidstreamingUrl(currentEpisode.id).catch(console.error);
    } else if (sourceType === 'gogo' && currentEpisode.id) {
      fetchEmbeddedUrl(currentEpisode.id).catch(console.error);
    }
  }, [sourceType, currentEpisode.id]);

  // TODO UPDATE BACKGROUND IMAGE TO ANIME BANNER IF WIDTH IS UNDER 500PX / OR USE ANIME COVER IF NO BANNER FOUND
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

  // TODO UPDATES VIDEOPLAYER WIDTH WHEN WINDOW GETS RESIZED
  useEffect(() => {
    updateVideoPlayerWidth();
    const handleResize = () => {
      updateVideoPlayerWidth();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateVideoPlayerWidth]);

  // TODO UPDATES EPISODE LIST MAX HEIGHT BASED ON VIDEO PLAYER CURRENT HEIGHT
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

  // TODO SAVES SOURCE TYPE PREFERENCE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(getSourceTypeKey(animeId), sourceType);
  }, [sourceType, animeId]);

  // TODO NAVIGATE TO NEXT AND PREVIOUS EPISODES WITH SHIFT+N/P KEYBOARD COMBINATIONS (500MS DELAY)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const targetTagName = (event.target as HTMLElement).tagName.toLowerCase();
      if (targetTagName === 'input' || targetTagName === 'textarea') {
        return;
      }
      if (!event.shiftKey || !['N', 'P'].includes(event.key.toUpperCase()))
        return;
      const now = Date.now();
      if (now - lastKeypressTime < 200) return;
      setLastKeypressTime(now);
      const currentIndex = episodes.findIndex(
        (ep) => ep.id === currentEpisode.id,
      );
      if (
        event.key.toUpperCase() === 'N' &&
        currentIndex < episodes.length - 1
      ) {
        const nextEpisode = episodes[currentIndex + 1];
        handleEpisodeSelect(nextEpisode);
      } else if (event.key.toUpperCase() === 'P' && currentIndex > 0) {
        const prevEpisode = episodes[currentIndex - 1];
        handleEpisodeSelect(prevEpisode);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [episodes, currentEpisode, handleEpisodeSelect, lastKeypressTime]);

  // TODO SET PAGE TITLE TO MIRURO + ANIME TITLE
  useEffect(() => {
    if (animeInfo && animeInfo.title) {
      document.title =
        'Watch ' +
        (animeInfo.title.english ||
          animeInfo.title.romaji ||
          animeInfo.title.romaji ||
          '') +
        ' | Miruro';
    }
  }, [animeInfo]);

  // TODO No idea
  useEffect(() => {
    let isMounted = true;
    const fetchInfo = async () => {
      if (!animeId) {
        console.error('Anime ID is undefined.');
        return;
      }
      try {
        const info = await fetchAnimeData(animeId);
        if (isMounted) {
          setAnimeInfo(info);
        }
      } catch (error) {
        console.error('Failed to fetch anime info:', error);
      }
    };
    fetchInfo();
    return () => {
      isMounted = false;
    };
  }, [animeId]);

  // TODO SHOW NO EPISODES DIV IF NO RESPONSE AFTER 10 SECONDS
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!episodes || episodes.length === 0) {
        setShowNoEpisodesMessage(true);
      }
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, [loading, episodes]);

  // TODO SHOW NO EPISODES DIV IF NOT LOADING AND NO EPISODES FOUND
  useEffect(() => {
    if (!loading && episodes.length === 0) {
      setShowNoEpisodesMessage(true);
    } else {
      setShowNoEpisodesMessage(false);
    }
  }, [loading, episodes]);

  return (
    <WatchContainer>
      {animeInfo &&
      animeInfo.status === 'Not yet aired' &&
      animeInfo.trailer ? (
        <div style={{ textAlign: 'center' }}>
          <strong>
            <h2>Time Remaining:</h2>
          </strong>
          {animeInfo &&
          animeInfo.nextAiringEpisode &&
          countdown !== 'Airing now or aired' ? (
            <p>
              <FaBell /> {countdown}
            </p>
          ) : (
            <p>Unknown</p>
          )}
          {animeInfo.trailer && (
            <IframeTrailer
              src={`https://www.youtube.com/embed/${animeInfo.trailer.id}`}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          )}
        </div>
      ) : showNoEpisodesMessage ? (
        <NoEpsFoundDiv>
          <h2>No episodes found {':('}</h2>
          <NoEpsImage>
            <img src={Image404URL} alt='404 Error'></img>
          </NoEpsImage>
          <GoToHomePageButton />
        </NoEpsFoundDiv>
      ) : (
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
                    animeTitle={
                      animeInfo?.title?.english || animeInfo?.title?.romaji
                    }
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
