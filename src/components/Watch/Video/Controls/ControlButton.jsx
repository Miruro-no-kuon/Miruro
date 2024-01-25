import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

const ControlButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  transition: background-color 0.2s, color 0.2s;
  padding: 0.25rem;
  margin: 0 0.25rem;
  font-size: ${(props) => props.fontSize || "1.6rem"};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 1);
  }

  .material-icons {
    font-size: inherit;
  }
`;

const TooltipText = styled.span`
  background-color: #ffffff;
  color: #000000;
  text-align: center;
  border-radius: 0.2rem;
  padding: 5px 10px;
  position: absolute;
  z-index: 0;
  font-size: 0.75rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  bottom: 3.4rem;
  ${({ $position }) => $position};
`;

const ControlButtonWithTooltip = styled(ControlButton)`
  &:hover ${TooltipText} {
    visibility: ${({ $hideTooltip }) => ($hideTooltip ? "hidden" : "visible")};
    opacity: ${({ $hideTooltip }) => ($hideTooltip ? 0 : 1)};
  }
`;

const ControlButtonComponent = ({
  onClick,
  icon,
  fontSize,
  tooltip,
  hideTooltip,
}) => {
  const buttonRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({});

  useEffect(() => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const screenWidth = document.documentElement.clientWidth;
    const threshold = 50; // Adjust this threshold value as needed

    if (buttonRect.left < threshold) {
      setTooltipPosition({ left: "0" });
    } else if (screenWidth - buttonRect.right < threshold) {
      setTooltipPosition({ right: "0" });
    } else {
      setTooltipPosition({});
    }
  }, []);

  return (
    <ControlButtonWithTooltip
      onClick={onClick}
      fontSize={fontSize}
      $hideTooltip={hideTooltip}
      ref={buttonRef}
    >
      <i className="material-icons">{icon}</i>
      {tooltip && (
        <TooltipText $position={tooltipPosition}>{tooltip}</TooltipText>
      )}
    </ControlButtonWithTooltip>
  );
};

export default ControlButtonComponent;
