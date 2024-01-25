import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const StyledNavbar = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.25rem;
  cursor: pointer;
  text-decoration: none;
  color: var(--global-text);
  padding: 0.5rem;
  font-weight: bold;
`;

const InputContainer = styled.div`
  display: flex;
  max-width: 100%;
  height: 1rem;
  align-items: center;
  padding: 0.8rem;
  border-radius: 0.2rem;
  background-color: var(--global-input-div);
`;

const MagnifyingGlass = styled.div`
  margin-right: 10px;
  color: var(--global-text);
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0.5)};
  font-size: 0.8rem;
  transition: opacity 0.2s;
`;

const InputField = styled.input`
  background: 0;
  border: none;
  color: var(--global-text);
  display: inline-block;
  font-size: 0.9rem;
  margin-right: 10px;
  outline: 0;
  padding: 0;
  padding-top: 0;
  width: 100%;
`;

const ClearButton = styled.button`
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

const ThemeToggle = styled.button`
  background: transparent;
  border: none;
  color: var(--global-text);
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--global-text);
    opacity: 1;
  }
`;

const SlashButton = styled.button`
  background: transparent;
  border: 2px solid var(--global-text);
  border-radius: 0.2rem;
  padding: 0.3rem;
  color: var(--global-text);
  font-size: 0.5rem;
  cursor: pointer;
  opacity: ${({ $isFocused }) => ($isFocused ? 1 : 0.5)};
  margin-left: 10px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const focusNavbar = (e) => {
      if (e.key === "/" && inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        setIsFocused(true);
      } else if (e.key === "Escape" && inputRef.current) {
        inputRef.current.blur();
        setIsFocused(false);
      }
    };

    document.addEventListener("keydown", focusNavbar);
    return () => document.removeEventListener("keydown", focusNavbar);
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const navigateWithQuery = (value) => {
    navigate(value ? `/search?query=${value}` : "/search");
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    navigateWithQuery(newValue);
  };

  const handleClear = () => {
    setQuery("");
    navigateWithQuery("");
    inputRef.current.focus();
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <StyledNavbar>
      <TopContainer>
        <Logo to="/home">見るろ の 久遠</Logo>{" "}
        <ThemeToggle onClick={toggleTheme}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </ThemeToggle>
      </TopContainer>
      <InputContainer>
        <MagnifyingGlass $isFocused={isFocused}>
          <i className="fas fa-search"></i>
        </MagnifyingGlass>
        <InputField
          type="text"
          placeholder="Search Anime"
          value={query}
          onChange={handleInputChange}
          ref={inputRef}
        />
        <ClearButton $query={query} onClick={handleClear}>
          <i className="fas fa-times"></i>
        </ClearButton>
        <SlashButton $isFocused={isFocused}>
          <i className="fa-solid fa-slash fa-rotate-90"></i>
        </SlashButton>
      </InputContainer>
    </StyledNavbar>
  );
};

export default Navbar;
