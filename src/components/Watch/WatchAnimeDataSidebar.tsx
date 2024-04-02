import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TbCardsFilled } from 'react-icons/tb';
import { FaStar } from 'react-icons/fa';
// Styled components
const SideBar = styled.div`
  margin-left: 2rem;
  @media (max-width: 1500px) {
    margin: 0;
  }
  .Card-Sections-Titles {
    margin-top: 0;
    line-height: 1.6rem;
    color: var(--global-text);
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    @media (max-width: 500px) {
      font-size: 1.25rem;
      margin-bottom: 0.2rem;
    }
  }
`;

const RecommendationCard = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  background-color: var(--global-div);
  border-radius: var(--global-border-radius);
  overflow: hidden;
  margin-bottom: 1rem;
  cursor: pointer;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  &:hover {
    filter: brightness(1.1);
  }
  .anime-image {
    margin-right: 0.5rem;
    flex-shrink: 0;
    width: 4rem;
    height: 6rem;
    object-fit: cover;
    border-radius: 0.125rem;
  }

  .anime-info {
    margin-right: 0.5rem;
    .anime-title {
      margin: 0;
      font-size: 1rem;
      margin-bottom: 0.5rem;
      display: -webkit-box; /* Needed for the line-clamp */
      -webkit-line-clamp: 2; /* Number of lines you want */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal; /* Overrides previous white-space */
    }

    .anime-details {
      font-size: 0.75rem;
      margin: 0;
      color: rgba(102, 102, 102, 0.75);
    }
  }
  svg {
  }
`;

interface AnimeDataProps {
  animeData: any;
}

// Main component
const WatchAnimeDataSideBar: React.FC<AnimeDataProps> = ({ animeData }) => {
  return (
    <SideBar>
      {animeData &&
        animeData.recommendations.filter((recommendation) =>
          ['OVA', 'SPECIAL', 'TV', 'MOVIE', 'ONA', 'NOVEL'].includes(
            recommendation.type,
          ),
        ).length > 0 && (
          <>
            <p className='Card-Sections-Titles'>Recommendations</p>
            {animeData.recommendations
              .filter((recommendation) =>
                ['OVA', 'SPECIAL', 'TV', 'MOVIE', 'ONA', 'NOVEL'].includes(
                  recommendation.type,
                ),
              )
              .slice(0, window.innerWidth > 500 ? 5 : 4)
              .map((recommendation) => (
                <Link
                  to={`/watch/${recommendation.id}`}
                  key={recommendation.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <RecommendationCard>
                    <img
                      src={recommendation.image}
                      alt={recommendation.title.userPreferred}
                      className='anime-image'
                    />
                    <div className='anime-info'>
                      <p className='anime-title'>
                        {recommendation.title.english
                          ? recommendation.title.english
                          : recommendation.title.romaji}
                      </p>
                      <p className='anime-details'>
                        {`${recommendation.type} | `}
                        <TbCardsFilled /> {`${recommendation.episodes}  `}
                        <FaStar /> {`${recommendation.rating}  `}
                      </p>
                    </div>
                  </RecommendationCard>
                </Link>
              ))}
          </>
        )}
    </SideBar>
  );
};

export default WatchAnimeDataSideBar;
