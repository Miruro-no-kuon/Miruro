import React from "react";
import styled from "styled-components";

// Props interface to define the types of props the component expects
interface VideoSourceSelectorProps {
  sourceType: string; // 'regular' or 'embedded'
  setSourceType: (sourceType: string) => void;
  language: string; // 'sub' or 'dub'
  setLanguage: (language: string) => void;
}

// Styled components for the selector
const SelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #505050;
  color: white;
  &:hover {
    opacity: 0.8;
  }
  &.active {
    /* background-color: var(
      --highlight-color
    ); // Define this color in your theme or directly here */
    background-color: var(--primary-accent-bg);
  }
`;

const VideoSourceSelector: React.FC<VideoSourceSelectorProps> = ({
  sourceType,
  setSourceType,
  language,
  setLanguage,
}) => {
  return (
    <SelectorContainer>
      {/* Source Type Selection */}
      <Button
        className={sourceType === "regular" ? "active" : ""}
        onClick={() => setSourceType("regular")}
      >
        Regular
      </Button>
      <Button
        className={sourceType === "embedded" ? "active" : ""}
        onClick={() => setSourceType("embedded")}
      >
        Embedded
      </Button>
      {/* Language Selection */}
      <Button
        className={language === "sub" ? "active" : ""}
        onClick={() => setLanguage("sub")}
      >
        Sub
      </Button>
      <Button
        className={language === "dub" ? "active" : ""}
        onClick={() => setLanguage("dub")}
      >
        Dub
      </Button>
    </SelectorContainer>
  );
};

export default VideoSourceSelector;
