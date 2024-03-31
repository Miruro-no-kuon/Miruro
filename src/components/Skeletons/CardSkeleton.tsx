import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const aspectRatio = (width: number, height: number): string =>
  `calc(100% * ${width} / ${height})`;

const pulseAnimation = keyframes`
  0%, 100% {
    background-color: var(--global-primary-skeleton); 
  }
  50% {
    background-color: var(--global-secondary-skeleton);
  }
`;

const popInAnimation = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0.95);
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

// Update your styled components to use the css helper for animations
const SkeletonCard = styled.div`
  width: 100%;
  max-width: 100%;
  height: 0;
  padding-top: ${aspectRatio(184, 133)};
  background: var(--global-card-bg);
  border-radius: var(--global-border-radius);
  margin-bottom: 5.25rem;

  animation: ${css`
    ${pulseAnimation} 1s infinite, ${popInAnimation} 1s infinite
  `};
`;

const SkeletonTitle = styled.div`
  
  height: 1.3rem;
  background: var(--global-card-bg);
  border-radius: var(--global-border-radius);
  margin-top: 0.5rem;
  margin-left: 0.3rem;

  animation: ${css`
    ${pulseAnimation} 1s infinite, ${popInAnimation} 1s infinite
  `};
`;

const SkeletonDetails = styled.div`
  width: 80%;
  height: 1.2rem;
  background: var(--global-card-bg);
  border-radius: var(--global-border-radius);
  margin-top: 0.5rem;
  margin-left: 0.3rem;

  animation: ${css`
    ${pulseAnimation} 1s infinite, ${popInAnimation} 1s infinite
  `};
`;

const CardSkeleton: React.FC = React.memo(() => (
  <SkeletonCard>
    <SkeletonTitle />
    <SkeletonDetails />
    <SkeletonDetails />
  </SkeletonCard>
));

export default CardSkeleton;
