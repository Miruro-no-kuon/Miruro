import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import EpisodeList from "../components/Watch/EpisodeList";
import VideoPlayer from "../components/Watch/Video/VideoPlayer";
import AnimeData from "../components/Watch/WatchAnimeData";
import VideoSourceSelector from "../components/Watch/VideSourceSelector";
import {
  fetchAnimeEmbeddedEpisodes,
  fetchAnimeEpisodes,
  fetchAnimeData,
  fetchAnimeInfo,
} from "../hooks/useApi";
import VideoPlayerSkeleton from "../components/Skeletons/VideoPlayerSkeleton";

// Styled Components

const WatchContainer = styled.div`
  margin-left: 5rem;
  margin-right: 5rem;
  @media (max-width: 1000px) {
    margin-left: 0rem;
    margin-right: 0rem;
  }
`;

const WatchWrapper = styled.div`
  font-size: 0.9rem;
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

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--global-border-radius);

  @media (min-width: 1000px) {
    flex: 1 1 auto;
  }

  @media (max-width: 1000px) {
    padding-bottom: 0.8rem;
  }
`;

const EpisodeListContainer = styled.div`
  padding-left: 0.8rem;
  width: 100%;
  max-height: 100%;

  @media (min-width: 1000px) {
    aspect-ratio: 2 / 3;
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
  color: black;
  border-radius: var(--global-border-radius);
  background-color: var(--primary-accent-bg);
  margin-top: 1rem;
  padding: 0.7rem 0.8rem;
  transform: translate(-50%, -50%) scaleX(1.1);
  transition: transform 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transform: translate(-50%, -50%) scaleX(1.1) scale(1.1);
  }
`;

// Constants

const LOCAL_STORAGE_KEYS = {
  LAST_WATCHED_EPISODE: "last-watched-",
  WATCHED_EPISODES: "watched-episodes-",
};

// Interfaces

interface Episode {
  id: string;
  number: number;
  title: string;
  image: string;
}

interface CurrentEpisode {
  id: string;
  number: number;
  image: string;
}

// Main Component

