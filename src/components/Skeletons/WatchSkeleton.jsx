import React from "react";
import styled, { keyframes } from "styled-components";

const popInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const SkeletonPulse = keyframes`
  0%, 100% {
    background-color: var(--global-primary-skeleton);
  }
  25%, 75% {
    background-color: var(--global-secondary-skeleton);
  }
  50% {
    background-color: var(--global-primary-skeleton);
  }
`;

const SkeletonContainer = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

const PlayerSkeleton = styled.div`
  background: var(--global-primary-bg);
  position: relative;
  padding-top: 56.25%; // Aspect ratio for 16:9 videos
  width: 100%;
  height: 0;
  border-radius: 0.2rem;
  animation: ${SkeletonPulse} 2.5s ease-in-out infinite,
    ${popInAnimation} 0.5s ease-out;
`;

const WatchSkeleton = () => (
  <SkeletonContainer>
    <PlayerSkeleton />
  </SkeletonContainer>
);

export default WatchSkeleton;
