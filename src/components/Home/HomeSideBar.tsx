import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  fetchTopAnime,
  fetchPopularAnime,
  fetchRecentEpisodes,
  fetchAdvancedSearch,
} from '../../index'; // Adjust this import path as needed
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { TbCardsFilled } from 'react-icons/tb';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';

const slideUpAnimation = keyframes`
  0% { opacity: 0.4; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const SidebarStyled = styled.div`
  transition: 0.2s ease-in-out;
  margin-top: 1rem;
  margin-left: 1rem;
  @media (max-width: 1000px) {
    margin: 0rem;
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
  max-width: 22.5rem;
  @media (max-width: 1000px) {
    max-width: unset;
  }
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  animation: ${slideUpAnimation} 0.5s ease-in-out;
  animation-fill-mode: backwards;
  transition:
    background-color 0s ease-in-out,
    margin-left 0.2s ease-in-out 0.1s;

  &:hover,
  &:active,
  &:focus {
    background-color: var(--global-div-tr);
    // margin-left: 0.35rem;
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

const TitleStyled = styled.p`
  font-size: 0.9rem;
  margin: 0;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DetailsStyled = styled.p`
  font-size: 0.75rem;
  margin: 0;
  color: rgba(102, 102, 102, 0.75);
  svg {
    margin-left: 0.3rem;
  }
`;

export const HomeSideBar = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Calculates the current season based on the month
  const getCurrentSeason = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() is zero-based
    if (month >= 1 && month <= 3) return 'WINTER';
    if (month >= 4 && month <= 6) return 'SPRING';
    if (month >= 7 && month <= 9) return 'SUMMER';
    return 'FALL';
  };

  useEffect(() => {
    const fetchData = async () => {
      const season = getCurrentSeason();
      const year = new Date().getFullYear();
      const options = {
        type: 'ANIME',
        season: season,
        year: year.toString(),
        status: 'RELEASING',
        sort: ['POPULARITY_DESC'], // Assuming the API expects the sort parameter to be a JSON string
      };

      // Adjust searchQuery, page, and perPage as needed
      const data = await fetchAdvancedSearch('', 1, 10, options);
      setTopAnime(data.results);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayedAnime = windowWidth <= 1000 ? topAnime.slice(0, 5) : topAnime;

  return (
    <SidebarStyled>
      <h2>TOP AIRING</h2>
      {displayedAnime.map((anime, index) => (
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
                <TitleStyled>
                  {anime.title.english || anime.title.romaji}
                </TitleStyled>
              </TitleWithDot>
              <DetailsStyled>
                {anime.type && <>{anime.type}</>}
                {anime.releaseDate && (
                  <>
                    <FaCalendarAlt /> {anime.releaseDate}
                  </>
                )}
                {anime.totalEpisodes && (
                  <>
                    <TbCardsFilled /> {anime.totalEpisodes}
                  </>
                )}
                {anime.rating && (
                  <>
                    <FaStar /> {anime.rating}
                  </>
                )}
              </DetailsStyled>
            </InfoStyled>
          </AnimeCard>
        </Link>
      ))}
    </SidebarStyled>
  );
};
