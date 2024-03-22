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
  font-size: 0.9rem;
  align-items: center;
  margin-top: 0.8rem;
  border-radius: var(--global-border-radius);
  background-color: var(--global-secondary-bg);

  @media (min-width: 1200px) {
    flex-direction: row;
    justify-content: center;
  }
  @media (min-width: 1000px) {
    background-color: transparent;
    flex-direction: row;
  }
`;

const Group = styled.div`
  padding: 0.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
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
  font-weight: bold;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: #505050;
  color: white;
  transition: background-color 0.3s ease;
  &.active {
    background-color: var(--primary-accent);
  }
  &:hover {
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
  margin: 0rem;
  font-weight: bold;
  @media (min-width: 1000px) {
    margin-right: 0.3rem;
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
          <DownloadLink
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDownload />
            Download
          </DownloadLink>
        </ButtonRow>
      </Group>
    </SelectorContainer>
  );
};

export default VideoSourceSelector;
