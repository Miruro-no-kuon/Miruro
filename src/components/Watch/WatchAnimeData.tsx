import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Seasons, Anime } from '../../index';
import { SiMyanimelist, SiAnilist } from 'react-icons/si';

const AnimeDataContainer = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 1000px) {
    margin-bottom: 0rem;
  }
`;

const AnimeDataContainerTop = styled.div`
  border-radius: var(--global-border-radius);
  background-color: var(--global-div-tr);
  margin: 1rem 0;
  padding: 0.75rem;
  color: var(--global-text);
  align-items: center;
  flex-direction: row;
  align-items: flex-start;
  display: flex;
`;
const AnimeDataContainerMiddle = styled.div`
  border-radius: var(--global-border-radius);
  padding-top: 0.6rem;
  color: var(--global-text);
  align-items: center;
  flex-direction: row;
  align-items: flex-start;
  display: flex;
  @media (max-width: 500px) {
    padding-top: 0.4rem;
  }
`;

const AnimeDataContainerBottom = styled.div`
  margin-top: 0.6rem;
  @media (max-width: 750px) {
    margin-top: 0rem;
  }
`;

const ParentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr; // Default to single column for narrow screens
  @media (min-width: 750px) {
    grid-template-columns: 1.2fr 1fr; // Switch to two columns on wider screens
  }
  @media (min-width: 1500px) {
    grid-template-columns: 1.25fr 1fr; // Switch to two columns on wider screens
  }
`;

const AnimeDataText = styled.div`
  text-align: left;
  font-size: 0.8rem;
  .anime-title {
    line-height: 1.6rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--global-text);
    margin-bottom: 0.5rem;
    @media (max-width: 500px) {
      font-size: 1.25rem;
      margin-bottom: 0.2rem;
    }
  }
  .anime-title-romaji {
    font-style: italic;
    margin-top: 0rem;
    line-height: 0.6rem;
    margin-bottom: 0.5rem;
    @media (max-width: 500px) {
      line-height: 1rem;
      margin-bottom: 0.25rem;
    }
  }
  p {
    color: #828181;
    margin-top: 0rem;
    margin-bottom: 0.2rem;
    line-height: 1.3rem;
    @media (max-width: 500px) {
      line-height: 1rem;
    }
  }
  .Description {
    line-height: 1rem;
    max-width: 50rem;
    font-size: 0.9rem;
  }
  strong {
    color: var(--global-text);
  }
  .Seasons-Sections-Titles {
    color: var(--global-text);
    margin-top: 1rem;
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const AnimeInfoImage = styled.img`
  border-radius: var(--global-border-radius);
  max-height: 15rem;
  width: 10.5rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  @media (max-width: 500px) {
    max-height: 12rem;
    width: 8.5rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 0.6rem;
  background-color: var(--primary-accent);
  color: white;
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;

  &:hover,
  &:active,
  &:focus {
    background-color: var(--primary-accent-bg);
  }

  @media (max-width: 1000px) {
    display: block;
    margin: 0 auto;
    margin-bottom: 0.5rem;
  }
`;

const ShowTrailerButton = styled(Button)`
  margin-right: 1rem;
  padding: 0rem;
  width: 10.5rem; //same as anime picture width.
  background-color: var(--global-div);
  transition:
    background-color 0.3s ease,
    transform 0.2s ease-in-out;
  color: var(--global-text);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  &:hover,
  &:active,
  &:focus {
    background-color: var(--primary-accent);
    z-index: 2;
  }
  @media (max-width: 500px) {
    font-size: 0.8rem;
    width: 8.5rem;
  }
`;
const MalAniContainer = styled.div`
  display: flex; /* or grid */
  gap: 0.5rem;
  margin-right: 1rem;
`;

const MalAnilistSvg = styled.div`
  height: 2.5rem;
  width: 5rem;
  border-radius: var(--global-border-radius);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--global-div);
  color: var(--global-text);
  transition: 0.1s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.975);
  }

  @media (max-width: 500px) {
    width: 4rem;
    height: 2rem;
  }
`;

const ShowMoreButton = styled.button`
  background-color: var(--global-div);
  color: #828181;
  display: flex;
  border: none;
  padding: 0.5rem;
  border-radius: var(--global-border-radius);
  margin: 0.5rem 0;
  text-align: left;
  &:hover,
  &:active,
  &:focus {
    background-color: var(--global-div);
  }
  transition:
    color 0.3s ease,
    transform 0.2s ease-in-out;
  @media (max-width: 500px) {
    margin: 0rem;
    margin-top: 1rem;
  }
