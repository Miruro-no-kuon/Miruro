import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import EpisodeList from "../components/Watch/EpisodeList";
import VideoPlayer from "../components/Watch/Video/VideoPlayer";
import { fetchAnimeEpisodes /* fetchAnimeInfo2 */ } from "../hooks/useApi";
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
}

interface CurrentEpisode {
  id: string | null;
  number: number;
}

const Watch = () => {
  const { animeId } = useParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [provider, setProvider] = useState<any>(null);
  const [currentEpisode, setCurrentEpisode] = useState<CurrentEpisode>({
    id: null,
    number: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!animeId) {
        console.error("Anime ID is null.");
        setLoading(false);
        return;
      }

      // Simulate loading delay
      setTimeout(async () => {
        setLoading(true);
        try {
          const providerData = await fetchAnimeEpisodes(animeId);
          if (providerData && providerData.episodes) {
            const { episodes: fetchedEpisodes, providerId } = providerData;
            setEpisodes(fetchedEpisodes);
            setProvider(providerId);
            const savedEpisodeId =
              localStorage.getItem(
                LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId
              ) ||
              fetchedEpisodes[0]?.id ||
              null;
            const matchedEpisode = fetchedEpisodes.find(
              (episode: Episode) => episode.id === savedEpisodeId
            );
            const defaultEpisode = fetchedEpisodes[0] || {
              id: null,
              number: 1,
            };
            setCurrentEpisode({
              id: savedEpisodeId,
              number: matchedEpisode?.number || defaultEpisode.number,
            });
          }
          //! fetchAnimeInfo2 TEMP REMOVED FOR CACHING 🐛 BUG PURPOSES
          /*// Fetching additional anime information
          const infoData = await fetchAnimeInfo2(animeId);
          setAnimeInfo(infoData); // Store the fetched information in state */
        } catch (error) {
          console.error("Failed to fetch anime info:", error);
        } finally {
          setLoading(false);
        }
      }, 0);
    };

    fetchData();
  }, [animeId]);

  const handleEpisodeSelect = useCallback(
    (episodeId: string) => {
      const selectedEpisode = episodes.find(
        (episode) => episode.id === episodeId
      );
      setCurrentEpisode({
        id: episodeId,
        number: selectedEpisode?.number || 1,
      });
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId,
        episodeId
      );
    },
    [animeId, episodes]
  );

  const shouldPreload = useMemo(() => episodes.length <= 20, [episodes]);

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
          watchId={currentEpisode.id}
          episodeNumber={currentEpisode.number}
          provider={provider}
          shouldPreload={shouldPreload}
          bannerImage={null} //! BANNER TEMP REMOVED FOR CACHING 🐛 BUG PURPOSES
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
