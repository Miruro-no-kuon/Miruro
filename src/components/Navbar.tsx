import React, { useRef, useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
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

const StyledNavbar = styled.div`
  position: fixed; /* or 'absolute', depending on layout needs */
  top: 0;
  left: 0;
  right: 0;
  height: 2.5rem;
  text-align: center;
  margin: 0; /* Remove any margin */
  padding: 0.5rem 2rem;
  background-color: var(--global-primary-bg);
  backdrop-filter: blur(10px);
  z-index: 4;
  /* Removed width and transform properties */
  animation: ${fadeInAnimation("var(--global-primary-bg-tr)")} 0.5s ease-out;
  transition: 0.1s ease-in-out;

  @media (max-width: 500px) {
    padding: 0.5rem 0.5rem; /* Adjusted for smaller screens */
    height: 2rem;
  }
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoImg = styled(Link)`
  width: 7rem;
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--global-text);
  content: var(--logo-text-transparent);
  cursor: pointer;
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    color: black; // Replace with your hover color
    transform: scale(1.05);
  }
  @media (max-width: 500px) {
    max-width: 6rem;
    margin-right: 1rem;
    /* padding: 0rem; */
  }
`;

const InputToggleBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--global-text);
  font-size: 1.2rem;
  cursor: pointer;
  display: none; // Default to not displayed
  align-items: right;
  @media (max-width: 500px) {
    display: block; // Only show on small screens
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex: 1;
  max-width: 35rem;
  height: 1.2rem;
  border: 1px solid var(--global-input-border);
  align-items: center;
  padding: 0.6rem;
  border-radius: 1.5rem;
  background-color: var(--global-input-div);
  animation: ${fadeInAnimation("var(--global-input-div)")} 0.1s ease-out;
  @media (max-width: 1000px) {
    max-width: 20rem;
  }
  @media (max-width: 500px) {
    max-width: 100%;
    margin-top: 0.5rem;
    display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  }
`;
const RightContent = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
`;

interface IconProps {
  $isFocused: boolean;
  $fontSize?: string;
}

const Icon = styled.div<IconProps>`
  margin-left: 0.2rem;
  margin-right: 0.5rem;
  color: var(--global-text);
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0.5)};
  font-size: ${({ $fontSize }) => $fontSize || "0.8rem"};
  transition: opacity 0.2s;
  @media (max-width: 500px) {
  }
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
  border-radius: var(--global-border-radius);
  color: var(--global-text);
  padding: 0.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease-in-out, transform 0.1s ease-in-out;

  &:hover {
    transform: rotate(-45deg);
  }
  @media (max-width: 500px) {
    margin-left: 0.7rem;
    padding-right: 0.7rem;
  }
