import React from 'react';
import styled from 'styled-components';
import { FaBell, FaDownload } from 'react-icons/fa';

// Props interface
interface VideoSourceSelectorProps {
  sourceType: string;
  setSourceType: (sourceType: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  downloadLink: string;
  episodeId?: string;
  airingTime?: string;
  nextEpisodenumber?: string;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 0.8rem;
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
  text-align: center;
  padding: 0.35rem; // Adjust overall padding as needed
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
    background-color 0.3s ease,
    transform 0.2s ease-in-out;
  text-align: center;

  &:hover {
    background-color: var(--primary-accent);
    transform: scale(1.05);
  }
`;

const Button = styled(ButtonBase)`
  &.active {
    background-color: var(--primary-accent);
  }
`;

const DownloadLink = styled.a`
  display: inline-block; // Ensures it can be styled like a button
  padding: 0.25rem;
  padding-left: 0rem;
  font-size: 0.9rem;
  border: none;
  font-weight: bold;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: var(--global-div);
  color: var(--global-text);
  text-align: center;
  text-decoration: none; // Removes underline from links
  margin-left: 0.5rem;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease-in-out;
  &:hover {
    background-color: var(--primary-accent);
  }
`;

const ResponsiveTableContainer = styled.div`
  background-color: var(--global-div-tr);
  padding: 0.6rem;
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
  padding: 0.6rem;
  margin-right: 0.8rem;
  @media (max-width: 1000px) {
    display: block;
    margin-bottom: 10px;
    margin-right: 0rem;
  }
  svg {
    margin-left: 0.5rem;
    font-size: 0.8rem;
  }
  p {
    font-size: 0.9rem;
    margin: 0rem;
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

// Adjust the Container for responsive layout
const UpdatedContainer = styled(Container)`
  display: flex;
  width: 100%;
  justify-content: space-between; // Adjust based on layout needs
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const VideoSourceSelector: React.FC<VideoSourceSelectorProps> = ({
  sourceType,
  setSourceType,
  language,
  setLanguage,
  downloadLink,
  episodeId,
  airingTime,
  nextEpisodenumber,
}) => {
  return (
    <UpdatedContainer>
      <EpisodeInfoColumn>
        {episodeId ? (
          <>
            <h4>
              You're watching <strong>Episode {episodeId}</strong>
              <DownloadLink
                href={downloadLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaDownload /> Download
              </DownloadLink>
            </h4>
            <p>If current servers don't work, please try other servers.</p>
          </>
        ) : (
          'Loading episode information...'
        )}
        {airingTime && (
          <>
            <p>
              The next episode, <strong>{nextEpisodenumber}</strong> will air in
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
              <TableCell>Sub</TableCell>
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
              <TableCell>Dub</TableCell>
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

export default VideoSourceSelector;
