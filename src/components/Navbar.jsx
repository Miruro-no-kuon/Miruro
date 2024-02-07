import React, { useRef, useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const colors = {
  globalPrimaryBgTr: "var(--global-primary-bg-tr)",
  globalText: "var(--global-text)",
  globalInputDiv: "var(--global-input-div)",
};

const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StyledNavbar = styled.div`
  position: sticky;
  top: 0;
  height: 3.5rem;
  text-align: center;
  margin-left: -2rem;
  margin-right: -2rem;
  padding: 0.25rem 2rem;
  background-color: ${colors.globalPrimaryBgTr};
  // backdrop-filter: blur(50px);
  transform: translateY(0);
  z-index: 4;
  width: calc(100%);
  animation: ${fadeInAnimation} 0.5s ease-out;
  transition: 0.1s ease-in-out;

  @media (max-width: 768px) {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    padding: 0.25rem 0.5rem;
  }
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.2s ease;
`;

const LogoLink = styled(Link)`
  max-width: 7rem;
  padding: 0;
  font-size: 1.25rem;
  font-weight: bold;
  margin-right: 1rem;
  padding: 0.5rem 0;
  text-decoration: none;
  color: ${colors.globalText};
  content: var(--logo-text-transparent);
  cursor: pointer;
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    color: #someHoverColor; // Replace with your hover color
    transform: scale(1.05);
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex: 1; // Take up remaining space next to the logo
  max-width: 40%;
  height: 1rem;
  border: 1px solid var(--global-input-border);
  align-items: center;
  padding: 0.8rem;
  border-radius: 0.2rem;
  background-color: ${colors.globalInputDiv};

  @media (min-width: 1000px) {
    min-width: 25rem;
  }
`;

const Icon = styled.div`
  margin-right: 0.7rem;
  color: ${colors.globalText};
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0.5)};
  font-size: ${({ $fontSize }) => $fontSize || "0.8rem"};
  transition: opacity 0.2s;
`;

const SearchInput = styled.input`
  background: 0;
  border: none;
  color: ${colors.globalText};
  display: inline-block;
  font-size: 0.9rem;
  outline: 0;
  padding: 0;
  padding-top: 0;
  width: 100%;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.globalText};
  font-size: 1.1rem;
  cursor: pointer;
  opacity: ${({ $query }) => ($query ? 0.5 : 0)};
  visibility: ${({ $query }) => ($query ? "visible" : "hidden")};
  transition: color 0.2s, opacity 0.2s;

  &:hover {
    color: ${colors.globalText};
    opacity: 1;
  }
`;

const ThemeToggleBtn = styled.button`
  background: transparent;
  border: none;
  color: ${colors.globalText};
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  transition: color 0.2s ease-in-out, transform 0.1s ease-in-out;

  &:hover {
    transform: rotate(-45deg);
  }
`;

const SlashToggleBtn = styled.button`
  background: transparent;
  border: 2px solid ${colors.globalText};
  border-radius: 0.2rem;
  padding: 0.3rem;
  color: ${colors.globalText};
  font-size: 0.5rem;
  cursor: pointer;
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0.5)};
  margin-left: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
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

const saveThemePreference = (isDarkMode) => {
  localStorage.setItem("themePreference", isDarkMode ? "dark" : "light");
};

const getInitialThemePreference = () => {
  const storedThemePreference = localStorage.getItem("themePreference");

  if (storedThemePreference) {
    return storedThemePreference === "dark";
  }

  return detectUserTheme();
};

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef(null);
  const navbarRef = useRef(null);
  const delayTimeout = useRef(null);

  const [search, setSearch] = useState({
    isSearchFocused: false,
    searchQuery: searchParams.get("query") || "",
  });

  const [isTop, setIsTop] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(getInitialThemePreference());

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "/" && inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        setSearch({ ...search, isSearchFocused: true });
      } else if (e.key === "Escape" && inputRef.current) {
        inputRef.current.blur();
        setSearch({ ...search, isSearchFocused: false });
      } else if (e.shiftKey && e.key === "D") {
        // Listening for Shift + D
        e.preventDefault();
        toggleTheme();
      }
    },
    [search, isDarkMode]
  ); // Adding isDarkMode as a dependency

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setSearch({ ...search, searchQuery: searchParams.get("query") || "" });
  }, [searchParams]);

  //? AUTOMATIC LOAD ON QUERY CHANGE FOR PREVIEWS LOGIC
  /*const navigateWithQuery = useCallback(
    (value, delay = 1000) => {
      clearTimeout(delayTimeout.current);
      delayTimeout.current = setTimeout(() => {
        navigate(value ? `/search?query=${value}` : "/search");
      }, delay);
    },
    [navigate]
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearch({ ...search, searchQuery: newValue });
    navigateWithQuery(newValue, e.key === "Enter" ? 0 : 1000);
  }; */

  const navigateWithQuery = useCallback(
    (value) => {
      navigate(value ? `/search?query=${value}` : "/search");
    },
    [navigate]
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearch({ ...search, searchQuery: newValue });

    // Only navigate when 'Enter' is pressed
    if (e.key === "Enter") {
      navigateWithQuery(newValue);
    }
  };

  const handleClearSearch = () => {
    setSearch({ ...search, searchQuery: "" });
    navigateWithQuery("");
    inputRef.current.focus();
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    saveThemePreference(newIsDarkMode);
  };

  return (
    <StyledNavbar ref={navbarRef} $isTop={isTop}>
      <TopContainer>
        <LogoLink to="/home">見るろ の 久遠</LogoLink>
        <InputContainer>
          <Icon $isFocused={search.isSearchFocused}>
            <i className="fas fa-search"></i>
          </Icon>
          <SearchInput
            type="text"
            placeholder="Search Anime"
            value={search.searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleInputChange}
            ref={inputRef}
          />
          <ClearButton $query={search.searchQuery} onClick={handleClearSearch}>
            <i className="fas fa-times"></i>
          </ClearButton>
          <SlashToggleBtn $isFocused={search.isSearchFocused}>
            <i className="fa-solid fa-slash fa-rotate-90"></i>
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
