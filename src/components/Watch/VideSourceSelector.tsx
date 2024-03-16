import React from "react";
import styled from "styled-components";
import { FaDownload } from "react-icons/fa";

// Props interface
interface VideoSourceSelectorProps {
  sourceType: string;
  setSourceType: (sourceType: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  downloadLink: string;
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 1rem;

  @media (min-width: 1000px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 1000px) {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: #505050;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-accent);
  }
  &.active {
    background-color: var(--primary-accent-bg);
  }
`;

const DownloadLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: #505050;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;

  svg {
    margin-right: 0.5rem;
  }

  &:hover {
    background-color: var(--primary-accent);
  }
`;

const Label = styled.p`
  margin: 0;
  font-weight: bold;
  @media (min-width: 1000px) {
    margin-right: 0.5rem;
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
      <Group>
        <Label>Servers</Label>
        <ButtonRow>
          <Button
            className={sourceType === "default" ? "active" : ""}
            onClick={() => setSourceType("default")}
          >
            Default
          </Button>
          <Button
            className={sourceType === "vidstreaming" ? "active" : ""}
            onClick={() => setSourceType("vidstreaming")}
          >
            Vidstreaming
          </Button>
          <Button
            className={sourceType === "gogo" ? "active" : ""}
            onClick={() => setSourceType("gogo")}
          >
            Gogo
          </Button>
        </ButtonRow>
      </Group>
      <Group>
        <Label>Languages</Label>
        <ButtonRow>
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
          <DownloadLink href={downloadLink} target="_blank" rel="noopener noreferrer">
            <FaDownload />
            Download
          </DownloadLink>
        </ButtonRow>
      </Group>
    </SelectorContainer>
  );
};

export default VideoSourceSelector;
