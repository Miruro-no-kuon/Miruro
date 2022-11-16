import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function AnimeDetailsSkeleton() {
  const { width, height } = useWindowDimensions();

  return (
    <Content>
      <Skeleton
        height={width <= 600 ? "13rem" : "20rem"}
        baseColor={"#808080"}
        highlightColor={"#404040"}
        style={{
          borderRadius: "0.7rem",
          marginBottom: width <= 600 ? "1rem" : "2rem",
        }}
      />
      <ContentWrapper>
        <Skeleton
          baseColor={"#808080"}
          highlightColor={"#404040"}
          count={7}
          style={{
            marginBottom: "1rem",
          }}
        />
      </ContentWrapper>
    </Content>
  );
}

const ContentWrapper = styled.div`
  padding: 0 3rem 0 3rem;
  @media screen and (max-width: 600px) {
    padding: 1rem;
  }
`;

const Content = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  position: relative;
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

export default AnimeDetailsSkeleton;
