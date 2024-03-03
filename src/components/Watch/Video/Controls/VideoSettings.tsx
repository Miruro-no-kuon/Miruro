import React, { useState } from "react";
import styled from "styled-components";
import { FiSettings } from "react-icons/fi";
import { IoSpeedometerOutline } from "react-icons/io5";

const SettingsContainer = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  border-radius: var(--global-border-radius) 0.2rem 0 0;
  margin: 0.2rem 0.3rem;
  padding: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transform: translateY(${({ $isVisible }) => ($isVisible ? "0" : "10px")});
  opacity: ${({ $isVisible }) => ($isVisible ? "1" : "0")};
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
  width: 225px;
  max-height: 200px;
  overflow: auto;
  transition: ease-in-out, transform 0.1s ease-in-out, opacity 0.1s ease-in-out,
    visibility 0.1s ease-in-out;

  @media (max-width: 500px) {
    width: 93%;
    max-height: 140px;
  }
  @media (max-width: 400px) {
    width: 93%;
    max-height: 100px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding-bottom: 0.5rem;
  color: ${({ $isActive }) => ($isActive ? "#fff" : "#aaa")};
  border-bottom: ${({ $isActive }) => ($isActive ? "1px solid #fff" : "none")};
  transition: color 0.3s ease, border-bottom 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    color: #fff;
  }
`;

const ContentContainer = styled.div`
  display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
`;

const QualityOption = styled.div`
  padding: 0.35rem;
  font-size: 0.8rem;
  border-radius: var(--global-border-radius);
  color: ${({ $isSelected }) => ($isSelected ? "#fff" : "#aaa")};
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "thin")};
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &::before {
    content: "•";
    display: ${({ $isSelected }) => ($isSelected ? "inline-block" : "none")};
    margin-right: 5px;
  }
}`;

const VideoSettings = ({
  isSettingsPopupVisible,
  toggleSettingsPopup,
  qualityOptions,
  handleQualityChange,
  selectedQuality,
  playbackSpeed,
  changePlaybackSpeed,
}) => {
  const [activeTab, setActiveTab] = useState("quality");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <SettingsContainer $isVisible={isSettingsPopupVisible}>
      <TabContainer>
        <TabButton
          $isActive={activeTab === "quality"}
          onClick={() => handleTabChange("quality")}
        >
          <FiSettings size={18} />
        </TabButton>
        <TabButton
          $isActive={activeTab === "speed"}
          onClick={() => handleTabChange("speed")}
        >
          <IoSpeedometerOutline size={18} />
        </TabButton>
      </TabContainer>
      <ContentContainer $isVisible={activeTab === "quality"}>
        {qualityOptions.map((quality) => (
          <QualityOption
            key={quality}
            onClick={() => handleQualityChange(quality)}
            $isSelected={quality === selectedQuality}
          >
            {quality}
          </QualityOption>
        ))}
      </ContentContainer>
      <ContentContainer $isVisible={activeTab === "speed"}>
        <div>
          {playbackSpeedOptions.map((speed) => (
            <QualityOption
              key={speed}
              onClick={() => changePlaybackSpeed(speed)}
              $isSelected={speed === playbackSpeed}
            >
              {speed}x
            </QualityOption>
          ))}
        </div>
      </ContentContainer>
    </SettingsContainer>
  );
};

export default VideoSettings;
