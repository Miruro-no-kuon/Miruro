import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import EpisodeList from "../components/Watch/EpisodeList";
import VideoPlayer from "../components/Watch/Video/VideoPlayer";
import AnimeData from "../components/Watch/WatchAnimeData";
import { fetchAnimeEpisodes, fetchAnimeData } from "../hooks/useApi";
import VideoPlayerSkeleton from "../components/Skeletons/VideoPlayerSkeleton";

// Styled Components

const WatchContainer = styled.div``;

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

  useEffect(() => {
    let isMounted = true;

    const fetchInfo = async () => {
      if (!animeId) {
        console.error("Anime ID is null.");
        setLoading(false);
        return;
      }

      try {
        const info = await fetchAnimeData(animeId);
        if (isMounted) {
          setAnimeInfo(info);
        }
      } catch (error) {
        console.error("Failed to fetch anime info:", error);
        if (isMounted) setLoading(false);
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
        const animeData = await fetchAnimeEpisodes(animeId);
        if (isMounted && animeData) {
          const transformedEpisodes = animeData.map((ep: Episode) => ({
            id: ep.id,
            title: ep.title,
            image: ep.image,
            number:
              ep.number % 1 === 0
                ? ep.number
                : `${Math.floor(ep.number)}-${
                    ep.number.toString().split(".")[1]
                  }`,
          }));

          setEpisodes(transformedEpisodes);

          let navigateToEpisode = transformedEpisodes[0];

          if (animeTitle && episodeNumber) {
            const episodeId = `${animeTitle}-episode-${episodeNumber}`;
            const matchingEpisode = transformedEpisodes.find(
              (ep: any) => ep.id === episodeId
            );
            if (matchingEpisode) {
              setCurrentEpisode({
                id: matchingEpisode.id,
                number: matchingEpisode.number,
                image: matchingEpisode.image,
              });
              navigateToEpisode = matchingEpisode;
            } else {
              navigate(`/watch/${animeId}`, { replace: true });
            }
          } else {
            let savedEpisodeData = localStorage.getItem(
              LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId
            );
            let savedEpisode = savedEpisodeData
              ? JSON.parse(savedEpisodeData)
              : null;

            if (savedEpisode && savedEpisode.number) {
              const foundEpisode = transformedEpisodes.find(
                (ep: any) => ep.number === savedEpisode.number
              );
              if (foundEpisode) {
                setCurrentEpisode({
                  id: foundEpisode.id,
                  number: foundEpisode.number,
                  image: foundEpisode.image,
                });
                navigateToEpisode = foundEpisode;
              }
            } else {
              setCurrentEpisode({
                id: navigateToEpisode.id,
                number: navigateToEpisode.number,
                image: navigateToEpisode.image,
              });
            }
          }

          if (isMounted && navigateToEpisode) {
            const newAnimeTitle = navigateToEpisode.id.split("-episode")[0];
            navigate(
              `/watch/${animeId}/${newAnimeTitle}/${navigateToEpisode.number}`,
              { replace: true }
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch additional anime data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [animeId, animeTitle, episodeNumber, navigate]);

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

  if (showNoEpisodesMessage) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "10rem",
          marginBottom: "10rem",
        }}
      >
        <h2>No episodes found :(</h2>
        <GoToHomePageButton href="/home">Home</GoToHomePageButton>
      </div>
    );
  }

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

  return (
    <WatchContainer>
      <WatchWrapper>
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
      </WatchWrapper>
      {animeInfo && <AnimeData animeData={animeInfo} />}
    </WatchContainer>
  );
};

export default Watch;
