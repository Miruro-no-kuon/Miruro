import React from "react";
import styled from "styled-components";

// Props interface
interface VideoSourceSelectorProps {
  sourceType: string; // 'regular' or 'embedded'
  setSourceType: (sourceType: string) => void;
  language: string; // 'sub' or 'dub'
  setLanguage: (language: string) => void;
  downloadLink: string; // Adjusted for sub
}

// Styled components
const SelectorContainer = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: left;

  p {
    line-height: 0.2rem;
  }
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const SourcesGroup = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 1000px) {
    display: block;

  }
`;

const LanguageGroup = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 1000px) {
    display: block;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: #505050;
  color: white;
  margin:.3rem;
  transition: background-color 0.3s ease;
  outline: none;
  &:hover {
    background-color: var(--primary-accent);
  }
  &.active {
    background-color: var(
      --primary-accent-bg
    ); // Adjust according to your theme
  }

`;

const DownloadLink = styled.a`
  padding: 0.5rem 1rem;
  border: none;
  text-align: center; /* Center align text */
  border-radius: var(--global-border-radius);
  cursor: pointer;
  margin:.3rem;
  background-color: #505050;
  color: white;
  text-decoration: none; // Removes underline from links
  transition: background-color 0.3s ease;
  outline: none;
  &:hover {
    background-color: var(--primary-accent);
  }

`;

const VideoSourceSelector: React.FC<VideoSourceSelectorProps> = ({
  sourceType,
  setSourceType,
  language,
  setLanguage,
  downloadLink,
}) => {
  return (
    <SelectorContainer>
      {/* Source Type Selection */}
      <SourcesGroup>
        <p>Sources </p>
        <Button
          className={sourceType === "regular" ? "active" : ""}
          onClick={() => setSourceType("regular")}
        >
          Default
        </Button>
        <Button
          className={sourceType === "embedded" ? "active" : ""}
          onClick={() => setSourceType("embedded")}
        >
          Embedded
        </Button>
      </SourcesGroup>
      {/* Language Selection */}
      <LanguageGroup>
        <p>Language </p>
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
      </LanguageGroup>
      <DownloadLink 
        href={downloadLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Episode
      </DownloadLink>
    </SelectorContainer>
  );
};

export default VideoSourceSelector;
