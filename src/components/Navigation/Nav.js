import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CgFormatSlash } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { IconContext } from "react-icons";
import Search from "./Search";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function Nav() {
  const [isActive, setIsActive] = useState(false);
  const { height, width } = useWindowDimensions();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  function searchEnter() {
    if (title !== "") {
      setIsActive(false);
      navigate("/search/" + title);
    }
  }

  /* const onEscape = function (action) {
    window && window.addEventListener('keydown', (e) => {
      if (e.key === "Enter") {
        action();
      };
    });
  };

  const MyComponent = () => {
    const descRef = useRef();
    onEscape(() => {
      descRef.blur();
    });
  }; */

  return (
    <div>
      <NavBar>
        <Link to="/">
          <img src="https://cdn.discordapp.com/attachments/985501610455224389/1041832015105884241/logo512.png" alt="Miruro" width="100" />
        </Link>

        <div className="searchBar">
          <input /* ref={descRef} */
            marginLeft="0"
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
            /* onEscape={() => {
              descRef.current.blur();
            }} */
          />
          <CgFormatSlash className="CgFormatSlash" color="rgba(255, 255, 255, 0.3)" />
        </div>

        <div className="nav-links">
          <Links to="/popular">Popular</Links>
          <Links to="/forum">Forum</Links>
          <Links to="/help">Help</Links>
        </div>

        {width <= 600 && (
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
        {width > 600 && (
          <IconContext.Provider
            value={{
              size: "1rem",
              style: {
                verticalAlign: "middle",
                marginBottom: "0.2rem",
                marginRight: "0.3rem",
              },
            }}
          >

            {/* <Button onClick={(e) => setIsActive(!isActive)}>
              <CgFormatSlash />Search Anything
            </Button> */}

          </IconContext.Provider>
        )}
      </NavBar>
      {isActive && <Search isActive={isActive} setIsActive={setIsActive} />}
      {isActive && <Shadow></Shadow>}
    </div>
  );
}
const Shadow = styled.div`
  position: absolute;
  height:100vh;
  min-height:100%;
  max-height:100%;
  background-size:cover;
  color:#ddd;
  text-shadow:3px 4px #333;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 9;
`;

const Button = styled.button`
  // display: none;
  color: #aaa;
  background-color: transparent;
  font-family: "Gilroy-Bold", sans-serif;
  font-size: 0.9rem;
  outline: none;
  border: none;
  border-radius: 0.3rem;
  padding: 0.7rem 1.6rem 0.7rem 1.6rem;
  cursor: pointer;
  overflow:hidden
  transition: 0.5s;
  
  CgFormatSlash {
    font-size: 1rem;
  }
  black-space: nowrap;
`;


const Links = styled(Link)`
  color: #fff;
  font-family: "Gilroy-Medium", sans-serif;
  text-decoration: none;
  margin: 1.55rem 1.55rem 1.55rem 1.55rem;
  padding: 0%;
  transition: 0.7s;

  :hover {
    color: #ccc;
  }

  @media screen and (max-width: 1000px) {
    padding: 0;
    margin: 0rem 0.7rem 0rem 0.7rem;
  }
`;

const NavBar = styled.nav`
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0rem 5rem 0 5rem;

  img {
    margin-top: 10px;
    border-radius: 0.5rem;
  }

  .searchBar {
    background: rgb(15, 17, 17);
    padding-right: 2%;
    border-radius: 10px;
    margin-left: 1rem;
    border: 0.5px solid rgba(48, 52, 54, 1);

    .CgFormatSlash {
      font-size: 1rem;
      transform: scale(1.8);
      padding: 1px;
      vertical-align: text-top;
      border: 0.5px solid rgba(48, 52, 54, 1);
      border-radius: 3px;
    }

    @media only screen and (max-width: 600px) {
      display: none;
    }
  }

  input {
    background: transparent;
    color: rgb(200, 195, 188);
    placeholder: rgb(200, 195, 188);
    outline: none;
    border: none;
    border-radius: 5px;
    padding: 14px;
    font-size: 1.1rem;
    font-family: "Gilroy-Medium", sans-serif;
    margin-right: 10px;
    margin-left: 10px;
    width: 18rem;
    transition: .5s;
    }
  }
  
  input:focus {
    width: 21rem;
  }

  @media screen and (max-width: 900px) {
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