const Watch: React.FC = () => {
  const { animeId, animeTitle, episodeNumber } = useParams<{
    animeId: string;
    animeTitle?: string;
    episodeNumber?: string;
  }>();
  const navigate = useNavigate();
  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<string>("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<CurrentEpisode>({
    id: "0",
    number: 1,
    image: "",
  });
  const [animeInfo, setAnimeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEpisodeChanging, setIsEpisodeChanging] = useState(false);
  const [showNoEpisodesMessage, setShowNoEpisodesMessage] = useState(false);
  const [lastKeypressTime, setLastKeypressTime] = useState(0);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("languagePreference") || "sub"; // 'sub' or 'dub'
  });
  const [languageChanged, setLanguageChanged] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const fetchInfo = async () => {
      if (!animeId) {
        console.error("Anime ID is null.");
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
          "Failed to fetch anime data, trying fetchAnimeInfo as a fallback:",
          error
        );
        try {
          const fallbackInfo = await fetchAnimeInfo(animeId);
          if (isMounted) {
            setAnimeInfo(fallbackInfo);
          }
        } catch (fallbackError) {
          console.error(
            "Also failed to fetch anime info as a fallback:",
            fallbackError
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
        const isDub = language === "dub";
        const animeData = await fetchAnimeEpisodes(animeId, undefined, isDub);
        if (isMounted && animeData) {
          const transformedEpisodes = animeData.map((ep: Episode) => ({
            id: ep.id,
            title: ep.title,
            image: ep.image,
            number:
              ep.number % 1 === 0
                ? ep.number
                : Math.floor(ep.number) +
                  "-" +
                  ep.number.toString().split(".")[1],
          }));

          setEpisodes(transformedEpisodes);

          // Navigate based on language change, URL parameters, or saved episode
          const navigateToEpisode = (() => {
            if (languageChanged) {
              const currentEpisodeNumber =
                parseInt(episodeNumber) || currentEpisode.number;
              // Try to find the current episode in the new language or default to the last available episode
              return (
                transformedEpisodes.find(
                  (ep) => ep.number === currentEpisodeNumber
                ) || transformedEpisodes[transformedEpisodes.length - 1]
              );
            } else if (animeTitle && episodeNumber) {
              // Navigate based on URL parameters
              const episodeId = `${animeTitle}-episode-${episodeNumber}`;
              return (
                transformedEpisodes.find((ep) => ep.id === episodeId) ||
                navigate(`/watch/${animeId}`, { replace: true })
              );
            } else {
              // Navigate based on the last watched episode saved in localStorage
              const savedEpisodeData = localStorage.getItem(
                LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId
              );
              const savedEpisode = savedEpisodeData
                ? JSON.parse(savedEpisodeData)
                : null;
              return savedEpisode
                ? transformedEpisodes.find(
                    (ep) => ep.number === savedEpisode.number
                  ) || transformedEpisodes[0]
                : transformedEpisodes[0];
            }
          })();

          if (navigateToEpisode) {
            setCurrentEpisode({
              id: navigateToEpisode.id,
              number: navigateToEpisode.number,
              image: navigateToEpisode.image,
            });

            const newAnimeTitle = navigateToEpisode.id.split("-episode-")[0];
            navigate(
              `/watch/${animeId}/${newAnimeTitle}/${navigateToEpisode.number}`,
              { replace: true }
            );
            setLanguageChanged(false); // Reset the languageChanged flag after handling the navigation
          }
        }
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
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
      const bannerImage = animeInfo?.cover;

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

    if (animeInfo && currentEpisode.id !== "0") {
      updateBackgroundImage();
    }
  }, [animeInfo, currentEpisode]);

  const handleEpisodeSelect = useCallback(
    async (selectedEpisode: Episode) => {
      setIsEpisodeChanging(true);
      const animeTitle = selectedEpisode.id.split("-episode")[0];

      setCurrentEpisode({
        id: selectedEpisode.id,
        number: selectedEpisode.number,
        image: selectedEpisode.image,
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId,
        JSON.stringify({
          id: selectedEpisode.id,
          title: selectedEpisode.title,
          number: selectedEpisode.number,
        })
      );

      updateWatchedEpisodes(selectedEpisode);

      navigate(
        `/watch/${animeId}/${encodeURI(animeTitle)}/${selectedEpisode.number}`,
        {
          replace: true,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      setIsEpisodeChanging(false);
    },
    [animeId, navigate]
  );
  //next episode shortcut with 500ms delay.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || !["N", "P"].includes(event.key.toUpperCase()))
        return;

      const now = Date.now();
      if (now - lastKeypressTime < 200) return; // Debounce check

      setLastKeypressTime(now);

      const currentIndex = episodes.findIndex(
        (ep) => ep.id === currentEpisode.id
      );
      if (
        event.key.toUpperCase() === "N" &&
        currentIndex < episodes.length - 1
      ) {
        // Move to next episode
        const nextEpisode = episodes[currentIndex + 1];
        handleEpisodeSelect(nextEpisode);
      } else if (event.key.toUpperCase() === "P" && currentIndex > 0) {
        // Move to previous episode
        const prevEpisode = episodes[currentIndex - 1];
        handleEpisodeSelect(prevEpisode);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [episodes, currentEpisode, handleEpisodeSelect, lastKeypressTime]);

  useEffect(() => {
    if (animeInfo) {
      document.title = "Miruro | " + animeInfo.title.english;
    } else {
      document.title = "Miruro";
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      const isSearchBox =
        event.target instanceof HTMLInputElement &&
        (event.target.type === "text" || event.target.type === "search");

      if (event.code === "Space" && !isSearchBox) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
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
      LOCAL_STORAGE_KEYS.WATCHED_EPISODES + animeId
    );
    const watchedEpisodes: Episode[] = watchedEpisodesJson
      ? JSON.parse(watchedEpisodesJson)
      : [];

    if (!watchedEpisodes.some((ep) => ep.id === episode.id)) {
      watchedEpisodes.push(episode);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.WATCHED_EPISODES + animeId,
        JSON.stringify(watchedEpisodes)
      );
    }
  };
  useEffect(() => {
    localStorage.setItem("languagePreference", language);
    console.log("Current language setting:", language); // Debug log to check the current language setting
  }, [language]);

  const handleSetLanguage = (newLanguage: string) => {
    console.log("Changing language to:", newLanguage); // Debug log
    setLanguage(newLanguage); // Update state
    // localStorage update is handled by useEffect
  };
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage); // This will trigger the useEffect above to re-fetch episodes based on the new language
  }, []);

  return (
    <WatchContainer>
      {showNoEpisodesMessage && (
        <NoEpsFoundDiv>
          <h2>No episodes found :(</h2>
          <GoToHomePageButton href="/home">Home</GoToHomePageButton>
        </NoEpsFoundDiv>
      )}
      <WatchWrapper>
        {/* Render WatchWrapper content conditionally based on showNoEpisodesMessage or other state */}
        {!showNoEpisodesMessage && (
          <>
            <VideoPlayerContainer>
              {loading ? (
                <VideoPlayerSkeleton />
              ) : (
                <VideoPlayer
                  episodeId={currentEpisode.id}
                  bannerImage={selectedBackgroundImage}
                  isEpisodeChanging={isEpisodeChanging}
                />
              )}
            </VideoPlayerContainer>
            <EpisodeListContainer>
              {loading ? (
                <VideoPlayerSkeleton />
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
                />
              )}
            </EpisodeListContainer>
          </>
        )}
      </WatchWrapper>
      <VideoSourceSelector
        // sourceType={sourceType}
        // setSourceType={setSourceType}
        language={language}
        setLanguage={setLanguage}
      />
      {animeInfo && <AnimeData animeData={animeInfo} />}
    </WatchContainer>
  );
};

export default Watch;
