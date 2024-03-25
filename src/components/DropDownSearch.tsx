import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaClosedCaptioning, FaHeart, FaArrowRight } from "react-icons/fa";

// Keyframes for animation
const slideDownAnimation = keyframes`
  0% { opacity: 0; transform: translateY(0px); max-height: 0; }
  100% { opacity: 1; transform: translateY(0); max-height: 500px; } /* Example max-height */
`;

const slideDownAnimation2 = keyframes`
  0% { opacity: 0; transform: translateY(-20px); max-height: 0; }
  100% { opacity: 1; transform: translateY(0); max-height: 500px; } /* Example max-height */
`;

// Styled components
const DropdownContainer = styled.div<{ isVisible: boolean; width: number }>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: absolute;
  z-index: -1;
  top: 1rem;
  width: ${({ width }) => `${width}px`};
  margin-left: -0.7rem;
  overflow-y: auto;
  background-color: var(--global-input-div);
  border: 1px solid var(--global-input-border);
  border-top: none;
  border-radius: 1.5rem;
  padding-top: 3rem;
  animation: ${slideDownAnimation} 0.5s ease forwards;

  /* Adjusted for responsive design */
  @media (max-width: 500px) {
    top: 4rem;
    margin-left: -0.5rem;
    width: 92%;
  }

  /* Hide scrollbar for aesthetics */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }

  /* Animation effect */
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  max-height: ${(props) =>
    props.isVisible ? "500px" : "0"}; /* Adapt max-height accordingly */
`;

const ResultItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  border-radius: var(--global-border-radius);
  animation: ${slideDownAnimation2} 0.5s ease forwards;
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
  animation: ${slideDownAnimation2} 0.5s ease forwards;
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
  animation: ${slideDownAnimation2} 0.5s ease forwards;
  margin: 0;
  padding: 0 0.5rem;
  text-align: left;
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 500px) {
    font-size: 0.8rem;
  }
`;

const AnimeDetails = styled.p`
  top: 0;
  margin: 0;
  animation: ${slideDownAnimation2} 0.5s ease forwards;
  font-size: 0.6rem;
  padding: 0 0.5rem;
  font-weight: bold;
  display: flex;
`;

// Interface for Anime
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

// Props interface for DropDownSearch component
interface DropDownSearchProps {
  searchResults: Anime[];
  onClose: () => void;
  isVisible: boolean;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  searchQuery: string;
  containerWidth: number;
}

const DropDownSearch: React.FC<DropDownSearchProps> = ({
  searchResults,
  onClose,
  isVisible,
  selectedIndex,
  setSelectedIndex,
  searchQuery,
  containerWidth,
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking on a search result
  const handleResultClick = (animeId: string) => {
    onClose();
    navigate(`/watch/${animeId}`);
  };

  // Handle clicking outside of dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
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
    // Handle keyboard navigation
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

  // Handle clicking "View All"
  const handleViewAllClick = () => {
    // Directly navigate to the desired page with search query
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  return (
    <DropdownContainer
      width={containerWidth}
      isVisible={isVisible && searchResults.length > 0}
      ref={dropdownRef}
      role="list" // Enhanced semantic meaning for accessibility
    >
      {searchResults.map((result, index) => (
        <ResultItem
          key={result.id} // Using a unique identifier for the key if available
          title={result.title.english || result.title.romaji}
          isSelected={index === selectedIndex}
          onClick={() => handleResultClick(result.id)}
          role="listitem" // Enhanced semantic meaning for accessibility
        >
          <AnimeImage
            src={result.image || result.coverImage || ""} // Fallback for missing images
            alt={result.title?.english || result.title?.romaji || "n/a"}
          />
          <div>
            <AnimeTitle>
              {result.title?.english || result.title?.romaji || "n/a"}
            </AnimeTitle>
            <AnimeDetails>
              <span>&nbsp;{result.type}</span>
              <span>&nbsp;&nbsp;</span>
              <span>{result.rating ? result.rating / 10 : "N/A"}&nbsp;</span>
              <FaHeart color="red" />
              <span>&nbsp;&nbsp;</span>
              <span>{result.totalEpisodes || "N/A"}&nbsp;</span>
              <FaClosedCaptioning color="#0395ff" />
            </AnimeDetails>
          </div>
        </ResultItem>
      ))}
      <ResultItem
        isSelected={selectedIndex === searchResults.length} // "View All" is selected
        onClick={handleViewAllClick}
        style={{ justifyContent: "center" }}
        role="listitem"
      >
        View All &nbsp;
        <FaArrowRight />
      </ResultItem>
    </DropdownContainer>
  );
};

export default DropDownSearch;
