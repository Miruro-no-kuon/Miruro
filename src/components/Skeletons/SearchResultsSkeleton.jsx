import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function SearchResultsSkeleton({ name }) {
  const { height, width } = useWindowDimensions();

  return (
    <Parent>
      <Heading>
        Search <span>{name === undefined ? "Search" : name}</span> Results
      </Heading>
      <FilterLine />
      <CardWrapper>
        {[...Array(50)].map((x, i) => (
          <div key={i}>
            <Skeleton
              width={width <= 600 ? "110px" : "160px"}
              height={width <= 600 ? "170px" : "235px"}
              borderRadius={width <= 600 ? "0.3rem" : "0.5rem"}
              baseColor={"#303436"}
              highlightColor={"#202225"}
            />
            <Skeleton
              width={width <= 600 ? "110px" : "160px"}
              baseColor={"#303436"}
              highlightColor={"#202225"}
              count={2}
              style={{
                marginTop: width <= 600 ? "0.5rem" : "1rem",
              }}
            />
          </div>
        ))}
      </CardWrapper>
    </Parent>
  );
}

const Heading = styled.p`
  font-size: 1.8rem;
  color: #fff;
  font-family: "Gilroy-Light", sans-serif;
  margin-bottom: 1rem;
  span {
    font-family: "Gilroy-Bold", sans-serif;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
`;

const Parent = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-gap: 1rem;
  grid-row-gap: 1.5rem;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 120px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, 110px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }
  @media screen and (max-width: 380px) {
    grid-template-columns: repeat(auto-fill, 100px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }
`;

const FilterLine = styled.hr`
  border: none;
  border-top: 43px solid #303436;
  border-radius: 0.4rem;
  margin: 1rem 0;
`;

export default SearchResultsSkeleton;