`;

const IframeTrailer = styled.iframe`
  aspect-ratio: 16/9;
  margin-bottom: 2rem;
  position: relative;
  border: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  @media (max-width: 1000px) {
    width: 100%;
    height: 100%;
  }
`;

const TrailerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-in-out;
  animation: slideUp 0.3s ease-in-out;
  aspect-ratio: 16 / 9; // Maintain a 16:9 aspect ratio
`;

const TrailerOverlayContent = styled.div`
  width: 60%; // Adjusted width for better visibility
  aspect-ratio: 16 / 9; // Maintain a 16:9 aspect ratio
  background: white;
  border-radius: var(--global-border-radius);
  overflow: hidden;
  background-color: var(--global-div);
  @media (max-width: 500px) {
    width: 95%;
  }
`;

export const WatchAnimeData: React.FC<{ animeData: Anime }> = ({
  animeData,
}) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const getAnimeIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2];
  };

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  useEffect(() => {
    setDescriptionExpanded(false);
  }, [getAnimeIdFromUrl()]);

  const removeHTMLTags = (description: string): string => {
    return description.replace(/<[^>]+>/g, '').replace(/\([^)]*\)/g, '');
  };

  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showTrailer) {
        setShowTrailer(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTrailer]);

  function capitalizeFirstLetter(str: string) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const isScreenUnder500px = () => window.innerWidth < 500;

  return (
    <>
      {animeData && (
        <AnimeDataContainer>
          <AnimeDataContainerTop>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <AnimeInfoImage src={animeData.image} alt='Anime Title Image' />
              {animeData.trailer && animeData.status !== 'Not yet aired' && (
                <ShowTrailerButton onClick={toggleTrailer}>
                  <p>
                    <strong>TRAILER</strong>
                  </p>
                </ShowTrailerButton>
              )}
              {showTrailer && (
                <TrailerOverlay onClick={toggleTrailer}>
                  <TrailerOverlayContent onClick={(e) => e.stopPropagation()}>
                    <IframeTrailer
                      src={`https://www.youtube.com/embed/${animeData.trailer.id}`}
                      allowFullScreen
                    />
                  </TrailerOverlayContent>
                </TrailerOverlay>
              )}
              <MalAniContainer>
                {animeData.id && (
                  <a
                    href={`https://anilist.co/${!animeData.type ? 'anime' : animeData.type.toLowerCase() === 'manga' || animeData.type.toLowerCase() === 'novel' ? 'manga' : 'anime'}/${animeData.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <MalAnilistSvg>
                      <SiAnilist size={'1.5rem'} />
                    </MalAnilistSvg>
                  </a>
                )}
                {animeData.malId && (
                  <a
                    href={`https://myanimelist.net/${!animeData.type ? 'anime' : animeData.type.toLowerCase() === 'manga' || animeData.type.toLowerCase() === 'novel' ? 'manga' : 'anime'}/${animeData.malId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <MalAnilistSvg>
                      <SiMyanimelist size={'2.75rem'} />
                    </MalAnilistSvg>
                  </a>
                )}
              </MalAniContainer>
            </div>
            <AnimeDataText>
              <>
                <p className='anime-title'>
                  {animeData.title.english
                    ? animeData.title.english
                    : animeData.title.romaji}
                </p>
                <p
                  className='anime-title-romaji'
                  style={{ color: animeData.color }}
                >
                  {animeData.title.romaji
                    ? animeData.title.romaji
                    : animeData.title.native}
                </p>
              </>
              {!isScreenUnder500px() && animeData.description && (
                <AnimeDataText>
                  <p className='Description'>
                    <ShowMoreButton onClick={toggleDescription}>
                      {isDescriptionExpanded
                        ? removeHTMLTags(animeData.description)
                        : `${removeHTMLTags(animeData.description).substring(0, 100)}...`}
                      {isDescriptionExpanded ? '[Show Less]' : '[Show More]'}
                    </ShowMoreButton>
                  </p>
                </AnimeDataText>
              )}
              <ParentContainer>
                <AnimeDataContainerMiddle>
                  <AnimeDataText>
                    {animeData.type ? (
                      <p>
                        Type: <strong>{animeData.type}</strong>
                      </p>
                    ) : (
                      <p>
                        Type: <strong>Unknown</strong>
                      </p>
                    )}
                    {animeData.releaseDate ? (
                      <p>
                        Year: <strong>{animeData.releaseDate}</strong>
                      </p>
                    ) : (
                      <p>
                        Year: <strong>Unknown</strong>
                      </p>
                    )}
                    {animeData.status && (
                      <p>
                        Status:{' '}
                        <strong>
                          {animeData.status === 'Completed'
                            ? 'Finished'
                            : animeData.status === 'Ongoing'
                              ? 'Airing'
                              : animeData.status}
                        </strong>
                      </p>
                    )}
                    {animeData.rating ? (
                      <p>
                        Rating: <strong>{animeData.rating}</strong>
                      </p>
                    ) : (
                      <p>
                        Rating: <strong>Unknown</strong>
                      </p>
                    )}
                    {animeData.studios && animeData.studios.length > 0 ? (
                      <p>
                        Studios: <strong>{animeData.studios}</strong>
                      </p>
                    ) : (
                      <p>
                        Studios: <strong>Unknown</strong>
                      </p>
                    )}
                  </AnimeDataText>
                </AnimeDataContainerMiddle>
                <AnimeDataContainerBottom>
                  <AnimeDataText>
                    {animeData.totalEpisodes !== null ? (
                      <p>
                        Episodes: <strong>{animeData.totalEpisodes}</strong>
                      </p>
                    ) : (
                      <p>
                        Episodes: <strong>Unknown</strong>
                      </p>
                    )}
                    {animeData.duration ? (
                      <p>
                        Duration: <strong>{animeData.duration} min</strong>
                      </p>
                    ) : (
                      <p>
                        Duration: <strong>Unknown</strong>
                      </p>
                    )}
                    {animeData.season ? (
                      <p>
                        Season:{' '}
                        <strong>
                          {capitalizeFirstLetter(animeData.season)}
                        </strong>
                      </p>
                    ) : (
                      <p>
                        Season: <strong>Unknown</strong>
                      </p>
                    )}
                    {animeData.countryOfOrigin && (
                      <p>
                        Country: <strong>{animeData.countryOfOrigin}</strong>
                      </p>
                    )}
                    {/* timeUntilAiring */}
                    {/* {animeData.nextAiringEpisode && (
                      <p>
                        AiringTime:{" "}
                        <strong>
                          {animeData.nextAiringEpisode.timeUntilAiring}
                        </strong>
                      </p>
                    )} */}
                    {/* {animeData.startDate && (
                      <p>
                        Date aired:
                        <strong>
                          {' '}
                          {getDateString(animeData.startDate)}
                          {animeData.endDate
                            ? ` to ${
                                animeData.endDate.month &&
                                animeData.endDate.year
                                  ? getDateString(animeData.endDate)
                                  : '?'
                              }`
                            : animeData.status === 'Ongoing'
                              ? ''
                              : ' to ?'}
                        </strong>
                      </p>
                    )} */}
                    {animeData.genres && animeData.genres.length > 0 ? (
                      <p>
                        Genres: <strong>{animeData.genres.join(', ')}</strong>
                      </p>
                    ) : (
                      <p>
                        Genres: <strong>Unknown</strong>
                      </p>
                    )}
                  </AnimeDataText>
                </AnimeDataContainerBottom>
              </ParentContainer>
            </AnimeDataText>
          </AnimeDataContainerTop>
          {isScreenUnder500px() && animeData.description && (
            <AnimeDataText>
              <p className='Description'>
                <strong>Description: </strong>
                <ShowMoreButton onClick={toggleDescription}>
                  {isDescriptionExpanded
                    ? removeHTMLTags(animeData.description)
                    : `${removeHTMLTags(animeData.description).substring(0, 150)}...`}
                  {isDescriptionExpanded ? '[Show Less]' : '[Show More]'}
                </ShowMoreButton>
              </p>
            </AnimeDataText>
          )}
        </AnimeDataContainer>
      )}
      {animeData.relations &&
        animeData.relations.some(
          (relation: any) =>
            relation.relationType.toUpperCase() === 'PREQUEL' ||
            relation.relationType.toUpperCase() === 'SEQUEL',
        ) && (
          <>
            <AnimeDataText>
              <p className='Seasons-Sections-Titles'>SEASONS</p>
              <Seasons
                relations={animeData.relations.filter(
                  (relation: any) =>
                    relation.relationType.toUpperCase() === 'PREQUEL' ||
                    relation.relationType.toUpperCase() === 'SEQUEL',
                )}
              />
            </AnimeDataText>
          </>
        )}
    </>
  );
};
