import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CgFormatSlash } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { IconContext } from "react-icons";
import Search from "./Search";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function Nav() {
  // State variables
  const [isActive, setIsActive] = useState(false); // To control the search bar's visibility
  const { height, width } = useWindowDimensions(); // Get the window dimensions
  const [title, setTitle] = useState(""); // To store the search query
  const navigate = useNavigate(); // For navigating to different routes

  // Effect to listen for '/' key press and focus the search input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "/") {
        event.preventDefault(); // Prevent typing '/' in the input
        document.getElementById("searchInput").focus(); // Focus the search input
      } else if (event.key === "Escape") {
        // Handle "Esc" key press to blur the search input
        document.getElementById("searchInput").blur(); // Blur the search input
      }
    };

    document.addEventListener("keydown", handleKeyPress); // Add event listener

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Function to handle search submission
  function searchEnter() {
    if (title !== "") {
      setIsActive(false); // Hide the search bar
      navigate("/search/" + title); // Navigate to the search results page
    }
  }

  // Determine the number of links to display based on screen width
  let numLinksToShow = 5; // Default number of links to show

  if (width <= 650) {
    numLinksToShow = 1; // For screens less than or equal to 650px, show 1 link
  } else if (width <= 768) {
    numLinksToShow = 2; // For screens less than or equal to 768px, show 2 links
  } else if (width <= 820) {
    numLinksToShow = 3; // For screens less than or equal to 820px, show 3 links
  } else if (width <= 900) {
    numLinksToShow = 5; // For screens less than or equal to 900px, show 5 links
  } else if (width <= 1024) {
    numLinksToShow = 3; // For screens less than or equal to 1024px, show 3 links
  }

  // Define the data for the navigation links
  const linksData = [
    { to: "/popular", label: "Popular" },
    { to: "/top100", label: "Top 100" },
    { to: "/trending", label: "Trending" },
    { to: "/forum", label: "Forum" },
    { to: "/help", label: "Help" },
  ];

  // Slice the links data to display only the allowed number of links
  const displayedLinks = linksData.slice(0, numLinksToShow);

  return (
    <div>
      <NavBar>
        <Link to="/">
          <img
            className="logo-img"
            src="/src/assets/logo-tr.png"
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
              setTitle(e.target.value); // Update the search query
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                searchEnter(); // Trigger search on Enter key press
              }
            }}
          />
          <CgFormatSlash
            className="CgFormatSlash"
            color="rgba(255, 255, 255, 0.3)"
          />
        </div>

        <div className="nav-links">
          {displayedLinks.map((link, index) => (
            <Links key={index} to={link.to} className="nav-button-links">
              {link.label}
            </Links>
          ))}
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
            <Button onClick={() => setIsActive(!isActive)}>
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
  padding: 0.7rem 1.6rem;
  cursor: pointer;
  transition: 0.2s;
`;

// Styled component for navigation links
const Links = styled(Link)`
  color: rgba(158, 162, 164, 1);
  background: rgb(19, 21, 22);
  margin: 0.5rem;
  padding: 0.4rem 0.5rem;
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
}
`;

// Styled component for the navigation bar
const NavBar = styled.nav`
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 5rem;

  img {
    margin-top: 10px;
    border-radius: 0.4rem;
    transition: 0.3s;

    &.logo-img:hover {
      transform: scale(0.9);
    }
  }

  .searchBar {
    background: rgb(15, 17, 17);
    padding-right: 20px;
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

    @media only screen and (max-width: 901px) {
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
    margin: 0 10px;
    width: 15rem;
    transition: 0.6s;

    &:focus {
      width: 18rem;
    }
  }

  @media screen and (max-width: 600px) {
    margin: 1rem 2rem;

    img {
      height: 6rem;
      width: 100%;
    }

    .nav-links {
      display: none;
    }
  }
}
`;

export default Nav;
