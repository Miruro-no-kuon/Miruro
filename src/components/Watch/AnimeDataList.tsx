import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TbCards } from 'react-icons/tb';
import { FaStar } from 'react-icons/fa';
import { Anime, StatusIndicator } from '../../index';

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: 0.2s ease-in-out;
  .Section-Title {
    margin: 0;
    padding: 0 0 0.5rem 0;
    color: var(--global-text);
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const SidebarContainer = styled.div`
  padding: 0.75rem;
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
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
  animation: slideUp 0.5s ease-in-out;
  animation-fill-mode: backwards;
  transition:
    background-color 0s ease-in-out,
    margin-left 0.2s ease-in-out 0.1s;
  &:hover,
  &:active,
  &:focus {
    background-color: var(--global-div-tr);
    margin-left: 0.35rem;
    @media (max-width: 500px) {
      margin-left: unset;
    }
`;

const AnimeImage = styled.img`
  width: 4.25rem;
  height: 6rem;
  object-fit: cover;
  border-radius: var(--global-border-radius);
`;

const Info = styled.div``;

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

export const AnimeDataList: React.FC<{ animeData: Anime }> = ({
  animeData,
}) => {
  const filteredRecommendations = animeData.recommendations.filter((rec) =>
    ['OVA', 'SPECIAL', 'TV', 'MOVIE', 'ONA', 'NOVEL'].includes(rec.type || ''),
  );

  const filteredRelations = animeData.relations.filter((rel) =>
    ['OVA', 'SPECIAL', 'TV', 'MOVIE', 'ONA', 'NOVEL', 'MANGA'].includes(
      rel.type || '',
    ),
  );

  return (
    <Sidebar>
      {filteredRelations.length > 0 && (
        <SidebarContainer>
          <>
            <p className='Section-Title'>RELATED</p>
            {filteredRelations
              .slice(0, window.innerWidth > 500 ? 5 : 3)
              .map((relation, index) => (
                <Link
                  to={`/watch/${relation.id}`}
                  key={relation.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  title={`${relation.title.userPreferred}`}
                  aria-label={`Watch ${relation.title.userPreferred}`}
                >
                  <Card style={{ animationDelay: `${index * 0.1}s` }}>
                    <AnimeImage
                      src={relation.image}
                      alt={relation.title.userPreferred}
                      loading='lazy'
                    />
                    <Info>
                      <TitleWithDot>
                        <StatusIndicator status={relation.status} />
                        <Title>
                          {relation.title.english ??
                            relation.title.romaji ??
                            relation.title.userPreferred}
                        </Title>
                      </TitleWithDot>
                      <Details
                        aria-label={`Details about ${relation.title.userPreferred}`}
                      >
                        {/* Conditionally render each piece of detail only if it's not null or empty */}
                        {relation.type && `${relation.type} `}
                        {relation.episodes && (
                          <>
                            <TbCards aria-hidden='true' />{' '}
                            {`${relation.episodes} `}
                          </>
                        )}
                        {relation.rating && (
                          <>
                            <FaStar aria-hidden='true' />{' '}
                            {`${relation.rating} `}
                          </>
                        )}
                      </Details>
                    </Info>
                  </Card>
                </Link>
              ))}
          </>
        </SidebarContainer>
      )}
      {filteredRecommendations.length > 0 && (
        <SidebarContainer>
          <>
            <p className='Section-Title'>RECOMMENDED</p>
            {filteredRecommendations
              .slice(0, window.innerWidth > 500 ? 5 : 3)
              .map((recommendation, index) => (
                <Link
                  to={`/watch/${recommendation.id}`}
                  key={recommendation.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  title={`Watch ${recommendation.title.userPreferred}`}
                >
                  <Card style={{ animationDelay: `${index * 0.1}s` }}>
                    <AnimeImage
                      src={recommendation.image}
                      alt={recommendation.title.userPreferred}
                      loading='lazy'
                    />
                    <Info>
                      <TitleWithDot>
                        <StatusIndicator status={recommendation.status} />
                        <Title>
                          {recommendation.title.english ??
                            recommendation.title.romaji ??
                            recommendation.title.userPreferred}
                        </Title>
                      </TitleWithDot>
                      <Details
                        aria-label={`Details about ${recommendation.title.userPreferred}`}
                      >
                        {/* Similar conditional rendering for recommendation details */}
                        {recommendation.type && `${recommendation.type} `}
                        {recommendation.episodes && (
                          <>
                            <TbCards aria-hidden='true' />{' '}
                            {`${recommendation.episodes} `}
                          </>
                        )}
                        {recommendation.rating && (
                          <>
                            <FaStar aria-hidden='true' />{' '}
                            {`${recommendation.rating} `}
                          </>
                        )}
                      </Details>
                    </Info>
                  </Card>
                </Link>
              ))}
          </>
        </SidebarContainer>
      )}
    </Sidebar>
  );
};
