import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FaMicrophone,
  FaClosedCaptioning,
  FaBell,
  FaDownload,
  FaShare,
} from 'react-icons/fa';

// Props interface
interface MediaSourceProps {
  sourceType: string;
  setSourceType: (sourceType: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  downloadLink: string;
  episodeId?: string;
  airingTime?: string;
  nextEpisodenumber?: string;
}

// Adjust the Container for responsive layout
const UpdatedContainer = styled.div`
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const Table = styled.table`
  font-size: 0.9rem;
  border-collapse: collapse;
  font-weight: bold;
  margin-left: auto;
  margin-right: auto;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  padding: 0.35rem;
  @media (max-width: 500px) {
    text-align: center;
    font-size: 0.8rem;
  }
  svg {
    margin-bottom: -0.1rem;
    @media (max-width: 500px) {
      margin-bottom: 0rem;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 90px; // Or a specific pixel width, if preferred
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const ButtonBase = styled.button`
  flex: 1; // Make the button expand to fill the wrapper
  padding: 0.5rem;
  border: none;
  font-weight: bold;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: var(--global-div);
  color: var(--global-text);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease-in-out;
  text-align: center;

  &:hover {
    background-color: var(--primary-accent);
    transform: scale(1.025);
  }
  &:active {
    transform: scale(0.975);
  }
`;

const Button = styled(ButtonBase)`
  &.active {
    background-color: var(--primary-accent);
  }
`;

const DownloadLink = styled.a`
  display: inline-flex; // Use inline-flex to easily center the icon
  align-items: center; // Align the icon vertically center
  margin-left: 0.5rem;
  padding: 0.5rem;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: var(--global-div);
  color: var(--global-text);
  text-align: center;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease-in-out;

  svg {
    font-size: 0.85rem; // Adjust icon size
  }

  &:hover {
    background-color: var(--primary-accent);
    transform: scale(1.025);
  }
  &:active {
    transform: scale(0.975);
  }
`;

const ShareButton = styled(ButtonBase)`
  display: inline-flex; // Align items in a row
  align-items: center; // Center items vertically
  margin-left: 0.5rem;
  padding: 0.5rem;
  gap: 0.25rem;
  font-size: 0.9rem;
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: var(--global-div);
  color: var(--global-text);
  text-decoration: none;
  svg {
    font-size: 0.85rem; // Adjust icon size
  }
`;

const ResponsiveTableContainer = styled.div`
  background-color: var(--global-div-tr);
  padding: 0.75rem;
  border-radius: var(--global-border-radius);
  @media (max-width: 500px) {
    display: block;
  }
`;

const EpisodeInfoColumn = styled.div`
  flex-grow: 1;
  display: block;
  background-color: var(--global-div-tr);
  border-radius: var(--global-border-radius);
  padding: 0.75rem;
  @media (max-width: 1000px) {
    display: block;
    margin-right: 0rem;
  }
  p {
    font-size: 0.9rem;
    margin: 0;
  }
  h4 {
    margin: 0rem;
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }
  @media (max-width: 500px) {
    p {
      font-size: 0.8rem;
      margin: 0rem;
    }
    h4 {
      font-size: 1rem;
      margin-bottom: 0rem;
    }
  }
`;

export const MediaSource: React.FC<MediaSourceProps> = ({
  sourceType,
  setSourceType,
  language,
  setLanguage,
  downloadLink,
  episodeId,
  airingTime,
  nextEpisodenumber,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <UpdatedContainer>
      <EpisodeInfoColumn>
        {episodeId ? (
          <>
            You're watching <strong>Episode {episodeId}</strong>
            <DownloadLink
              href={downloadLink}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaDownload />
            </DownloadLink>
            <ShareButton onClick={handleShareClick}>
              <FaShare />
            </ShareButton>
            {isCopied && <p>Copied to clipboard!</p>}
            <br />
            <br />
            <p>If current servers don't work, please try other servers.</p>
          </>
        ) : (
          'Loading episode information...'
        )}
        {airingTime && (
          <>
            <p>
              Episode <strong>{nextEpisodenumber}</strong> will air in{' '}
              <FaBell />
              <strong> {airingTime}</strong>.
            </p>
          </>
        )}
      </EpisodeInfoColumn>
      <ResponsiveTableContainer>
        <Table>
          <tbody>
            <TableRow>
              <TableCell>
                <FaClosedCaptioning /> Sub
              </TableCell>
              <TableCell>
                <ButtonWrapper>
                  <Button
                    className={
                      sourceType === 'default' && language === 'sub'
                        ? 'active'
                        : ''
                    }
                    onClick={() => {
                      setSourceType('default');
                      setLanguage('sub');
                    }}
                  >
                    Default
                  </Button>
                </ButtonWrapper>
              </TableCell>
              <TableCell>
                <ButtonWrapper>
                  <Button
                    className={
                      sourceType === 'vidstreaming' && language === 'sub'
                        ? 'active'
                        : ''
                    }
                    onClick={() => {
                      setSourceType('vidstreaming');
                      setLanguage('sub');
                    }}
                  >
                    Vidstream
                  </Button>
                </ButtonWrapper>
              </TableCell>
              <TableCell>
                <ButtonWrapper>
                  <Button
                    className={
                      sourceType === 'gogo' && language === 'sub'
                        ? 'active'
                        : ''
                    }
                    onClick={() => {
                      setSourceType('gogo');
                      setLanguage('sub');
                    }}
                  >
                    Gogo
                  </Button>
                </ButtonWrapper>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <FaMicrophone /> Dub
              </TableCell>
              <TableCell>
                <ButtonWrapper>
                  <Button
                    className={
                      sourceType === 'default' && language === 'dub'
                        ? 'active'
                        : ''
                    }
                    onClick={() => {
                      setSourceType('default');
                      setLanguage('dub');
                    }}
                  >
                    Default
                  </Button>
                </ButtonWrapper>
              </TableCell>
              <TableCell>
                <ButtonWrapper>
                  <Button
                    className={
                      sourceType === 'vidstreaming' && language === 'dub'
                        ? 'active'
                        : ''
                    }
                    onClick={() => {
                      setSourceType('vidstreaming');
                      setLanguage('dub');
                    }}
                  >
                    Vidstream
                  </Button>
                </ButtonWrapper>
              </TableCell>
              <TableCell>
                <ButtonWrapper>
                  <Button
                    className={
                      sourceType === 'gogo' && language === 'dub'
                        ? 'active'
                        : ''
                    }
                    onClick={() => {
                      setSourceType('gogo');
                      setLanguage('dub');
                    }}
                  >
                    Gogo
                  </Button>
                </ButtonWrapper>
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </ResponsiveTableContainer>
    </UpdatedContainer>
  );
};
