import { useEffect, useState, useCallback, useMemo } from "react";
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
    (episodeId: string) => {
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
      }
    },
    [animeId, episodes]
  );

  const shouldPreload = useMemo(() => episodes.length <= 26, [episodes]);

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
          id={animeId}
          episodeId={currentEpisode.id}
          episodeNumber={currentEpisode.number}
          provider={"gogoanime"} // You may need to determine how to set this
          shouldPreload={shouldPreload}
          bannerImage={currentEpisode.image} // Set the banner image here
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
