import React, { useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faThList,
  faTh,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

interface Episode {
  id: string;
  number: number;
  title: string;
  image: string;
}

interface Props {
  episodes: Episode[];
  selectedEpisodeId: string;
  onEpisodeSelect: (id: string) => void;
}

const ListContainer = styled.div`
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  border-radius: 0.8rem;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-height: 42rem;

  @media (max-width: 1000px) {
    max-height: 22rem;
  }
`;

const EpisodeGrid = styled.div<{ $isRowLayout: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isRowLayout }) =>
    $isRowLayout ? "1fr" : "repeat(auto-fill, minmax(4rem, 1fr))"};
  gap: 0.4rem;
  padding: 0.6rem;
  overflow-y: auto;
  flex-grow: 1;
`;

const ListItem = styled.button<{
  $isSelected: boolean;
  $isRowLayout: boolean;
  $isClicked: boolean;
}>`
  background-color: ${({ $isClicked }) =>
    $isClicked ? "rgba(255, 0, 0, 0.1)" : "var(--global-tertiary-bg)"};
  border: none;
  border-radius: 0.2rem;
  color: ${({ $isSelected }) => ($isSelected ? "var(--global-text)" : "grey")};
  padding: ${({ $isRowLayout }) =>
    $isRowLayout ? "0.6rem 0.5rem" : "0.4rem 0"};
  text-align: ${({ $isRowLayout }) => ($isRowLayout ? "left" : "center")};
  cursor: pointer;
  justify-content: ${({ $isRowLayout }) =>
    $isRowLayout ? "space-between" : "center"};
  align-items: center;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: var(--global-button-hover-bg);
    color: white;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--global-secondary-bg);
  border-bottom: 1px solid var(--global-shadow);
  padding: 0.25rem 0;
`;

const SelectInterval = styled.select`
  padding: 0.75rem;
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  border: none;
  border-radius: 0.2rem;
`;

const LayoutToggle = styled.button`
  background-color: var(--global-secondary-bg);
  border: 1px solid var(--global-shadow);
  padding: 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
  color: var(--global-text);
  border-radius: 0.2rem;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: var(--global-button-hover-bg);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--global-secondary-bg);
  border: 1px solid var(--global-shadow);
  padding: 0.5rem;
  margin: 0 0.5rem;
  border-radius: 0.2rem;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: var(--global-button-hover-bg);
  }
`;

const SearchInput = styled.input`
  border: none;
  background-color: transparent;
  color: var(--global-text);
  margin-left: 0.5rem;
  outline: none;
  width: 100%;

  &::placeholder {
    color: var(--global-placeholder);
  }
`;

const Icon = styled.div`
  color: var(--global-text);
  opacity: 0.5;
  font-size: 0.8rem;
  transition: opacity 0.2s;

  @media (max-width: 768px) {
    display: none; /* Hide on mobile */
  }
`;

const EpisodeNumber = styled.span``;
const EpisodeTitle = styled.span`
  padding: 0.5rem;
