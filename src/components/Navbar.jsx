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

// Styled Components
const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StyledNavbar = styled.div`
  position: sticky;
  top: 0;
  text-align: center;
  margin-left: -1rem;
  margin-right: -1rem;
  padding: 0 1rem 1rem;
  background-color: ${(props) =>
    props.$isTop
      ? "transparent"
      : colors.globalPrimaryBgTr}; // Change background color based on scroll position
  backdrop-filter: blur(50px);
  transform: translateY(0);
  z-index: 4;
  width: calc(100%);
  animation: ${fadeInAnimation} 0.5s ease-out;
  transition: 0.1s ease-in-out;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  max-width: 7rem;
  padding: 0;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0.5rem 0;
  text-decoration: none;
  color: ${colors.globalText};
  content: var(--logo-text-transparent);
  cursor: pointer;
  transition: 0.2s;
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    color: #someHoverColor; // Replace with your hover color
    transform: scale(1.05);
  }
`;

const InputContainer = styled.div`
  display: flex;
  max-width: 100%;
  height: 1rem;
  align-items: center;
  padding: 0.8rem;
  border-radius: 0.2rem;
  background-color: ${colors.globalInputDiv};
`;

const Icon = styled.div`
  margin-right: 10px;
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
  margin-right: 10px;
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
  margin-left: 10px;
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

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef(null);
  const navbarRef = useRef(null);
  const delayTimeout = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(detectUserTheme());
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [isTop, setIsTop] = useState(true); // Track if the scroll position is at the top

  // Add scroll event listener to detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle Dark Mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === "/" && inputRef.current) {
      e.preventDefault();
      inputRef.current.focus();
      setIsSearchFocused(true);
    } else if (e.key === "Escape" && inputRef.current) {
      inputRef.current.blur();
      setIsSearchFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Update search query from URL
  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const navigateWithQuery = useCallback(
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
    setSearchQuery(newValue);
    navigateWithQuery(newValue, e.key === "Enter" ? 0 : 1000);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigateWithQuery("");
    inputRef.current.focus();
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <StyledNavbar ref={navbarRef} $isTop={isTop}>
      <TopContainer>
        <LogoLink to="/home">見るろ の 久遠</LogoLink>{" "}
        <ThemeToggleBtn onClick={toggleTheme}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </ThemeToggleBtn>
      </TopContainer>
      <InputContainer>
        <Icon $isFocused={isSearchFocused}>
          <i className="fas fa-search"></i>
        </Icon>
        <SearchInput
          type="text"
          placeholder="Search Anime"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleInputChange}
          ref={inputRef}
        />
        <ClearButton $query={searchQuery} onClick={handleClearSearch}>
          <i className="fas fa-times"></i>
        </ClearButton>
        <SlashToggleBtn $isFocused={isSearchFocused}>
          <i className="fa-solid fa-slash fa-rotate-90"></i>
        </SlashToggleBtn>
      </InputContainer>
    </StyledNavbar>
  );
};

export default Navbar;
