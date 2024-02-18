import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";

const ControlButton = styled.button<{ fontSize?: string }>`
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

const TooltipText = styled.span<{
  $positionStyle: { left?: string; right?: string };
}>`
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
  margin: 0 0 0 0;
  ${({ $positionStyle }) => $positionStyle};
`;

const ControlButtonWithTooltip = styled(ControlButton)<{
  $hideTooltip?: boolean;
}>`
  &:hover ${TooltipText} {
    visibility: ${({ $hideTooltip }) => ($hideTooltip ? "hidden" : "visible")};
    opacity: ${({ $hideTooltip }) => ($hideTooltip ? 0 : 1)};
  }
`;

interface ControlButtonProps {
  onClick: () => void;
  icon: string;
  fontSize?: string;
  tooltip?: string;
  hideTooltip?: boolean;
}

const ControlButtonComponent: React.FC<ControlButtonProps> = ({
  onClick,
  icon,
  fontSize,
  tooltip,
  hideTooltip,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    left?: string;
    right?: string;
  }>({});

  const calculateTooltipPosition = useCallback(() => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const distanceToLeft = buttonRect.left;
      const distanceToRight = window.innerWidth - buttonRect.right;

      let newPosition: { left?: string; right?: string } = {};
      if (distanceToLeft < distanceToRight) {
        newPosition.left = "0";
      } else {
        newPosition.right = "0";
      }

      // Check if newPosition is different from current tooltipPosition state
      if (
        newPosition.left !== tooltipPosition.left ||
        newPosition.right !== tooltipPosition.right
      ) {
        setTooltipPosition(newPosition);
      }
    }
  }, [tooltipPosition]);

  useEffect(() => {
    calculateTooltipPosition();
    window.addEventListener("resize", calculateTooltipPosition);
    return () => {
      window.removeEventListener("resize", calculateTooltipPosition);
    };
  }, [calculateTooltipPosition]);

  return (
    <ControlButtonWithTooltip
      onClick={onClick}
      fontSize={fontSize}
      $hideTooltip={hideTooltip}
      ref={buttonRef}
    >
      <i className="material-icons">{icon}</i>
      {tooltip && (
        <TooltipText $positionStyle={tooltipPosition}>{tooltip}</TooltipText>
      )}
    </ControlButtonWithTooltip>
  );
};

export default ControlButtonComponent;
