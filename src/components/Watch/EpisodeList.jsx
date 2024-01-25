import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components";

const ListContainer = styled.div`
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  border-radius: 0.2rem;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const EpisodeGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $isRowLayout }) =>
    $isRowLayout ? "1fr" : "repeat(auto-fill, minmax(4rem, 1fr))"};
  gap: 0.4rem;
  padding: 0.75rem;
  overflow-y: auto;
  flex-grow: 1;
`;

const ListItem = styled.button`
  background-color: var(--global-tertiary-bg);
  border: none;
  border-radius: 0.2rem;
  color: ${({ $isSelected }) => ($isSelected ? "white" : "grey")};
  padding: ${({ $isRowLayout }) =>
    $isRowLayout ? "0.6rem 0.5rem" : "0.4rem 0"};
  text-align: ${({ $isRowLayout }) => ($isRowLayout ? "left" : "center")};
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: var(--global-button-hover-bg);
    color: white;
  }
`;

const SelectInterval = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 10px;
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  border: 1px solid var(--global-shadow);
  border-top: none;
  border-right: none;
  border-left: none;
`;

const EpisodeNumber = styled.span``;
const EpisodeTitle = styled.span`
  padding: 0.5rem;
`;

const EpisodeList = ({ episodes, selectedEpisodeId, onEpisodeSelect }) => {
  const [interval, setInterval] = useState([0, 99]);
  const isRowLayout = episodes.length < 20;

  const intervalOptions = useMemo(() => {
    return episodes.reduce((options, _, index) => {
      if (index % 100 === 0) {
        const start = index;
        const end = Math.min(index + 99, episodes.length - 1);
        options.push({ start, end });
      }
      return options;
    }, []);
  }, [episodes]);

  const handleIntervalChange = useCallback((e) => {
    const [start, end] = e.target.value.split("-").map(Number);
    setInterval([start, end]);
  }, []);

  return (
    <ListContainer>
      <SelectInterval onChange={handleIntervalChange}>
        {intervalOptions.map(({ start, end }, index) => (
          <option key={index} value={`${start}-${end}`}>
            Episodes {start + 1} - {end + 1}
          </option>
        ))}
      </SelectInterval>

      <EpisodeGrid $isRowLayout={isRowLayout}>
        {episodes.slice(interval[0], interval[1] + 1).map((episode) => {
          const $isSelected = episode.id === selectedEpisodeId;

          return (
            <ListItem
              key={episode.id}
              $isSelected={$isSelected}
              $isRowLayout={isRowLayout}
              onClick={() => onEpisodeSelect(episode.id)}
              aria-selected={$isSelected}
            >
              {isRowLayout ? (
                <>
                  <EpisodeNumber>{episode.number}</EpisodeNumber>
                  <EpisodeTitle>{episode.title}</EpisodeTitle>
                </>
              ) : (
                <EpisodeNumber>{episode.number}</EpisodeNumber>
              )}
            </ListItem>
          );
        })}
      </EpisodeGrid>
    </ListContainer>
  );
};

export default EpisodeList;
