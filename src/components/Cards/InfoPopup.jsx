import React from "react";
import styled, { keyframes } from "styled-components";
import { lighten, darken } from "polished";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTv,
  faClosedCaptioning,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

// Utility functions

const generateGradient = (color) => {
  if (!color) return null;
  const darkenedColor = darken(0, color);
  const lightenedColor = lighten(0.1, color);
  return `linear-gradient(135deg, ${darkenedColor}, ${lightenedColor})`;
};

const calculateTextColor = (bgColor) => {
  if (!bgColor) return null;
  const luminance = bgColor ? parseInt(bgColor.slice(1), 16) : 0;
  const mid = 0 * 65793;
  return luminance > mid
    ? "var(--global-text-dark)"
    : "var(--global-text-light)";
};

// Keyframes for animation

const popInAnimation = keyframes`
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled components

const InfoPopup = styled.div`
  padding: 0.8rem;
  animation: ${popInAnimation} 0.3s ease forwards;
  pointer-events: none;
  cursor: pointer;
  position: absolute;
  top: 0;
  bottom: 0;
  ${({ $isPositionedLeft }) => ($isPositionedLeft ? "left" : "right")}: 104%;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  border-radius: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  background-image: url("${(props) => props.$cover}");
  background-position: center;
  box-shadow: 0.3125rem 0.3125rem 0.625rem var(--global-card-shadow);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: -1;
  }
`;

const PopUpContent = styled.div`
  .title-div {
    font-weight: bold;
    font-size: 1rem;
    display: flex;
    align-items: center;
    color: #e8e8e8;
  }

  p {
    font-size: 0.65rem;
    font-weight: bold;
    color: #e8e8e8;
    align-items: center;
    line-height: 1.7;
  }

  .separator-span {
    font-weight: normal;
    margin: 0 0.2rem;
  }

  .icon {
    margin-right: 0.2rem;
  }
`;

const GenreButton = styled.div`
  display: inline-block;
  background: ${(props) =>
    generateGradient(props.color) || "var(--global-genre-button-bg)"};
  padding: 0.25rem 0.3rem;
  border-radius: 0.2rem;
  font-weight: bold;
  margin-right: 0.25rem;
  font-size: 0.6rem;
  transition: color 0.2s;
  color: ${(props) => {
    const textColor = calculateTextColor(props.color);
    return textColor
      ? textColor === "var(--global-text-dark)"
        ? darken(0.35, props.color)
        : lighten(0.35, props.color)
      : "var(--genre-button-color)";
  }};
}`;

// Function to strip HTML tags
const stripHtmlTags = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

// InfoPopupContent component

const InfoPopupContent = React.memo(
  ({
    title,
    description,
    genres,
    $isPositionedLeft,
    color,
    type,
    status,
    totalEpisodes,
    releaseDate,
    cover,
    maxDescriptionLength,
  }) => {
    const strippedDescription = stripHtmlTags(description);

    const limitedGenres = genres.slice(0, 3);
    const truncatedDescription =
      strippedDescription?.length > maxDescriptionLength
        ? `${strippedDescription.slice(0, maxDescriptionLength)}...`
        : strippedDescription;

    const uppercaseStatus = status?.toUpperCase() || "";

    const iconMap = {
      faTv: <FontAwesomeIcon icon={faTv} className="icon" />,
      faClosedCaptioning: (
        <FontAwesomeIcon icon={faClosedCaptioning} className="icon" />
      ),
      faCalendarAlt: <FontAwesomeIcon icon={faCalendarAlt} className="icon" />,
    };

    return (
      <InfoPopup
        $isPositionedLeft={$isPositionedLeft}
        color={color}
        $cover={cover}
      >
        <PopUpContent color={color}>
          <div className="title-div">{title}</div>
          {type && totalEpisodes && status && (
            <p>
              {iconMap.faTv}
              {type} <span className="separator-span"> | </span>
              {iconMap.faClosedCaptioning}
              {totalEpisodes} <span className="separator-span"> | </span>
              {uppercaseStatus} <span className="separator-span"> | </span>
              {iconMap.faCalendarAlt}
              {releaseDate}
            </p>
          )}
          {truncatedDescription && <p>{truncatedDescription}</p>}
          <div>
            {limitedGenres.map((genre, index) => (
              <GenreButton key={index} color={color}>
                {genre}
              </GenreButton>
            ))}
          </div>
        </PopUpContent>
      </InfoPopup>
    );
  }
);

export default InfoPopupContent;
