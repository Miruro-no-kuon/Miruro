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
    transform: scale(0.9);
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

const SkeletonCard = styled.div`
  width: 100%;
  max-width: 100%;
  height: 0;
  padding-top: ${aspectRatio(184, 133)};
  background: var(--global-card-bg);
  border-radius: 0.2rem;
  margin-bottom: 2.5rem;

  ${(props) => css`
    animation: ${props.loading ? "none" : pulseAnimation && popInAnimation} 1s;
  `}
`;

const SkeletonTitle = styled.div`
  width: 80%;
  height: 1.3rem;
  background: var(--global-card-bg);
  border-radius: 0.2rem;
  margin-top: 0.5rem;
  margin-left: 0.3rem;

  ${(props) => css`
    animation: ${props.loading ? "none" : pulseAnimation && popInAnimation} 1s;
  `}
`;

const CardSkeleton = React.memo(({ loading }) => (
  <SkeletonCard loading={loading}>
    <SkeletonTitle loading={loading} />
  </SkeletonCard>
));

export default CardSkeleton;
