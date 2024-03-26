import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Anime } from "../hooks/interface";
import { FaAngleRight } from "react-icons/fa";
import { MdLayers } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";

// Keyframes for animation
const slideDownAnimation = keyframes`
  0% { transform: translateY(0px); max-height: 0; }
  100% {  transform: translateY(0); max-height: 500px; } /* Example max-height */
`;

const slideDownAnimation2 = keyframes`
  0% { opacity: 0; transform: translateY(-20px); max-height: 0; }
  100% { opacity: 1; transform: translateY(0); max-height: 500px; } /* Example max-height */
`;

// Styled components
const DropdownContainer = styled.div<{ $isVisible: boolean; width: number }>`
  display: ${(props) => (props.$isVisible ? "block" : "none")};
  position: absolute;
  z-index: -1;
  top: 1rem;
  width: ${({ width }) => `${width}px`};
  margin-left: -0.6rem;
  overflow-y: auto;
  background-color: var(--global-div);
  border-top: none;
  border-radius: 0.3rem;
  padding-top: 2.5rem;
  animation: ${slideDownAnimation} 0.5s ease forwards;

  /* Adjusted for responsive design */
  @media (max-width: 500px) {
    top: 4rem;
    width: 96.4%;
  }

  /* Hide scrollbar for aesthetics */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }

  /* Animation effect */
  visibility: ${(props) => (props.$isVisible ? "visible" : "hidden")};
  max-height: ${(props) =>
    props.$isVisible ? "500px" : "0"}; /* Adapt max-height accordingly */
`;

const AnimeDetails = styled.p<{ $isSelected: boolean }>`
  margin: 0;
  animation: ${slideDownAnimation2} 0.5s ease forwards;
  color: ${(props) =>
    props.$isSelected ? "var(--primary-text);" : "rgba(102, 102, 102, 0.75);"};
  font-size: 0.65rem;
  font-weight: bold;
  padding: 0 0.5rem;
  display: flex;
  font-family: Arial;
`;

const ResultItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  animation: ${slideDownAnimation2} 0.5s ease forwards;
  padding: 0.5rem;
  margin: 0;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelected ? "var(--primary-accent-bg)" : "transparent"};

  &:hover {
    background-color: var(--primary-accent-bg);
    ${AnimeDetails} {
      color: var(--primary-text);
    }
  }
`;

const ViewAllItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  animation: ${slideDownAnimation2} 0.5s ease forwards;
  align-items: center;
  padding: 0.5rem 0.25rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelected ? "var(--primary-accent-bg)" : "transparent"};

  &:hover,
  &:active,
  &:focus {
    background-color: var(--primary-accent-bg);
    & > svg {
      transform: translateX(5px); /* Move the icon 5px to the right */
      transition: transform 0.3s ease; /* Add transition effect */
    }
  }
`;

const AnimeImage = styled.img`
  animation: ${slideDownAnimation2} 0.5s ease forwards;
  width: 2.5rem;
  height: 3.5rem;
  border-radius: var(--global-border-radius);
  object-fit: cover;

  @media (max-width: 500px) {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const AnimeTitle = styled.p`
  margin: 0 0.5rem;
  padding: 0.1rem;
  animation: ${slideDownAnimation2} 0.5s ease forwards;
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
      $isVisible={isVisible && searchResults.length > 0}
      ref={dropdownRef}
      role="list" // Enhanced semantic meaning for accessibility
    >
      {searchResults.map((result, index) => (
        <ResultItem
          key={result.id} // Using a unique identifier for the key if available
          title={result.title.english || result.title.romaji}
          $isSelected={index === selectedIndex}
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
            <AnimeDetails $isSelected={index === selectedIndex}>
              <span>&nbsp;{result.type}</span>
              <span>&nbsp;&nbsp;</span>
              <BiSolidLike color="#" />
              <span>&nbsp;</span>
              <span>{result.rating ? result.rating / 10 : "N/A"}&nbsp;</span>
              <span>&nbsp;&nbsp;</span>
              <MdLayers color="#" />
              <span>&nbsp;</span>
              <span>{result.totalEpisodes || "N/A"}&nbsp;</span>
            </AnimeDetails>
          </div>
        </ResultItem>
      ))}
      <ViewAllItem
        $isSelected={selectedIndex === searchResults.length} // "View All" is selected
        onClick={handleViewAllClick}
        style={{ justifyContent: "center" }}
        role="listitem"
        tabIndex={0} // Add tabIndex to make it focusable
      >
        <>view all</> &nbsp;
        <FaAngleRight />
      </ViewAllItem>
    </DropdownContainer>
  );
};

export default DropDownSearch;
