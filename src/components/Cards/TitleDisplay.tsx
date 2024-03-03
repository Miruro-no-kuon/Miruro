import React from "react";
import styled from "styled-components";

// Define the types for the anime object and props
interface AnimeTitle {
  romaji?: string;
  english?: string;
}

interface TitleComponentProps {
  isHovered: boolean; // Renamed from $ishovered to isHovered for consistency with TypeScript naming conventions
  anime: {
    title: AnimeTitle;
    status?: string;
    color?: string;
  };
}

// Adjusting styled components to accept props correctly
const TitleContainer = styled.div<{ isHovered: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-top: 0.35rem;
  border-radius: var(--global-border-radius);
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

const Title = styled.h5<{ isHovered: boolean; color?: string }>`
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${(props) => (props.isHovered ? props.color : "var(--title-color)")};

  &:hover {
    transition: 0.1s ease;
  }
`;

const TitleComponent: React.FC<TitleComponentProps> = ({
  isHovered,
  anime,
}) => {
  const truncateTitle = (title: string, maxLength: number) =>
    title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;

  // Use optional chaining and provide a default value
  const displayTitle = anime.title.english || anime.title.romaji || "No Title";

  return (
    <TitleContainer isHovered={isHovered}>
      {(anime.status === "Ongoing" || anime.status === "RELEASING") && <Dot />}
      {(anime.status === "Completed" || anime.status === "FINISHED") && (
        <CompletedIndicator />
      )}
      <Title isHovered={isHovered} color={anime.color}>
        {truncateTitle(displayTitle, 35)}
      </Title>
    </TitleContainer>
  );
};

export default TitleComponent;
