import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface SkeletonProps {
  loading?: boolean;
}

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
const SkeletonCard = styled.div<SkeletonProps>`
  width: 100%;
  max-width: 100%;
  height: 0;
  padding-top: ${aspectRatio(184, 133)};
  background: var(--global-card-bg);
  border-radius: var(--global-border-radius);
  margin-bottom: 2.5rem;

  ${({ loading }) =>
    !loading &&
    css`
      animation: ${css`
        ${pulseAnimation} 1s infinite, ${popInAnimation} 1s infinite
      `};
    `}
`;

const SkeletonTitle = styled.div<SkeletonProps>`
  width: 80%;
  height: 1.3rem;
  background: var(--global-card-bg);
  border-radius: var(--global-border-radius);
  margin-top: 0.5rem;
  margin-left: 0.3rem;

  ${({ loading }) =>
    !loading &&
    css`
      animation: ${css`
        ${pulseAnimation} 1s infinite, ${popInAnimation} 1s infinite
      `};
    `}
`;

const CardSkeleton: React.FC<SkeletonProps> = React.memo(
  ({ loading = false }) => (
    <SkeletonCard loading={loading}>
      <SkeletonTitle loading={loading} />
    </SkeletonCard>
  ),
);

export default CardSkeleton;
