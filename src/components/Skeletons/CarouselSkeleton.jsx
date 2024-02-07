import React from "react";
import styled, { keyframes, css } from "styled-components";

const aspectRatio = (width, height) => `calc(100% * ${width} / ${height})`;

const pulseAnimation = keyframes`
  0%, 100% {
    background-color: var(--global-primary-skeleton); 
  }
  50% {
    background-color: var(--global-secondary-skeleton);
  }
`;

const popInAnimation = keyframes`
  0%, 100%{
    opacity: 0;
    transform: scale(0.975);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  75% {
    opacity: 0.5;
    transform: scale(1);
  }
`;

const SkeletonSlide = styled.div`
  width: 100%;
  max-width: 100%;
  height: 24rem;
  background: var(--global-card-bg);
  border-radius: 0.2rem;
  margin-bottom: 2rem;

  @media (max-width: 1000px) {
    height: 20rem;
  }
  @media (max-width: 500px) {
    height: 18rem;
  }

  ${(props) =>
    css`
      animation: ${props.loading ? "none" : pulseAnimation && popInAnimation} 1s
        infinite;
    `}
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 100%;
  background: var(--global-card-bg);
  border-radius: 0.2rem;
`;

const CarouselSlideSkeleton = React.memo(({ loading }) => (
  <SkeletonSlide loading={loading}>
    <SkeletonImage loading={loading} />
  </SkeletonSlide>
));

export default CarouselSlideSkeleton;
