import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CgFormatSlash } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { IconContext } from "react-icons";
import Search from "./Search";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function Nav() {
  // State variables
  const [isActive, setIsActive] = useState(false);
  const { height, width } = useWindowDimensions();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // Effect to listen for '/' key press and focus the search input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "/") {
        event.preventDefault(); // Prevent typing '/' in the input
        document.getElementById("searchInput").focus();
      } else if (event.key === "Escape") {
        // Handle "Esc" key press to blur the search input
        document.getElementById("searchInput").blur();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Function to handle search submission
  function searchEnter() {
    if (title !== "") {
      setIsActive(false);
      navigate("/search/" + title);
    }
  }

  return (
    <div>
      <NavBar>
        <Link to="/">
          <img
            className="logo-img"
            src="https://cdn.discordapp.com/attachments/985501610455224389/1041832015105884241/logo512.png"
            alt="Miruro"
            width="100"
          />
        </Link>

        <div className="searchBar">
          <input
            id="searchInput"
            type="text"
            required
            placeholder={"Search Anime"}
            value={title}
            autoFocus
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                searchEnter();
              }
            }}
          />
          <CgFormatSlash
            className="CgFormatSlash"
            color="rgba(255, 255, 255, 0.3)"
          />
        </div>

        <div className="nav-links">
          <Links className="nav-button-links" to="/popular">
            Popular
          </Links>
          <Links className="nav-button-links" to="/top100">
            Top 100
          </Links>
          {/* <Links className="nav-button-links" to="/forum"> */}
            {/* Forum */}
          {/* </Links> */}
          {/* <Links className="nav-button-links" to="/help"> */}
            {/* Help */}
          {/* </Links> */}
        </div>

        {width <= 900 && (
          <IconContext.Provider
            value={{
              size: "1.5rem",
              style: {
                verticalAlign: "middle",
                marginBottom: "0.2rem",
                marginRight: "0.3rem",
              },
            }}
          >
            <Button onClick={(e) => setIsActive(!isActive)}>
              <FiSearch />
            </Button>
          </IconContext.Provider>
        )}
        {width > 900 && (
          <IconContext.Provider
            value={{
              size: "1rem",
              style: {
                verticalAlign: "middle",
                marginBottom: "0.2rem",
                marginRight: "0.3rem",
              },
            }}
          ></IconContext.Provider>
        )}
      </NavBar>
      {isActive && <Search isActive={isActive} setIsActive={setIsActive} />}
      {isActive && <Shadow></Shadow>}
    </div>
  );
}

// Shadow component for overlay
const Shadow = styled.div`
  position: absolute;
  height: 100vh;
  min-height: 100%;
  max-height: 100%;
  background-size: cover;
  color: #ddd;
  text-shadow: 3px 4px #333;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 9;
`;

// Button component for search button
const Button = styled.button`
  color: #aaa;
  background-color: transparent;
  font-family: "Gilroy-Bold", sans-serif;
  font-size: 0.9rem;
  outline: none;
  border: none;
  border-radius: 0.3rem;
  padding: 0.7rem 1.6rem 0.7rem 1.6rem;
  cursor: pointer;
  overflow: hidden;
  transition: 0.2s;
  black-space: nowrap;
`;

// Styled component for navigation links
const Links = styled(Link)`
  color: rgba(158, 162, 164, 1);
  background: rgb(19, 21, 22);
  margin: 0.5rem;
  padding: 0.4rem 0.5rem 0.4rem 0.5rem;
  border-radius: 5px;
  border: 1px solid rgba(48, 52, 54, 0.3);
  font-size: 1.1rem;
  font-family: "Gilroy-Medium", sans-serif;
  text-decoration: none;
  transition: 0.3s;

  @media screen and (max-width: 600px) {
    color: #ffffff;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
  }
`;

// Styled component for the navigation bar
const NavBar = styled.nav`
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0rem 5rem 0 5rem;

  img {
    margin-top: 10px;
    border-radius: 0.4rem;
    transition: 0.3s;
  }

  img.logo-img:hover {
    transform: scale(0.9);
  }

  .searchBar {
    background: rgb(15, 17, 17);
    padding-right: 2%;
    border-radius: 0.3rem;
    margin-left: 1rem;
    border: 0.5px solid rgba(48, 52, 54, 1);

    .CgFormatSlash {
      transform: scale(1.7);
      vertical-align: text-top;
      border: 0.5px solid rgba(48, 52, 54, 1);
      border-radius: 3px;
      margin-right: 0rem;
    }

    @media only screen and (max-width: 900px) {
      display: none;
    }
  }

  input {
    background: transparent;
    color: rgb(200, 195, 188);
    placeholder: rgb(200, 195, 188);
    outline: none;
    border: none;
    border-radius: 1rem;
    padding: 12px;
    font-size: 1.1rem;
    font-family: "Gilroy-Medium", sans-serif;
    margin-right: 10px;
    margin-left: 10px;
    width: 15rem;
    transition: 0.6s;
  }

  input:focus {
    width: 18rem;
  }

  @media screen and (max-width: 600px) {
    margin: 1rem 2rem;
    margin-top: 1rem;
    img {
      height: 6rem;
      width: 100%;
    }
    .nav-links {
      display: none;
    }
  }
`;

export default Nav;
