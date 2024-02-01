import React from "react";
import styled from "styled-components";

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-top: 0.35rem;
  border-radius: 0.2rem;
  cursor: pointer;
  transition: background 0.2s ease;

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

  &:hover {
    transition: 0.1s ease;
  }
`;

const TitleComponent = ({ $ishovered, anime }) => {
  const truncateTitle = (title, maxLength) =>
    title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

  // Use optional chaining and provide a default value
  const displayTitle =
    anime.title?.english || anime.title?.romaji || "No Title";

  return (
    <TitleContainer $ishovered={$ishovered}>
      {(anime.status === "Ongoing" || anime.status === "RELEASING") && <Dot />}
      {(anime.status === "Completed" || anime.status === "FINISHED") && (
        <CompletedIndicator />
      )}

      <Title $ishovered={$ishovered} color={anime.color}>
        {truncateTitle(displayTitle, 35)}
      </Title>
    </TitleContainer>
  );
};

export default TitleComponent;
