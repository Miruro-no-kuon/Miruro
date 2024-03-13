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
  transition: 0.1s ease-in-out;
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
  transition: 0.1s ease-in-out;
`;

// Timeline slider with custom styles and a class name
export const Timeline = styled.input.attrs(({ className }) => ({
  type: "range",
  className: className ? `${className} timeline-slider` : "timeline-slider",
}))`
  width: 99%;
  background: transparent;
  cursor: pointer;

  &:hover,
  &:focus {
    &::-webkit-slider-thumb,
    &::-moz-range-thumb {
      transform: scale(1);
      opacity: 1;
      visibility: visible;
    }

    &::-webkit-slider-runnable-track {
      height: 0.5rem; /* Increase height on hover for Chromium browsers */
    }
  }

  &::-webkit-slider-thumb {
    ${thumbStyle}
    background-color: #007bff; /* Color of thumb for Chromium browsers */
    border-radius: 50%; /* Rounded shape for thumb */
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

  /* Styles for Chromium */
  @supports (-webkit-appearance: none) and (not (overflow: -webkit-marquee)) {
    &::-webkit-slider-thumb {
      // Chromium thumb style
    }

    &::-webkit-slider-runnable-track {
      background: linear-gradient(
        to right,
        #fff 0%,
        #fff var(--progress-percentage, 50%),
        rgb(117, 117, 117) var(--progress-percentage, 50%),
        rgb(117, 117, 117) 100%
      );
    }
  }

  /* Styles for other browsers including Firefox */
  @supports not (
    (-webkit-appearance: none) and (not (overflow: -webkit-marquee))
  ) {
    &::-webkit-slider-thumb {
      // Other browser thumb style
    }

    &::-webkit-slider-runnable-track {
      // Other browser track style
    }
  }
`;

export default Timeline;
