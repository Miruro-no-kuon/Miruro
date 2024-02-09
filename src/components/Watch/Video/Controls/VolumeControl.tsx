import React from "react";
import styled from "styled-components";
import ControlButtonComponent from "./ControlButton";
import { thumbStyle, trackStyle } from "./Timeline/Timeline";

const VolumeControlWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const VolumeControl = styled.input.attrs({ type: "range" })`
  position: relative;
  width: 5rem;
  cursor: pointer;
  transform-origin: bottom left;
  border: none;
  border-radius: 0.125rem;
  height: 0.3rem;
  transition: opacity 0.2s ease-in-out;
  background: ${({ $volume }) => `linear-gradient(
    90deg,
    #fff 0%,
    #fff ${$volume * 100}%,
    rgba(255, 255, 255, 0.5) ${$volume * 100}%,
    rgba(255, 255, 255, 0.5) 100%
  )`};

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

  @media (max-width: 500px) {
    display: none;
  }
`;

const VolumeButton = styled(ControlButtonComponent)``;

const VolumeControlComponent = ({
  volume,
  setVolume,
  isSettingsPopupVisible,
}) => (
  <VolumeControlWrapper>
    <VolumeButton
      icon={volume === 0 ? "volume_off" : "volume_up"}
      onClick={() => setVolume(volume > 0 ? 0 : 1)}
      tooltip={"Volume"}
      hideTooltip={isSettingsPopupVisible}
    />
    <VolumeControl
      $volume={volume}
      min="0"
      max="1"
      step="0.01"
      value={volume}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
    />
  </VolumeControlWrapper>
);

export default VolumeControlComponent;
