import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import EpisodeList from "../components/Watch/EpisodeList";
import VideoPlayer from "../components/Watch/Video/VideoPlayer";
import { fetchAnimeEpisodes } from "../hooks/useApi";
import WatchSkeleton from "../components/Skeletons/WatchSkeleton";

const LOCAL_STORAGE_KEYS = {
  LAST_WATCHED_EPISODE: "last-watched-",
};

const WatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--global-primary-bg);
  color: var(--global-text);

  @media (min-width: 1000px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const EpisodeListContainer = styled.div`
  width: 100%;

  @media (min-width: 1000px) {
    flex: 1 1 500px;
  }
`;

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0.2rem;

  @media (min-width: 1000px) {
    flex: 3 1 auto;
  }
`;

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

const Watch: React.FC = () => {
  const { animeId, animeTitle, episodeNumber } = useParams<{
    animeId: string;
    animeTitle?: string;
    episodeNumber?: string;
  }>();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<CurrentEpisode>({
    id: "0",
    number: 1,
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEpisodeChanging, setIsEpisodeChanging] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!animeId) {
        console.error("Anime ID is null.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const animeData = await fetchAnimeEpisodes(animeId);
        if (animeData) {
          const transformedEpisodes = animeData.map((ep: Episode) => ({
            id: ep.id,
            number: ep.number,
            title: ep.title,
            image: ep.image,
          }));

          setEpisodes(transformedEpisodes);

          // Check if animeTitle and episodeNumber are provided in the URL
          if (animeTitle && episodeNumber) {
            const episodeId = `${animeTitle}-episode-${episodeNumber}`;
            const matchingEpisode = transformedEpisodes.find(
              (ep: Episode) => ep.id === episodeId
            );
            if (matchingEpisode) {
              setCurrentEpisode({
                id: matchingEpisode.id,
                number: matchingEpisode.number,
                image: matchingEpisode.image,
              });
            } else {
              // Fallback to the first episode or saved episode
              navigate(`/watch/${animeId}`);
            }
          } else {
            let savedEpisodeData = localStorage.getItem(
              LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId
            );
            let savedEpisode = savedEpisodeData
              ? JSON.parse(savedEpisodeData)
              : null;

            if (savedEpisode && savedEpisode.number) {
              const animeTitle = savedEpisode.id.split("-episode")[0];
              navigate(
                `/watch/${animeId}/${animeTitle}/${savedEpisode.number}`,
                { replace: true }
              );
              setCurrentEpisode({
                id: savedEpisode.id || "",
                number: savedEpisode.number,
                image: "", // Find the episode by number to get the image
              });
            } else {
              // Navigate to the first episode if no saved episode data is found
              const firstEpisode = transformedEpisodes[0];
              if (firstEpisode) {
                const animeTitle = firstEpisode.id.split("-episode")[0];
                navigate(
                  `/watch/${animeId}/${animeTitle}/${firstEpisode.number}`,
                  { replace: true }
                );
                setCurrentEpisode({
                  id: firstEpisode.id,
                  number: firstEpisode.number,
                  image: firstEpisode.image,
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch anime info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animeId, animeTitle, episodeNumber, navigate]);

  const handleEpisodeSelect = useCallback(
    async (selectedEpisode: Episode) => {
      setIsEpisodeChanging(true);

      // Extract the anime title from the episode ID
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

      navigate(`/watch/${animeId}/${animeTitle}/${selectedEpisode.number}`, {
        replace: true,
      });

      // Simulate a delay or wait for an actual async operation if needed
      await new Promise((resolve) => setTimeout(resolve, 100)); // Remove or adjust based on real async operations

      setIsEpisodeChanging(false);
    },
    [animeId, navigate]
  );

  if (loading) {
    return <WatchSkeleton />;
  }

  if (!episodes || episodes.length === 0) {
    return <div>No episodes found.</div>;
  }

  return (
    <WatchContainer>
      <VideoPlayerContainer>
        <VideoPlayer
          episodeId={currentEpisode.id}
          bannerImage={currentEpisode.image}
          isEpisodeChanging={isEpisodeChanging}
        />
      </VideoPlayerContainer>
      <EpisodeListContainer>
        <EpisodeList
          episodes={episodes}
          selectedEpisodeId={currentEpisode.id}
          onEpisodeSelect={(episodeId: string) => {
            const episode = episodes.find((e) => e.id === episodeId);
            if (episode) {
              handleEpisodeSelect(episode);
            }
          }}
        />
      </EpisodeListContainer>
    </WatchContainer>
  );
};

export default Watch;
