import React from "react";
import styled, { keyframes, css } from "styled-components";

// This function was declared but never used. Either remove it or use it appropriately.
// const aspectRatio = (width: number, height: number) => `calc(100% * ${width} / ${height})`;

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

interface SkeletonProps {
  loading?: boolean;
}

const SkeletonSlide = styled.div<SkeletonProps>`
  width: 100%;
  max-width: 100%;
  height: 24rem;
  background: var(--global-card-bg);
  border-radius: var(--global-border-radius);
  margin-bottom: 1rem;

  @media (max-width: 1000px) {
    height: 20rem;
  }
  @media (max-width: 500px) {
    height: 18rem;
  }

  ${({ loading }) =>
    !loading &&
    css`
      animation: ${css`
        ${pulseAnimation} 1s infinite, ${popInAnimation} 1s infinite
      `};
    `}
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: var(--global-border-radius);
`;

const CarouselSkeleton: React.FC<SkeletonProps> = ({ loading }) => (
  <SkeletonSlide loading={loading}>
    <SkeletonImage />
  </SkeletonSlide>
);

export default React.memo(CarouselSkeleton);
