import React from "react";
import styled, { css } from "styled-components";

// Create a reusable CSS block for common styles
const commonStyles = css`
  margin-right: 0.25rem;
  color: #fff;
  font-weight: thin;
  transition: opacity 0.2s;
  cursor: default;
`;

// Create a styled component for the wrapper with common styles
const TimeDisplayWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

// Create a styled component for TimeDisplayText with common styles
const TimeDisplayText = styled.span`
  ${commonStyles}
  opacity: 0.7;

  ${TimeDisplayWrapper}:hover & {
    opacity: 1;
  }
`;

// Create a styled component for BoldTimeDisplayText with common styles and bold font-weight
const BoldTimeDisplayText = styled.span`
  ${commonStyles}
  font-weight: bold;
  opacity: 1;
`;

const TimeDisplayComponent = ({ currentTime, duration }) => (
  <TimeDisplayWrapper>
    <BoldTimeDisplayText>{currentTime}</BoldTimeDisplayText>
    <TimeDisplayText>{duration}</TimeDisplayText>
  </TimeDisplayWrapper>
);

export default TimeDisplayComponent;
