import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTv,
  faClosedCaptioning,
  faStar,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

interface Anime {
  id: string;
  coverImage?: string;
  image?: string;
  title: {
    romaji?: string;
    english?: string;
  };
  releaseDate?: number;
  rating?: number;
  color?: string;
  format?: string;
  type?: string;
  totalEpisodes?: number;
  currentEpisode?: number;
  description?: string;
  genres?: string[];
  status?: string;
  popularity?: {
    anidb?: number;
  };
  year?: string;
}

interface DropdownContainerProps {
  isVisible: boolean;
}

const DropdownContainer = styled.div<DropdownContainerProps>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: absolute;
  top: 90%;
  width: 33.5rem;
  margin-left: -0.6rem;
  overflow-y: auto;
  background-color: var(--global-input-div);
  border: 1px solid var(--global-input-border);
  border-radius: 1rem;
  @media (max-width: 1000px) {
    max-width: 60%;
  }
  @media (max-width: 500px) {
    max-width: 95%;
    top: 179%;
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
  margin-left: 0.2rem;
  width: 3rem;
  height: 4rem;
  border-radius: var(--global-border-radius);
  object-fit: cover;
  @media (max-width: 500px) {
    width: 2rem;
    height: 3rem;
  }
`;

const AnimeTitle = styled.p`
  margin: 0.25rem;
  text-align: left;
  overflow: hidden;
  font-size: 0.9rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 500px) {
    font-size: 0.8rem;
  }
`;

const AnimeDetails = styled.p`
  font-size: 0.6rem;
  margin: 0rem;
  margin-top: 0.5rem;
  display: flex;
  p {
    margin: 0rem;
  }
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
  searchQuery,
}) => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleResultClick = (animeId: string) => {
    onClose();
    navigate(`/watch/${animeId}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  //View all button
  const handleViewAllClick = () => {
    // Directly navigate to the desired page with search query
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    // Reset selectedIndex when dropdown becomes invisible
    if (!isVisible) {
      setSelectedIndex(null);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      const totalOptions = searchResults.length; // Not including "View All"
      let newSelectedIndex = selectedIndex !== null ? selectedIndex : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        newSelectedIndex = (newSelectedIndex + 1) % (totalOptions + 1); // +1 for "View All"
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        newSelectedIndex =
          (newSelectedIndex - 1 + totalOptions + 1) % (totalOptions + 1); // +1 for "View All"
      } else if (e.key === "Enter" && selectedIndex !== null) {
        e.preventDefault(); // Prevent form submission
        if (selectedIndex < totalOptions) {
          // Navigate to the selected anime's detail page
          handleResultClick(searchResults[selectedIndex].id);
        } else {
          // "View All" selected
          handleViewAllClick();
        }
      }

      setSelectedIndex(newSelectedIndex);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, searchResults, selectedIndex]);

  return (
    <DropdownContainer
      isVisible={isVisible && searchResults.length > 0}
      ref={dropdownRef}
    >
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
            <strong>
              {result.title?.english || result.title?.romaji || "n/a"}
            </strong>
            <AnimeDetails>
              <FontAwesomeIcon icon={faTv} />
              <p>&nbsp;</p>
              {result.type}
              <p>&nbsp;</p>
              <FontAwesomeIcon icon={faStar} />
              <p>&nbsp;</p>
              {result.rating / 10}
              <p>&nbsp;</p>
              <FontAwesomeIcon icon={faClosedCaptioning} />
              <p>&nbsp;</p>
              {result.totalEpisodes}
            </AnimeDetails>
          </AnimeTitle>
          <br></br>
        </ResultItem>
      ))}
      <ResultItem
        isSelected={selectedIndex === searchResults.length} // "View All" is selected
        onClick={handleViewAllClick}
        style={{ justifyContent: "center" }}
      >
        <AnimeTitle>
          <strong>View All </strong>
          <FontAwesomeIcon icon={faArrowRight} />
        </AnimeTitle>
      </ResultItem>
    </DropdownContainer>
  );
};

export default DropDownSearch;
