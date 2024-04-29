import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Relation } from '../../index';

const SeasonCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const SeasonCard = styled(Link)`
  background-size: cover;
  background-position: center;
  padding: 0.9rem;
  height: 6rem;
  width: 20rem;
  @media (max-width: 500px) {
    height: 3rem;
    width: 8rem;
    padding: 1.3rem;
  }
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 0.3rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: var(--global-border-radius);
    z-index: 1;
  }
  transition: transform 0.2s ease-in-out;

  &:hover,
  &:active &:focus {
    transform: translateY(-5px);
    @media (max-width: 500px) {
      transform: none;
    }
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
`;

const SeasonName = styled.div`
  font-size: 0.9rem;
  @media (max-width: 500px) {
    display: none;
    width: 8rem;
    font-size: 0.8rem;
  }
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const RelationType = styled.div`
  font-size: 1.3rem;
  @media (max-width: 500px) {
    font-size: 1.1rem;
    width: 8rem;
    margin-bottom: 0.25rem;
  }
  font-weight: bold;
  color: white;
  border-radius: var(--global-border-radius);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.75rem;
`;

export const Seasons: React.FC<{ relations: Relation[] }> = ({ relations }) => {
  const sortedRelations = relations.sort((a, b) => {
    if (a.relationType === 'PREQUEL' && b.relationType !== 'PREQUEL') {
      return -1;
    }
    if (a.relationType !== 'PREQUEL' && b.relationType === 'PREQUEL') {
      return 1;
    }
    return 0;
  });

  return (
    <SeasonCardContainer>
      {sortedRelations.map((relation) => (
        <SeasonCard
          key={relation.id}
          to={`/watch/${relation.id}`}
          title={`Watch ${relation.title.english || relation.title.romaji || relation.title.userPreferred}`}
          aria-label={`Watch ${relation.title.english || relation.title.romaji || relation.title.userPreferred}`}
          style={{ backgroundImage: `url(${relation.image})` }}
        >
          <img
            src={relation.image}
            alt={`${relation.title.english || relation.title.romaji || relation.title.userPreferred} Cover`}
            style={{ display: 'none' }}
          />
          <Content>
            <RelationType>{relation.relationType}</RelationType>
            <SeasonName>
              {relation.title.english ||
                relation.title.romaji ||
                relation.title.userPreferred}
            </SeasonName>
          </Content>
        </SeasonCard>
      ))}
    </SeasonCardContainer>
  );
};
