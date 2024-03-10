import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface Anime {
  id: string;
  image: string;
  title: {
    english?: string;
    romaji?: string;
  };
}

interface DropdownContainerProps {
  isVisible: boolean;
}

const DropdownContainer = styled.div<DropdownContainerProps>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: absolute;
  top: 80%;
  width: 40%;
  margin-left: -0.8rem;
  overflow-y: auto;
  background-color: var(--global-input-div);
  border: 0.0625rem solid var(--global-input-border);
  border-top: none;
  border-radius: var(--global-border-radius);
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  @media (max-width: 62.5rem) {
    width: 41.9%;
  }

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
`;

const ResultItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.isSelected ? "var(--primary-accent-bg)" : "transparent"};

  &:hover {
    background-color: var(--primary-accent-bg);
  }
`;

const AnimeImage = styled.img`
  width: 2.125rem;
  border-radius: 0.2rem;
  height: auto;
  object-fit: cover;
`;

const AnimeTitle = styled.p`
  margin: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface DropDownSearchProps {
  searchResults: Anime[];
  onClose: () => void;
  isVisible: boolean;
}

const DropDownSearch: React.FC<DropDownSearchProps> = ({
  searchResults = [],
  onClose,
  isVisible,
}) => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleResultClick = (animeId: string) => {
    onClose();
    navigate(`/watch/${animeId}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === searchResults.length - 1
            ? 0
            : prevIndex + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === 0
            ? searchResults.length - 1
            : prevIndex - 1
        );
      } else if (e.key === "Enter" && selectedIndex !== null) {
        handleResultClick(searchResults[selectedIndex].id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, searchResults, selectedIndex, onClose, navigate]);

  return (
    <DropdownContainer isVisible={isVisible}>
      {searchResults.map((result, index) => (
        <ResultItem
          key={index}
          isSelected={index === selectedIndex}
          onClick={() => handleResultClick(result.id)}
        >
          <AnimeImage
            src={result.image}
            alt={result.title?.english || result.title?.romaji || "n/a"}
          />
          <AnimeTitle>
            {result.title?.english || result.title?.romaji || "n/a"}
          </AnimeTitle>
        </ResultItem>
      ))}
    </DropdownContainer>
  );
};

export default DropDownSearch;
