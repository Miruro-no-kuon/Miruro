import styled from "styled-components";

// Shared styles for thumb elements
export const thumbStyle = `
  width: 14px;
  height: 14px;
  cursor: pointer;
  border: none;
  transform: scale(0.25);
  opacity: 0;
  visibility: hidden;
  transition: 0.1s;
`;

// Shared styles for track elements
export const trackStyle = `
  height: 0.3rem;
  border-radius: 0.125rem;
  background: linear-gradient(
    to right,
    #fff 0%,
    #fff var(--progress-percentage, 50%),
    rgba(255, 255, 255, 0.5) var(--progress-percentage, 50%),
    rgba(255, 255, 255, 0.5) 100%
  );
  transition: 0.1s;
`;

// Timeline slider with custom styles and a class name
export const Timeline = styled.input.attrs(({ className }) => ({
  type: "range",
  className: className ? `${className} timeline-slider` : "timeline-slider",
}))`
  width: 99%;
  background: transparent;
  cursor: pointer;

  &:hover {
    &::-webkit-slider-thumb,
    &::-moz-range-thumb {
      transform: scale(1);
      opacity: 1;
      visibility: visible;
    }

    &::-webkit-slider-runnable-track,
    &::-moz-range-track {
      height: 0.5rem;
    }
  }

  &::-webkit-slider-thumb {
    ${thumbStyle}
  }

  &::-moz-range-thumb {
    ${thumbStyle}
  }

  &::-webkit-slider-runnable-track {
    ${trackStyle}
  }

  &::-moz-range-track {
    ${trackStyle}
  }
`;

export default Timeline;
