import React from "react";
import styled from "styled-components";

const SearchDropdown = ({ results, isOpen }) => {
  return (
    <Dropdown isOpen={isOpen ? "true" : "false"}>
      {results.map((result, index) => (
        <SearchResult key={index}>
          <img src={result.image} alt={result.title} />
          <span>{result.title}</span>
        </SearchResult>
      ))}
    </Dropdown>
  );
};

const Dropdown = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
`;

const SearchResult = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;

  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

export default SearchDropdown;
