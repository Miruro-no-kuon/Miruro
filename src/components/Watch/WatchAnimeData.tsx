import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CardGrid from "../Cards/CardGrid";
import AniList_logo from "../../assets/AniList_logo.png";
import MAL_logo from "../../assets/MyAnimeList_Logo.png";
import anil_big from "../../assets/anilbig.png";
import mal_big from "../../assets/malbig.jpg";
// Styled components
const AnimeDataContainer = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 1000px) {
    margin-bottom: 0rem;
  }
`;

const AnimeDataContainerTop = styled.div`
  border-radius: var(--global-border-radius);
  padding-top: 0.8rem;
  color: var(--global-text);
  align-items: center;
  flex-direction: row;
  align-items: flex-start;
  display: flex;
`;
const AnimeDataContainerMiddle = styled.div`
  border-radius: var(--global-border-radius);
  padding-top: 0.8rem;
  color: var(--global-text);
  align-items: center;
  flex-direction: row;
  align-items: flex-start;
  display: flex;
`;

const AnimeDataContainerBottom = styled.div`
  margin-top: 0.8rem;
  @media (max-width: 500px) {
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
  font-size: 0.9rem;
  @media (max-width: 500px) {
    font-size: 0.83rem;
  }
  .anime-title {
    line-height: 1.6rem;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    @media (max-width: 500px) {
      font-size: 1.25rem;
      margin-bottom: 0.2rem;
    }
  }
  .anime-title-romaji {
    margin-top: 0rem;
    line-height: 0.6rem;
    margin-bottom: 0.3rem;
    @media (max-width: 500px) {
      line-height: 1rem;
    }
  }
  p {
    margin-top: 0rem;
    margin-bottom: 0.2rem;
    line-height: 1.3rem;
    @media (max-width: 500px) {
      line-height: 1rem;
    }
  }
  .Description {
    margin-top: 1rem;
    line-height: 1.3rem;
  }
`;

const AnimeInfoImage = styled.img`
  border-radius: var(--global-border-radius);
  max-height: 15rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  @media (max-width: 500px) {
    max-height: 9rem;
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

  &:hover {
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
  padding: 0.8rem;
  width: 10.5rem; //same as anime picture width.
  padding-bottom: 0.8rem;
  background-color: var(--global-div);
  transition: background-color 0.3s ease, transform 0.2s ease-in-out;
  color: var(--global-text);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  &:hover {
    background-color: var(--primary-accent);
    transform: scale(1.05);
    z-index: 2;
  }
  @media (max-width: 500px) {
    font-size: 0.75rem;

    width: 6.5rem; //same as anime picture width.
  }
`;
const MalAniContainer = styled.div`
  display: flex; /* or grid */
  gap: 0.5rem;
  margin-right: 1rem;
`;

const MalAnilistimg = styled.img`
  border-radius: var(--global-border-radius);
  height: 2.5rem;
  transition: transform 0.2s ease-in-out;
  width: 5rem;
  object-fit: cover;
  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 500px) {
    width: 3rem;
    height: 2rem;
  }
`;

const ShowMoreButton = styled.span`
  border-radius: var(--global-border-radius);
  transition: background-color 0.3s ease;
  padding-top: 0.5rem;
  display: block;
  text-align: left;
`;

const Relations = styled.div`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;
  margin-top: 2rem;
`;

const AnimeCharacterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;
  padding: 0.6rem;
`;

const CharacterCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
`;

const CharacterImages = styled.img`
  max-height: 9rem;
  height: auto;
  border-radius: var(--global-border-radius);
  @media (max-width: 1000px) {
    max-height: 7rem;
  }
`;

const CharacterName = styled.div`
  text-align: center;
  word-wrap: break-word;
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

const slideUpAnimation = keyframes`
  0% { opacity: 0.4; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: ${fadeInAnimation} 0.3s ease forwards;
  animation: ${slideUpAnimation} 0.3s ease forwards;
  aspect-ratio: 16 / 9; // Maintain a 16:9 aspect ratio
`;

const TrailerOverlayContent = styled.div`
  width: 60%; // Adjusted width for better visibility
  aspect-ratio: 16 / 9; // Maintain a 16:9 aspect ratio
  background: white;
  border-radius: var(--global-border-radius);
  overflow: hidden;
  z-index: 11;
  background-color: var(--global-div);
  @media (max-width: 500px) {
    width: 95%;
  }
`;

interface AnimeDataProps {
  animeData: any;
}

// Main component
const WatchAnimeData: React.FC<AnimeDataProps> = ({ animeData }) => {
  // State
  const [showCharacters, setShowCharacters] = useState(false);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  // Toggle description expansion
  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
    setShowCharacters(!isDescriptionExpanded);
  };

  // Remove HTML tags from description
  const removeHTMLTags = (description: string): string => {
    return description.replace(/<[^>]+>/g, "").replace(/\([^)]*\)/g, "");
  };

  // Toggle trailer display
  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  // Effect for Escape key event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showTrailer) {
        setShowTrailer(false);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTrailer]);

  // Format date string
  function getDateString(date: any) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[date.month - 1]} ${date.day}, ${date.year}`;
  }
  //ANime season text formatting
  function capitalizeFirstLetter(str: any) {
    if (!str) return str; // Return the original string if it's falsy
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <AnimeInfoImage src={animeData.image} alt="Anime Title Image" />
              {animeData.trailer && animeData.status !== "Not yet aired" && (
                <ShowTrailerButton onClick={toggleTrailer}>
                  <strong>Show Trailer</strong>
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
                    href={`https://anilist.co/anime/${animeData.id}`}
                    target="_blank"
                  >
                    {isScreenUnder500px() ? (
                      <MalAnilistimg src={AniList_logo} alt="AniList Logo" />
                    ) : (
                      <MalAnilistimg src={anil_big} alt="AniList Logo" />
                    )}
                  </a>
                )}
                {animeData.malId && (
                  <a
                    href={`https://myanimelist.net/anime/${animeData.malId}`}
                    target="_blank"
                  >
                    {isScreenUnder500px() ? (
                      <MalAnilistimg src={MAL_logo} alt="MyAnimeList Logo" />
                    ) : (
                      <MalAnilistimg src={mal_big} alt="MyAnimeList Logo" />
                    )}
                  </a>
                )}
              </MalAniContainer>
            </div>
            <AnimeDataText className="bio">
              <>
                <p className="anime-title" style={{ color: animeData.color }}>
                  {animeData.title.english
                    ? animeData.title.english
                    : animeData.title.romaji}
                </p>
                <p className="anime-title-romaji">
                  {animeData.title.romaji
                    ? animeData.title.romaji
                    : animeData.title.native}
                </p>
              </>
              <ParentContainer>
                <AnimeDataContainerMiddle>
                  <AnimeDataText className="bio">
                    {animeData.type && (
                      <p>
                        Type: <strong>{animeData.type}</strong>
                      </p>
                    )}
                    {animeData.releaseDate && (
                      <p>
                        Year:{" "}
                        <strong>
                          {animeData.releaseDate
                            ? animeData.releaseDate
                            : "Unknown"}
                        </strong>
                      </p>
                    )}
                    {animeData.status && (
                      <p>
                        Status: <strong>{animeData.status}</strong>
                      </p>
                    )}
                    {animeData.rating && (
                      <p>
                        Rating:{" "}
                        <strong
                          style={{
                            color:
                              animeData.rating >= 85
                                ? "green"
                                : animeData.rating >= 70
                                ? "lightgreen"
                                : animeData.rating >= 55
                                ? "orange"
                                : "red",
                          }}
                        >
                          {animeData.rating}
                        </strong>
                      </p>
                    )}
                    {animeData.studios && (
                      <p>
                        Studios: <strong>{animeData.studios}</strong>
                      </p>
                    )}
                    {animeData.totalEpisodes && (
                      <p>
                        Episodes: <strong>{animeData.totalEpisodes}</strong>
                      </p>
                    )}
                  </AnimeDataText>
                </AnimeDataContainerMiddle>
                <AnimeDataContainerBottom>
                  <AnimeDataText>
                    {animeData.duration && (
                      <p>
                        Duration: <strong>{animeData.duration} min</strong>
                      </p>
                    )}
                    {animeData.season && (
                      <p>
                        Season:{" "}
                        <strong>
                          {capitalizeFirstLetter(animeData.season)}
                        </strong>
                      </p>
                    )}
                    {animeData.countryOfOrigin && (
                      <p>
                        Country: <strong>{animeData.countryOfOrigin}</strong>
                      </p>
                    )}
                    {animeData.nextAiringEpisode && (
                      <p>
                        AiringTime:{" "}
                        <strong>
                          {animeData.nextAiringEpisode.timeUntilAiring}
                        </strong>
                      </p>
                    )}
                    {animeData.startDate && (
                      <p>
                        Date aired:
                        <strong>
                          {" "}
                          {getDateString(animeData.startDate)}
                          {animeData.endDate
                            ? ` to ${
                                animeData.endDate.month &&
                                animeData.endDate.year
                                  ? getDateString(animeData.endDate)
                                  : "?"
                              }`
                            : animeData.status === "Ongoing"
                            ? ""
                            : " to ?"}
                        </strong>
                      </p>
                    )}
                    {animeData.genres && (
                      <p>
                        Genres: <strong>{animeData.genres.join(", ")}</strong>
                      </p>
                    )}
                  </AnimeDataText>
                </AnimeDataContainerBottom>
              </ParentContainer>
            </AnimeDataText>
          </AnimeDataContainerTop>
          {animeData.description && (
            <AnimeDataText>
              <p className="Description">
                <strong>Description: </strong>

                <ShowMoreButton onClick={toggleDescription}>
                  {isDescriptionExpanded
                    ? removeHTMLTags(animeData.description || "")
                    : `${removeHTMLTags(animeData.description || "").substring(
                        0,
                        300
                      )}...`}
                  <br />
                  <br />
                  <span
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  ></span>
                </ShowMoreButton>
              </p>
            </AnimeDataText>
          )}
          {animeData.characters &&
            animeData.characters.length > 0 &&
            showCharacters && (
              <>
                <strong>Characters: </strong>
                <AnimeCharacterContainer>
                  {animeData.characters
                    .filter(
                      (character: any) =>
                        character.role === "MAIN" ||
                        character.role === "SUPPORTING"
                    )
                    .map((character: any) => (
                      <CharacterCard
                        key={character.id}
                        style={{ textAlign: "center" }}
                      >
                        <CharacterImages
                          src={character.image}
                          alt={character.name.full}
                        />
                        <CharacterName>{character.name.full}</CharacterName>
                      </CharacterCard>
                    ))}
                </AnimeCharacterContainer>
              </>
            )}
        </AnimeDataContainer>
      )}
      {animeData &&
        animeData.relations.filter(
          (relation: any) =>
            relation.relationType.toUpperCase() === "PREQUEL" ||
            relation.relationType.toUpperCase() === "SEQUEL"
        ).length > 0 && (
          <>
            <AnimeDataText className="bio">
              <p className="anime-title">Seasons</p>
            </AnimeDataText>
            <Relations>
              <CardGrid
                animeData={animeData.relations
                  .filter(
                    (relation: any) =>
                      relation.relationType.toUpperCase() === "PREQUEL" ||
                      relation.relationType.toUpperCase() === "SEQUEL"
                  )
                  .slice(0, window.innerWidth > 500 ? 5 : 6)} // Adjust slice based on screen width
                totalPages={0}
                hasNextPage={false}
                onLoadMore={() => {}}
              />
            </Relations>
            <br></br>
          </>
        )}
      {animeData &&
        animeData.relations.filter(
          (relation: any) =>
            ["OVA", "SPECIAL", "TV", "MOVIE", "ONA", "NOVEL"].includes(
              relation.type
            ) &&
            relation.relationType.toUpperCase() !== "PREQUEL" &&
            relation.relationType.toUpperCase() !== "SEQUEL"
        ).length > 0 && (
          <>
            <AnimeDataText className="bio">
              <p className="anime-title">Related</p>
            </AnimeDataText>
            <Relations>
              <CardGrid
                animeData={animeData.relations
                  .filter(
                    (relation: any) =>
                      [
                        "OVA",
                        "SPECIAL",
                        "TV",
                        "MOVIE",
                        "ONA",
                        "NOVEL",
                      ].includes(relation.type) &&
                      relation.relationType.toUpperCase() !== "PREQUEL" &&
                      relation.relationType.toUpperCase() !== "SEQUEL"
                  )
                  .slice(0, window.innerWidth > 500 ? 5 : 6)} // Adjust slice based on screen width
                totalPages={0}
                hasNextPage={false}
                onLoadMore={() => {}}
              />
            </Relations>
            <br></br>
          </>
        )}
      {/* Recommendations */}
      {animeData &&
        animeData.recommendations.filter((recommendation: any) =>
          ["OVA", "SPECIAL", "TV", "MOVIE", "ONA", "NOVEL"].includes(
            recommendation.type
          )
        ).length > 0 && (
          <>
            <AnimeDataText className="bio">
              <p className="anime-title">Recommendations</p>
            </AnimeDataText>
            <Relations>
              <CardGrid
                animeData={animeData.recommendations
                  .filter((recommendation: any) =>
                    ["OVA", "SPECIAL", "TV", "MOVIE", "ONA", "NOVEL"].includes(
                      recommendation.type
                    )
                  )
                  .slice(0, window.innerWidth > 500 ? 5 : 6)} // Adjust slice based on screen width
                totalPages={0}
                hasNextPage={false}
                onLoadMore={() => {}}
              />
            </Relations>
          </>
        )}
    </>
  );
};

export default WatchAnimeData;
