import React, { useRef, useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DropDownSearch from "./DropDownSearch";
import { fetchAdvancedSearch } from "../hooks/useApi"; // Adjust the path as necessary
import {
  faSun,
  faMoon,
  faSearch,
  faTimes,
  faSlash,
} from "@fortawesome/free-solid-svg-icons";

// Define keyframe animation
const fadeInAnimation = (color: string) => keyframes`
  from { background-color: transparent; }
  to { background-color: ${color}; }
`;

// Styled components
const StyledNavbar = styled.div`
  position: sticky;
  top: 0;
  height: 3.5rem;
  text-align: center;
  margin: 0 -2rem;
  padding: 0.5rem 2rem 0 2rem;
  background-color: var(--global-primary-bg-tr);
  backdrop-filter: blur(10px);
  transform: translateY(0);
  z-index: 4;
  width: calc(100%);
  animation: ${fadeInAnimation("var(--global-primary-bg-tr)")} 0.5s ease-out;
  transition: 0.1s ease-in-out;

  @media (max-width: 1000px) {
    margin: 0 -0.5rem;
    padding: 0.5rem 0.5rem 0 0.5rem;
  }
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.2s ease;
`;

const LogoImg = styled(Link)`
  width: 7rem;
  font-size: 1.25rem;
  font-weight: bold;
  margin-right: 1rem;
  text-decoration: none;
  color: var(--global-text);
  content: var(--logo-text-transparent);
  cursor: pointer;
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    color: black; // Replace with your hover color
    transform: scale(1.05);
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex: 1;
  max-width: 40%;
  height: 1rem;
  border: 1px solid var(--global-input-border);
  align-items: center;
  padding: 0.8rem;
  border-radius: var(--global-border-radius);
  background-color: var(--global-input-div);
  animation: ${fadeInAnimation("var(--global-input-div)")} 0.5s ease-out;

  @media (min-width: 1000px) {
    min-width: 25rem;
  }
`;

interface IconProps {
  $isFocused: boolean;
  $fontSize?: string;
}

const Icon = styled.div<IconProps>`
  margin-right: 0.7rem;
  color: var(--global-text);
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0.5)};
  font-size: ${({ $fontSize }) => $fontSize || "0.8rem"};
  transition: opacity 0.2s;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: var(--global-text);
  display: inline-block;
  font-size: 0.9rem;
  outline: 0;
  padding: 0;
  padding-top: 0;
  width: 100%;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
`;

interface ClearButtonProps {
  $query: string;
}

const ClearButton = styled.button<ClearButtonProps>`
  background: transparent;
  border: none;
  color: var(--global-text);
  font-size: 1.1rem;
  cursor: pointer;
  opacity: ${({ $query }) => ($query ? 0.5 : 0)};
  visibility: ${({ $query }) => ($query ? "visible" : "hidden")};
  transition: color 0.2s, opacity 0.2s;

  &:hover {
    color: var(--global-text);
    opacity: 1;
  }
`;

const ThemeToggleBtn = styled.button`
  background: transparent;
  border: none;
  border-radius: 0.2rem;
  color: var(--global-text);
  padding: 0.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: color 0.2s ease-in-out, transform 0.1s ease-in-out;

  &:hover {
    transform: rotate(-45deg);
  }
`;

interface SlashToggleBtnProps {
  $isFocused: boolean;
}

const SlashToggleBtn = styled.button<SlashToggleBtnProps>`
  background: transparent;
  border: 2px solid var(--global-text);
  border-radius: var(--global-border-radius);
  padding: 0.3rem;
  color: var(--global-text);
  font-size: 0.5rem;
  cursor: pointer;
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0.5)};
  margin-left: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

const detectUserTheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return true;
  }
  return false;
};

const saveThemePreference = (isDarkMode: boolean) => {
  localStorage.setItem("themePreference", isDarkMode ? "dark" : "light");
};

const getInitialThemePreference = () => {
  const storedThemePreference = localStorage.getItem("themePreference");

  if (storedThemePreference) {
    return storedThemePreference === "dark";
  }

  return detectUserTheme();
};

interface Anime {
  id: string;
  coverImage?: string;
  image?: string;
  title: {
    romaji?: string;
    english?: string;
  };
  rating?: {
    anilist?: number;
  };
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
  releaseDate?: string;
  year?: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const navbarRef = useRef(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimeout = useRef<Timer | null>(null);
  const [search, setSearch] = useState({
    isSearchFocused: false,
    searchQuery: searchParams.get("query") || "",
    isDropdownOpen: false,
  });

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) return;

    try {
      const fetchedData = await fetchAdvancedSearch(query, 1, 5); // Fetch first 5 results for the dropdown
      const formattedResults = fetchedData.results.map((anime: Anime) => ({
        id: anime.id, // Make sure to include the ID field
        title: anime.title,
        image: anime.image, // Adjust these property names based on your API response
      }));
      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setSearchResults([]);
    }
  };

  const handleCloseDropdown = () => {
    setSearch((prevState) => ({
      ...prevState,
      isDropdownOpen: false,
    }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      handleCloseDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(getInitialThemePreference());

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "/" && inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        setSearch((prevState) => ({
          ...prevState,
          isSearchFocused: true,
        }));
      } else if (e.key === "Escape" && inputRef.current) {
        inputRef.current.blur();
        setSearch((prevState) => ({
          ...prevState,
          isSearchFocused: false,
        }));
        handleCloseDropdown(); // Close dropdown on Escape key
      } else if (e.shiftKey && e.key.toLowerCase() === "d") {
        if (document.activeElement !== inputRef.current) {
          e.preventDefault();
          toggleTheme();
        }
      }
    },
    [search, isDarkMode]
  );

  useEffect(() => {
    const listener = handleKeyDown as EventListener;
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setSearch({ ...search, searchQuery: searchParams.get("query") || "" });
  }, [searchParams]);

  const navigateWithQuery = useCallback(
    (value: string) => {
      navigate(value ? `/search?query=${value}` : "/search");
    },
    [navigate]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch({ ...search, searchQuery: newValue });
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (newValue.trim()) {
        fetchSearchResults(newValue);
        setSearch((prevState) => ({
          ...prevState,
          isDropdownOpen: true, // Open dropdown on input change
        }));
      } else {
        setSearchResults([]);
        setSearch((prevState) => ({
          ...prevState,
          isDropdownOpen: false, // Close dropdown if input is empty
        }));
      }
    }, 200); // Debounce for 200ms
  };

  const handleKeyDownOnInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigateWithQuery(search.searchQuery);
      if (inputRef.current) {
        inputRef.current.blur(); // Add this line to blur the input
      }
    }
  };

  const handleClearSearch = () => {
    setSearch((prevState) => ({
      ...prevState,
      searchQuery: "",
    }));
    setSearchResults([]);
    setSearch((prevState) => ({
      ...prevState,
      isDropdownOpen: false, // Close dropdown when search is cleared
    }));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    saveThemePreference(newIsDarkMode);
  };

  return (
    <StyledNavbar ref={navbarRef}>
      <TopContainer>
        <LogoImg to="/home">見るろ の 久遠</LogoImg>

        <InputContainer>
          <Icon $isFocused={search.isSearchFocused}>
            <FontAwesomeIcon icon={faSearch} />
          </Icon>
          <SearchInput
            type="text"
            placeholder="Search Anime"
            value={search.searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDownOnInput}
            ref={inputRef}
          />
          <DropDownSearch
            searchResults={searchResults}
            onClose={handleCloseDropdown}
            isVisible={search.isDropdownOpen}
          />
          <ClearButton $query={search.searchQuery} onClick={handleClearSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </ClearButton>
          <SlashToggleBtn $isFocused={search.isSearchFocused}>
            <FontAwesomeIcon icon={faSlash} rotation={90} />
          </SlashToggleBtn>
        </InputContainer>
        <ThemeToggleBtn onClick={toggleTheme}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </ThemeToggleBtn>
      </TopContainer>
    </StyledNavbar>
  );
};

export default Navbar;