`;

const EpisodeList: React.FC<Props> = ({
  episodes,
  selectedEpisodeId,
  onEpisodeSelect,
}) => {
  const [interval, setInterval] = useState<[number, number]>([0, 99]);
  const [isRowLayout, setIsRowLayout] = useState(true);
  console.log(isRowLayout);
  const [userLayoutPreference, setUserLayoutPreference] = useState<
    boolean | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clickedEpisodes, setClickedEpisodes] = useState<string[]>([]);

  useEffect(() => {
    const savedClickedEpisodes = localStorage.getItem("clickedEpisodes");
    console.log("Loaded from localStorage:", savedClickedEpisodes); // Debug log
    if (savedClickedEpisodes) {
      setClickedEpisodes(JSON.parse(savedClickedEpisodes));
    }
  }, []);

  const saveClickedEpisodes = useCallback(() => {
    localStorage.setItem("clickedEpisodes", JSON.stringify(clickedEpisodes));
  }, [clickedEpisodes]);

  const handleEpisodeClick = useCallback((id: string) => {
    setClickedEpisodes((prevClickedEpisodes) => {
      if (!prevClickedEpisodes.includes(id)) {
        const updatedClickedEpisodes = [...prevClickedEpisodes, id];
        return updatedClickedEpisodes;
      }
      return prevClickedEpisodes;
    });
  }, []);

  // This useEffect hook will watch for changes in clickedEpisodes and save them to localStorage accordingly.
  useEffect(() => {
    localStorage.setItem("clickedEpisodes", JSON.stringify(clickedEpisodes));
  }, [clickedEpisodes]);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((episode) => {
      const searchQuery = searchTerm.toLowerCase();
      return (
        episode.title?.toLowerCase().includes(searchQuery) ||
        episode.number.toString().includes(searchQuery)
      );
    });
  }, [episodes, searchTerm]);

  const intervalOptions = useMemo(() => {
    return episodes.reduce<{ start: number; end: number }[]>(
      (options, _, index) => {
        if (index % 100 === 0) {
          const start = index;
          const end = Math.min(index + 99, episodes.length - 1);
          options.push({ start, end });
        }
        return options;
      },
      []
    );
  }, [episodes]);

  const handleIntervalChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [start, end] = e.target.value.split("-").map(Number);
      setInterval([start, end]);
    },
    []
  );

  const toggleLayoutPreference = useCallback(() => {
    setIsRowLayout((prevLayout) => {
      const newLayout = !prevLayout;
      setUserLayoutPreference(newLayout);
      return newLayout;
    });
  }, []);
  useEffect(() => {
    const allTitlesNull = episodes.every((episode) => episode.title === null);
    const defaultLayout = episodes.length <= 26 && !allTitlesNull;

    setIsRowLayout(
      userLayoutPreference !== null ? userLayoutPreference : defaultLayout
    );

    const selectedEpisode = episodes.find(
      (episode) => episode.id === selectedEpisodeId
    );
    if (selectedEpisode) {
      for (let i = 0; i < intervalOptions.length; i++) {
        const { start, end } = intervalOptions[i];
        if (
          selectedEpisode.number >= start + 1 &&
          selectedEpisode.number <= end + 1
        ) {
          setInterval([start, end]);
          break;
        }
      }
    }
  }, [episodes, userLayoutPreference, selectedEpisodeId, intervalOptions]);

  return (
    <ListContainer>
      <ControlsContainer>
        <SelectInterval
          onChange={handleIntervalChange}
          value={`${interval[0]}-${interval[1]}`}
        >
          {intervalOptions.map(({ start, end }, index) => (
            <option key={index} value={`${start}-${end}`}>
              Episodes {start + 1} - {end + 1}
            </option>
          ))}
        </SelectInterval>

        <SearchContainer>
          <Icon>
            <FontAwesomeIcon icon={faSearch} />
          </Icon>
          <SearchInput
            type="text"
            placeholder="Search episodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <LayoutToggle onClick={toggleLayoutPreference}>
          {isRowLayout ? (
            <FontAwesomeIcon icon={faTh} />
          ) : (
            <FontAwesomeIcon icon={faThList} />
          )}
        </LayoutToggle>
      </ControlsContainer>

      <EpisodeGrid $isRowLayout={isRowLayout}>
        {filteredEpisodes.slice(interval[0], interval[1] + 1).map((episode) => {
          const $isSelected = episode.id === selectedEpisodeId;
          const isClicked = clickedEpisodes.includes(episode.id);

          return (
            <ListItem
              key={episode.id}
              $isSelected={$isSelected}
              $isRowLayout={isRowLayout}
              $isClicked={isClicked}
              onClick={() => {
                handleEpisodeClick(episode.id);
                onEpisodeSelect(episode.id);
              }}
              aria-selected={$isSelected}
            >
              {isRowLayout ? (
                <>
                  <EpisodeNumber>{episode.number}</EpisodeNumber>
                  <EpisodeTitle>{episode.title}</EpisodeTitle>
                  {$isSelected && <FontAwesomeIcon icon={faPlay} />}
                </>
              ) : $isSelected ? (
                <FontAwesomeIcon icon={faPlay} />
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