`;

interface SlashToggleBtnProps {
  $isFocused: boolean;
}

const SlashToggleBtn = styled.button<SlashToggleBtnProps>`
  margin-right: 0.3rem;
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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const navbarRef = useRef(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimeout = useRef<Timer | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState({
    isSearchFocused: false,
    searchQuery: searchParams.get("query") || "",
    isDropdownOpen: false,
  });
  const [isInputVisible, setIsInputVisible] = useState(false); // Default to false
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 500);
  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) return;

    try {
      const fetchedData = await fetchAdvancedSearch(query, 1, 5); // Fetch first 5 results for the dropdown
      const formattedResults = fetchedData.results.map((anime: Anime) => ({
        id: anime.id, // Make sure to include the ID field
        title: anime.title,
        image: anime.image,
        type: anime.type,
        totalEpisodes: anime.totalEpisodes,
        rating: anime.rating,
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
      // Before executing the delayed search, check if the enter key was recently pressed
      // You might set a flag when the enter key is pressed and check it here
      // For example, using a state or ref like `enterPressedRecently`
      // if (!enterPressedRecently) {
      fetchSearchResults(newValue);
      setSearch((prevState) => ({
        ...prevState,
        isDropdownOpen: true,
      }));
      // } else {
      // Optionally reset the flag here if you're using one
      // enterPressedRecently = false;
      // }
    }, 100); // Debounce for 300ms
  };

  const handleKeyDownOnInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      if (selectedIndex !== null && searchResults.length > 0) {
        // Navigate to the selected search result
        const animeId = searchResults[selectedIndex].id;
        navigate(`/watch/${animeId}`);
        handleCloseDropdown();
      } else {
        // Existing logic for handling enter without a selection
        navigateWithQuery(search.searchQuery);
      }
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      setSearch((prevState) => ({
        ...prevState,
        isDropdownOpen: false,
      }));
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  useEffect(() => {
    // This effect runs when the location.pathname changes or enter is pressed (Hide the InputContainer)
    if (isMobileView) {
      setIsInputVisible(false);
    }
  }, [location.pathname, isMobileView]);

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
  useEffect(() => {
    function handleResize() {
      setIsMobileView(window.innerWidth < 500);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <StyledNavbar ref={navbarRef}>
        <TopContainer>
          <LogoImg to="/home" onClick={() => window.scrollTo(0, 0)}>
            見るろ の 久遠
          </LogoImg>

          {/* Render InputContainer within the navbar for screens larger than 500px */}
          {!isMobileView && (
            <InputContainer isVisible={true}>
              <Icon $isFocused={search.isSearchFocused}>
                <FontAwesomeIcon icon={faSearch} />
              </Icon>
              <SearchInput
                type="text"
                placeholder="Search Anime"
                value={search.searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDownOnInput}
                onFocus={() => {
                  setSearch((prevState) => ({
                    ...prevState,
                    isDropdownOpen: true,
                    isSearchFocused: true,
                  }));
                }}
                ref={inputRef}
              />
              <DropDownSearch
                searchResults={searchResults}
                onClose={handleCloseDropdown}
                isVisible={search.isDropdownOpen}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                searchQuery={search.searchQuery}
              />
              <ClearButton
                $query={search.searchQuery}
                onClick={handleClearSearch}
              >
                <FontAwesomeIcon icon={faTimes} />
              </ClearButton>
              <SlashToggleBtn $isFocused={search.isSearchFocused}>
                <FontAwesomeIcon icon={faSlash} rotation={90} />
              </SlashToggleBtn>
            </InputContainer>
          )}
          <RightContent>
            {/* Toggle Button should only be visible in mobile view */}
            {isMobileView && (
              <InputToggleBtn
                onClick={() => setIsInputVisible((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faSearch} />
              </InputToggleBtn>
            )}
            <ThemeToggleBtn onClick={toggleTheme}>
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </ThemeToggleBtn>
          </RightContent>
        </TopContainer>
        {isMobileView && isInputVisible && (
          <InputContainer isVisible={isInputVisible}>
            <Icon $isFocused={search.isSearchFocused}>
              <FontAwesomeIcon icon={faSearch} />
            </Icon>
            <SearchInput
              type="text"
              placeholder="Search Anime"
              value={search.searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDownOnInput}
              onFocus={() => {
                setSearch((prevState) => ({
                  ...prevState,
                  isDropdownOpen: true,
                  isSearchFocused: true,
                }));
              }}
              ref={inputRef}
            />
            <DropDownSearch
              searchResults={searchResults}
              onClose={handleCloseDropdown}
              isVisible={search.isDropdownOpen}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              searchQuery={search.searchQuery}
            />
            <ClearButton
              $query={search.searchQuery}
              onClick={handleClearSearch}
            >
              <FontAwesomeIcon icon={faTimes} />
            </ClearButton>
            <SlashToggleBtn $isFocused={search.isSearchFocused}>
              <FontAwesomeIcon icon={faSlash} rotation={90} />
            </SlashToggleBtn>
          </InputContainer>
        )}
      </StyledNavbar>
      {/* Conditionally render InputContainer below the navbar for mobile view when visibility is toggled */}
    </>
  );
};

export default Navbar;
