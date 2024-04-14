import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { TbCardsFilled } from 'react-icons/tb';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';
import { Anime } from '../../index';

const slideUpAnimation = keyframes`
  0% { opacity: 0.4; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const SidebarStyled = styled.div`
  transition: 0.2s ease-in-out;
  margin: 0;
  padding: 0;
  max-width: 24rem;
  @media (max-width: 1000px) {
    max-width: unset;
  }
`;

const IndicatorDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin: 0rem;
  flex-shrink: 0;
`;

const TitleWithDot = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-top: 0.35rem;
  gap: 0.4rem;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  transition: background 0.2s ease;
`;

const CompletedIndicator = styled(IndicatorDot)`
  background-color: var(--completed-indicator-color);
`;

const CancelledIndicator = styled(IndicatorDot)`
  background-color: var(--cancelled-indicator-color);
`;

const NotYetAiredIndicator = styled(IndicatorDot)`
  background-color: var(--not-yet-aired-indicator-color);
`;

const OngoingIndicator = styled(IndicatorDot)`
  background-color: var(--ongoing-dot-color);
`;

const DefaultIndicator = styled(IndicatorDot)`
  background-color: var(--default-indicator-color);
`;

const AnimeCard = styled.div`
  display: flex;
  background-color: var(--global-div);
  border-radius: var(--global-border-radius);
  align-items: center;
  overflow: hidden;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  animation: ${slideUpAnimation} 0.5s ease-in-out;
  animation-fill-mode: backwards;
  transition:
    background-color 0s ease-in-out,
    margin-left 0.2s ease-in-out 0.1s;
    box-shadow 0.2s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    background-color: var(--global-div-tr);
    margin-left: 0.35rem;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 500px) {
    &:hover,
    &:active,
    &:focus {
      margin-left: unset;
    }
  }
`;

const AnimeImageStyled = styled.img`
  width: 4.25rem;
  height: 6rem;
  object-fit: cover;
  border-radius: var(--global-border-radius);
`;

const InfoStyled = styled.div``;

const Title = styled.p`
  top: 0;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
  margin: 0;
`;

const Details = styled.p`
  font-size: 0.75rem;
  margin: 0;
  color: rgba(102, 102, 102, 0.75);
  svg {
    margin-left: 0.4rem;
  }
`;

export const HomeSideBar: React.FC<{ animeData: Anime[] }> = ({
  animeData,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayedAnime = windowWidth <= 500 ? animeData.slice(0, 5) : animeData;

  return (
    <SidebarStyled>
      {displayedAnime.map((anime: Anime, index) => (
        <Link
          to={`/watch/${anime.id}`}
          key={anime.id}
          style={{ textDecoration: 'none', color: 'inherit' }}
          title={`${anime.title.userPreferred}`}
          aria-label={`Watch ${anime.title.userPreferred}`}
        >
          <AnimeCard
            key={anime.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <AnimeImageStyled
              src={anime.image}
              alt={anime.title.userPreferred}
            />
            <InfoStyled>
              <TitleWithDot>
                {(() => {
                  switch (anime.status) {
                    case 'Completed':
                      return <CompletedIndicator />;
                    case 'Cancelled':
                      return <CancelledIndicator />;
                    case 'Not yet aired':
                      return <NotYetAiredIndicator />;
                    case 'Ongoing':
                      return <OngoingIndicator />;
                    default:
                      return <DefaultIndicator />;
                  }
                })()}
                <Title>{anime.title.english || anime.title.romaji}</Title>
              </TitleWithDot>
              <Details>
                {anime.type && <>{anime.type}</>}
                {anime.releaseDate && (
                  <>
                    <FaCalendarAlt /> {anime.releaseDate}
                  </>
                )}
                {anime.currentEpisode !== null &&
                  anime.currentEpisode !== undefined &&
                  anime.totalEpisodes !== null &&
                  anime.totalEpisodes !== undefined &&
                  anime.totalEpisodes !== 0 &&
                  anime.totalEpisodes !== 0 && (
                    <>
                      <TbCardsFilled /> {anime.currentEpisode}
                      {' / '}
                      {anime.totalEpisodes}
                    </>
                  )}

                {anime.rating && (
                  <>
                    <FaStar /> {anime.rating}
                  </>
                )}
              </Details>
            </InfoStyled>
          </AnimeCard>
        </Link>
      ))}
    </SidebarStyled>
  );
};
