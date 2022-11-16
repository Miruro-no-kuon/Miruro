import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function WatchAnimeSkeleton() {
  const { width, height } = useWindowDimensions();

  return (
    <div>
      <Wrapper>
        <Skeleton
          height={40}
          baseColor={"#808080"}
          highlightColor={"#404040"}
          style={{
            marginBottom: "1rem",
          }}
        />
        <Skeleton
          baseColor={"#808080"}
          highlightColor={"#404040"}
          style={{
            marginBottom: "1rem",
            aspectRatio: width <= 600 ? "16 / 11" : "16 / 9",
          }}
        />
        <Skeleton
          height={40}
          baseColor={"#808080"}
          highlightColor={"#404040"}
          style={{
            marginBottom: "1rem",
          }}
        />
        <EpisodesWrapper>
          <p>Episodes</p>
          <Episodes>
            {[...Array(20)].map((x, i) => (
              <div>
                <Skeleton
                  width={width <= 600 ? "5rem" : "10rem"}
                  height={width <= 600 ? 55 : 40}
                  borderRadius={"0.5rem"}
                  baseColor={"#808080"}
                  highlightColor={"#404040"}
                />
              </div>
            ))}
          </Episodes>
        </EpisodesWrapper>
      </Wrapper>
    </div>
  );
}

const Episodes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-gap: 1rem;
  grid-row-gap: 1rem;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  }
`;

const EpisodesWrapper = styled.div`
  margin-top: 1rem;
  border: 1px solid #222;
  border-radius: 0.4rem;
  padding: 1rem;

  p {
    font-size: 1.3rem;
    text-decoration: underline;
   color: #fff;
    font-family: "Gilroy-Medium", sans-serif;
    margin-bottom: 1rem;
  }
  box-shadow: 0px 4.41109px 20.291px rgba(16, 16, 24, 0.81);
`;

const Wrapper = styled.div`
  margin: 2rem 5rem 2rem 5rem;

  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

export default WatchAnimeSkeleton;
