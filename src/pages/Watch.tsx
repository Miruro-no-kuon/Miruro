import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
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

const Watch = () => {
  const { animeId = "" } = useParams();
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
            image: ep.image, // Ensure image property is mapped
          }));

          setEpisodes(transformedEpisodes);
          const savedEpisodeId =
            localStorage.getItem(
              LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId
            ) ||
            transformedEpisodes[0]?.id ||
            "0";
          const matchedEpisode = transformedEpisodes.find(
            (episode: Episode) => episode.id === savedEpisodeId
          );
          const defaultEpisode = transformedEpisodes[0] || {
            id: "0",
            number: 1,
            image: "", // Set default image
          };
          setCurrentEpisode({
            id: savedEpisodeId,
            number: matchedEpisode?.number || defaultEpisode.number,
            image: matchedEpisode?.image || defaultEpisode.image,
          });
        }
      } catch (error) {
        console.error("Failed to fetch anime info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animeId]);

  const handleEpisodeSelect = useCallback(
    async (episodeId: string) => {
      setIsEpisodeChanging(true); // Start of episode change

      const selectedEpisode = episodes.find(
        (episode) => episode.id === episodeId
      );
      if (selectedEpisode) {
        setCurrentEpisode({
          id: episodeId,
          number: selectedEpisode.number,
          image: selectedEpisode.image || "",
        });
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId,
          episodeId
        );

        // Simulate an asynchronous operation (e.g., fetching episode details)
        // This is where you'd wait for any real async tasks related to changing the episode.
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Remove this line if you have actual async operations
      }

      setIsEpisodeChanging(false); // End of episode change, after async operations
    },
    [animeId, episodes]
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
          onEpisodeSelect={handleEpisodeSelect}
        />
      </EpisodeListContainer>
    </WatchContainer>
  );
};

export default Watch;
