import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTv,
  faClosedCaptioning,
  faStar,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

interface ImageDisplayProps {
  imageSrc: string;
  altText?: string;
  type?: string;
  totalEpisodes?: number;
  rating?: number;
  color?: string;
  $ishovered?: boolean;
}

const popInAnimation = keyframes`
  0% {
    opacity: 0.4;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const AnimeImage = styled.div<{
  $ishovered?: boolean;
  color?: string;
}>`
  position: relative;
  text-align: left;
  overflow: hidden;
  border-radius: var(--global-border-radius);
  padding-top: calc(100% * 184 / 133);
  background: var(--global-card-bg);
  box-shadow: 2px 2px 10px var(--global-card-shadow);
  transition: background-color 0.2s ease-in-out;
  animation: ${popInAnimation} 0.2s ease forwards;

  &:hover {
    background: ${({ $ishovered, color }) =>
      $ishovered ? color : "var(--global-card-bg)"};
  }
`;

const PlayIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--global-border-radius);
    font-weight: bold;
    font-size: 12px;
    transition: 0.3s ease-in;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4); // Dark filter
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  &:hover ${PlayIcon} {
    opacity: 1;
  }
`;

const InfoButtons = styled.div<{ $ishovered?: boolean }>`
  position: absolute;
  bottom: 7px;
  left: 7px;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
`;

const Button = styled.span<{ $ishovered?: boolean; color?: string }>`
  background-color: var(--global-button-shadow);
  backdrop-filter: blur(10px);
  padding: 4px;
  margin: 0;
  border-radius: var(--global-border-radius);
  font-size: 0.7rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.1s;

  &:hover {
    color: ${({ $ishovered, color }) =>
      $ishovered ? color : "var(--global-button-text)"};
  }
  @media (max-width: 1000px) {
    font-size: 0.6rem;
  }
  @media (max-width: 500px) {
    font-size: 0.5rem;
    gap: 0px;
    padding: 3px;
  }
`;

const Icon = styled.span<{ $ishovered?: boolean; color?: string }>`
  color: ${({ $ishovered, color }) =>
    $ishovered ? color : "var(--global-button-text)"};
  transition: color 0.2s;
`;

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageSrc,
  altText,
  type,
  totalEpisodes,
  rating,
  color,
  $ishovered = false,
}) => (
  <AnimeImage $ishovered={$ishovered} color={color}>
    <ImageWrapper>
      <img src={imageSrc} alt={altText} />
      <PlayIcon icon={faPlay} />
    </ImageWrapper>
    <InfoButtons $ishovered={$ishovered}>
      <Button $ishovered={$ishovered} color={color}>
        <Icon $ishovered={$ishovered} color="#FF8A8A">
          <FontAwesomeIcon icon={faTv} />
        </Icon>
        {type || "N/A"}
      </Button>
      <Button $ishovered={$ishovered} color={color}>
        <Icon $ishovered={$ishovered} color="#89CFF0">
          <FontAwesomeIcon icon={faClosedCaptioning} />
        </Icon>
        {totalEpisodes || "N/A"}
      </Button>
      <Button $ishovered={$ishovered} color={color}>
        <Icon $ishovered={$ishovered} color="#FFBF00">
          <FontAwesomeIcon icon={faStar} />
        </Icon>
        {rating || "N/A"}
      </Button>
    </InfoButtons>
  </AnimeImage>
);

export default ImageDisplay;
