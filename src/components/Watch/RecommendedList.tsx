import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { TbCardsFilled } from 'react-icons/tb';
import { FaStar } from 'react-icons/fa';
import { Anime } from '../../hooks/interface';

const slideUpAnimation = keyframes`
  0% { opacity: 0.4; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Sidebar = styled.div`
  transition: 0.2s ease-in-out;
  .Section-Title {
    margin: 0;
    padding: 0 0 0.5rem 0;
    color: var(--global-text);
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const Card = styled.div`
  display: flex;
  background-color: var(--global-div);
  border-radius: var(--global-border-radius);
  align-items: center;
  overflow: hidden;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  animation: ${slideUpAnimation} 0.5s ease-in-out; /* Apply fade-in animation */
  animation-fill-mode: backwards; /* Ensure elements stay in initial position until animation starts */
  transition:
    background-color 0s ease-in-out,
    margin-left 0.2s ease-in-out 0.1s;

  &:hover,
  &:active,
  &:focus {
    background-color: var(--global-div-tr);
    margin-left: 0.35rem;
  }
`;

const AnimeImage = styled.img`
  width: 4rem;
  height: 6rem;
  object-fit: cover;
  border-radius: var(--global-border-radius);
`;

const Info = styled.div``;

const Title = styled.p`
  top: 0;
  margin: 0;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
`;

const Details = styled.p`
  font-size: 0.75rem;
  margin: 0;
  color: rgba(102, 102, 102, 0.75);
`;

const RecommendedList: React.FC<{ animeData: Anime }> = ({ animeData }) => {
  const filteredRecommendations = animeData.recommendations.filter((rec) =>
    ['OVA', 'SPECIAL', 'TV', 'MOVIE', 'ONA', 'NOVEL'].includes(rec.type || ''),
  );

  const filteredRelations = animeData.relations.filter(
    (rel) =>
      ['OVA', 'SPECIAL', 'TV', 'MOVIE', 'ONA', 'NOVEL'].includes(
        rel.type || '',
      ) && !['SEQUEL', 'PREQUEL'].includes(rel.relationType || ''),
  );

  return (
    <Sidebar>
      {filteredRelations.length > 0 && (
        <>
          <p className='Section-Title'>RELATED</p>
          {filteredRelations
            .slice(0, window.innerWidth > 500 ? 4 : 3)
            .map((relation, index) => (
              <Link
                to={`/watch/${relation.id}`}
                key={relation.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
                title={`Watch ${relation.title.userPreferred}`} // Adding meaningful title
                aria-label={`Watch ${relation.title.userPreferred}`} // Improving accessibility
              >
                <Card style={{ animationDelay: `${index * 0.1}s` }}>
                  <AnimeImage
                    src={relation.image}
                    alt={relation.title.userPreferred}
                    loading='lazy' // Improve loading times and efficiency
                  />
                  <Info>
                    <Title>
                      {relation.title.english ??
                        relation.title.romaji ??
                        relation.title.userPreferred}
                    </Title>
                    <Details
                      aria-label={`Details about ${relation.title.userPreferred}`}
                    >
                      {`${relation.type || ''} `}
                      <TbCardsFilled aria-hidden='true' />{' '}
                      {`${relation.episodes}  `}
                      <FaStar aria-hidden='true' /> {`${relation.rating}  `}
                    </Details>
                  </Info>
                </Card>
              </Link>
            ))}
          <br></br>
        </>
      )}
      {filteredRecommendations.length > 0 && (
        <>
          <p className='Section-Title'>RECOMMENDED</p>
          {filteredRecommendations
            .slice(0, window.innerWidth > 500 ? 5 : 4)
            .map((recommendation, index) => (
              <Link
                to={`/watch/${recommendation.id}`}
                key={recommendation.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
                title={`Watch ${recommendation.title.userPreferred}`} // Adding meaningful title
                aria-label={`Watch ${recommendation.title.userPreferred}`} // Improving accessibility
              >
                <Card style={{ animationDelay: `${index * 0.1}s` }}>
                  <AnimeImage
                    src={recommendation.image}
                    alt={recommendation.title.userPreferred}
                    loading='lazy' // Improve loading times and efficiency
                  />
                  <Info>
                    <Title>
                      {recommendation.title.english ??
                        recommendation.title.romaji ??
                        recommendation.title.userPreferred}
                    </Title>
                    <Details
                      aria-label={`Details about ${recommendation.title.userPreferred}`}
                    >
                      {`${recommendation.type} `}
                      <TbCardsFilled aria-hidden='true' />{' '}
                      {`${recommendation.episodes}  `}
                      <FaStar aria-hidden='true' />{' '}
                      {`${recommendation.rating}  `}
                    </Details>
                  </Info>
                </Card>
              </Link>
            ))}
        </>
      )}
    </Sidebar>
  );
};

export default RecommendedList;
