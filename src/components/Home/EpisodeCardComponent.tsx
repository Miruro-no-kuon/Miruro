import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const popInAnimation = keyframes`
  0% {
    opacity: 0.4;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0%);
  }
`;

const AnimeEpisodeLink = styled(Link)`
  color: grey;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.05s ease-in-out;

  &:hover {
    color: var(--global-text);
  }
`;

const AnimeEpisodeCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 235px;
  border-radius: var(--global-border-radius);
  overflow: hidden;
  transition: 0.2s ease-in-out;

  img {
    animation: ${popInAnimation} 0.3s ease forwards;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .episode-info {
    padding: 0.5rem;
    background: var(--global-shadow);

    .episode-title {
      font-size: 1rem;
      font-weight: bold;
      color: var(--global-text);
      margin: 0.5rem 0;
      min-height: 2rem;
      max-height: 2rem;
      @media (max-width: 500px) {
        font-size: 0.8rem;
        min-height: 2rem;
        max-height: 2rem;
        overflow: hidden;
      }
    }

    .episode-number {
      font-size: 0.9rem;
      color: var(--secondary-text);
      min-height: 2rem;
      max-height: 2rem;
      @media (max-width: 500px) {
        font-size: 0.8rem;
        min-height: 0.5rem;
        max-height: 0.5rem;
      }
    }
  }
  &:hover {
    transform: translateY(-10px);
    background: var(--primary-accent);
  }
  @media (max-width: 500px) {
    width: 175px;
    &:hover {
      transform: none;
      background: var(--primary-accent);
    }
  }
`;

const EpisodeCardGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;

  @media (max-width: 1200px) {
    gap: 2rem;
  }

  @media (max-width: 1000px) {
    gap: 1.5rem;
  }

  @media (max-width: 800px) {
    gap: 1.25rem;
  }

  @media (max-width: 450px) {
    gap: 0.9rem;
  }
`;

const Section = styled.section`
  padding: 0rem;
  border-radius: var(--global-border-radius);
`;

interface AnimeEpisode {
  id: string;
  title?: string;
  number: number;
  image: string;
}

export const AnimeEpisodeCardComponent: React.FC<{
  episode: AnimeEpisode;
  animeId: string;
}> = ({ episode, animeId }) => {
  const episodeName = episode.id.split("-episode-")[0].replace(/-/g, " ");
  const conciseEpisodeName =
    episodeName.length > 30 ? `${episodeName.slice(0, 30)}...` : episodeName;

  const conciseTitle = episode.title
    ? episode.title.length > 30
      ? `${episode.title.slice(0, 30)}...`
      : episode.title
    : "";

  const displayEpisodeNumber =
    window.innerWidth > 500
      ? `Episode ${episode.number}${conciseTitle ? `: ${conciseTitle}` : ""}`
      : `Episode ${episode.number}`;

  return (
    <AnimeEpisodeLink
      to={`/watch/${animeId}`}
      style={{ textDecoration: "none" }}
    >
      <AnimeEpisodeCard title={episodeName}>
        <img src={episode.image} alt={`Cover for ${episodeName}`} />
        <div className="episode-info">
          <p className="episode-title">
            {conciseEpisodeName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </p>
          <p className="episode-number">{displayEpisodeNumber}</p>
        </div>
      </AnimeEpisodeCard>
    </AnimeEpisodeLink>
  );
};

export const renderWatchedEpisodes = () => {
  const watchedEpisodesData = localStorage.getItem("watched-episodes");
  let episodesToRender = [];

  if (watchedEpisodesData) {
    const allEpisodes = JSON.parse(watchedEpisodesData);

    for (const animeId in allEpisodes) {
      // Assuming we only want to render the last watched episode per anime
      const lastEpisode = allEpisodes[animeId][allEpisodes[animeId].length - 1];
      episodesToRender.push(
        <AnimeEpisodeCardComponent
          key={lastEpisode.id}
          episode={lastEpisode}
          animeId={animeId}
        />
      );
    }
  }

  return (
    <Section>
      <EpisodeCardGridContainer>{episodesToRender}</EpisodeCardGridContainer>
    </Section>
  );
};

export default renderWatchedEpisodes;
