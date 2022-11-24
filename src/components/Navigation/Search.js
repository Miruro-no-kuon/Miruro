import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import { IconContext } from "react-icons";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function Search({ isActive, setIsActive }) {
  const [title, setTitle] = useState("");
  const { width, height } = useWindowDimensions();
  const navigate = useNavigate();

  function searchEnter() {
    if (title !== "") {
      setIsActive(false);
      navigate("/search/" + title);
    }
  }

  function closeEscape() {
    setIsActive(false);
  }

  function Keypress(event) {

    if (event.key === "") {
      searchEnter();
    }
  }

  window.addEventListener('keypress', Keypress);

  return (
    <Wrapper>
      <CloseButton>
        <IconContext.Provider
          value={{
            size: "1.5rem",
            color: "#23272A",
            style: {
              verticalAlign: "middle",
              marginBottom: "0.1rem",
              marginRight: "0.3rem",
            },
          }}
        >
          <button onClick={(e) => setIsActive(false)}>
            <CgClose />
          </button>
        </IconContext.Provider>
      </CloseButton>
      <Content>
        <div className="main">
          <div>
            {width <= 600 && (
              <IconContext.Provider
                value={{
                  size: "1.5rem",
                  color: "#C5C5C5",
                  style: {
                    verticalAlign: "middle",
                    marginBottom: "0.1rem",
                    marginRight: "0.3rem",
                  },
                }}
              >
                <FiSearch />
              </IconContext.Provider>
            )}
            {width > 600 && (
              <IconContext.Provider
                value={{
                  size: "1.5rem",
                  color: "#C5C5C5",
                  style: {
                    verticalAlign: "middle",
                    marginBottom: "0.1rem",
                    marginRight: "0.3rem",
                  },
                }}
              >
                <FiSearch />
              </IconContext.Provider>
            )}

            <input
              type="text"
              required
              placeholder={"Search Anything"}
              value={title}
              autoFocus
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  searchEnter();
                }

                if (event.key == "Escape") {
                  closeEscape();
                }
              }}
            />

          </div>
          {title !== "" && (
            <SearchButton
              to={"/search/" + title}
              onClick={(e) => {
                setIsActive(false);
              }}
            >
              <a>SEARCH</a>
            </SearchButton>
          )}
          {title === "" && <button>SEARCH</button>}
        </div>
      </Content>
    </Wrapper>
  );
}

const Content = styled.div`
  background-color: #111;
  padding: 0rem 4rem 3.8rem 4rem;
  border-radius: 0.5rem;

  .main {
    background-color: #111;
    padding: 0.5rem;
   color: #fff;
    padding-left: 1.2rem;
    padding-right: 0.8rem;
    border-radius: 0.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  div {
    display: flex;
    align-items: center;
    width: 100%;
  }

  input {
    background: rgba(0, 0, 0, 0.1);
    color: #ccc;
    outline: none;
    border: none;
    border-radius: 5px;
    padding: 14px;
    font-size: 1.1rem;
    font-family: "Gilroy-Medium", sans-serif;
    margin-right: 10px;
    margin-left: 10px;
    width: 80%;
    transition: 1s;
  }

  input:focus {
    width: 95%;
  }

  ::placeholder {
    color: #000;
    background: #444;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;

    .main {
      flex-direction: column;
      background-color: transparent;
      padding: 0;
      padding-left: 0;
      padding-right: 0;
    }

    div {
      background-color: #23272A;
     color: #fff;
      padding: 0.3rem 1rem;
      border-radius: 0.3rem;
      width: 100%;
      margin-bottom: 1rem;
    }
  }

  button {
    outline: none;
    border: none;
    background-color: #23272A;
    color: #aaa;
    font-size: 1rem;
    padding: 0.9rem 2rem;
    text-decoration: none;
    border-radius: 0.3rem;
    text-align: center;
    font-family: "Gilroy-Bold", sans-serif;
    cursor: pointer;
    transform: scale(0.95);
    transition: 0.3s;

    @media screen and (max-width: 600px) {
      display: block;
      width: 100%;
      font-size: 1.2rem;
    }
  }

  button:hover {
    transform: scale(1);
  }
`;

const CloseButton = styled.div`
  display: flex;
  color: #fff;
  background: #111;
  justify-content: flex-end;

  button {
    background-color: transparent;
    outline: none;
    border: none;
    padding: 1rem;
    cursor: pointer;
  }
`;

const SearchButton = styled(Link)`
  background-color: #23272A;
  color: #23272a;
  padding: 0.9rem 2rem;
  text-decoration: none;
  border-radius: 0.3rem;
  text-align: center;
  font-family: "Gilroy-Bold", sans-serif;

  @media screen and (max-width: 600px) {
    display: block;
    width: 100%;
    font/search/ddddhttp://localhost:3000/search/dddd-size: 1.2rem;
  }

  a {
    color: #aaa;
    width: 100%;
    transition: 0.3s;
  }
`;

const Wrapper = styled.div`
  background-color: #111;
  position: absolute;
  z-index: 10;
  top: 30%;
  left: 50%;
  width: 80%;
  border: 1px solid rgb(35, 39, 42);
  border-radius: 0.5rem;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 600px) {
    width: 93%;
  }
`;

export default Search;
