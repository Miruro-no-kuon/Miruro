import React from "react";
import styled from "styled-components";

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-top: 0.35rem;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.$ishovered ? "var(--global-card-title-bg)" : "transparent"};
  transition: background 0.1s;
  cursor: pointer;

  &:hover {
    background: var(--global-card-title-bg);
  }
`;

const IndicatorDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Dot = styled(IndicatorDot)`
  background-color: #aaff00;
  flex-shrink: 0; /* Prevent shrinking */
`;

const CompletedIndicator = styled(IndicatorDot)`
  background-color: #00aaff;
  flex-shrink: 0; /* Prevent shrinking */
`;

const Title = styled.h5`
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${(props) => (props.$ishovered ? props.color : "var(--title-color)")};
  transition: color 0.1s;

  &:hover {
    color: var(--title-hover-color);
  }
`;

const TitleComponent = ({ $ishovered, anime }) => {
  const truncateTitle = (title, maxLength) =>
    title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

  return (
    <TitleContainer $ishovered={$ishovered}>
      {anime.status === "Ongoing" && <Dot />}
      {anime.status === "Completed" && <CompletedIndicator />}
      <Title $ishovered={$ishovered} color={anime.color}>
        {truncateTitle(anime.title.userPreferred, 35)}
      </Title>
    </TitleContainer>
  );
};

export default TitleComponent;
