import React, { useState } from "react";
import styled from "styled-components";
import CardGrid from "../Cards/CardGrid";

// Styled components
const AnimeDataContainer = styled.div``;

const AnimeDataContainerTop = styled.div`
  border-radius: var(--global-border-radius);
  padding: 0.6rem;
  color: var(--global-text);
  align-items: center;
  flex-direction: row;
  align-items: flex-start;
  display: flex;
`;

const AnimeDataContainerBottom = styled.div`
  padding: 0.6rem;
`;

const AnimeDataText = styled.div`
  text-align: left;
  line-height: 1rem;

  p {
    margin-top: 0rem;
  }

  .anime-title {
    line-height: 1.6rem;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.8rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 0.6rem;
  background-color: var(--primary-accent-bg);
  color: white;
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;

  &:hover {
    background-color: var(--primary-accent);
  }

  @media (max-width: 1000px) {
    display: block;
    margin: 0 auto;
    margin-bottom: 0.5rem;
  }
`;

const ShowTrailerButton = styled(Button)`
  margin-bottom: 0.5rem;
`;

const ShowMoreButton = styled.p`
  border-radius: var(--global-border-radius);
  transition: background-color 0.3s ease;
  padding-top: 0.5rem;
  display: block;
  text-align: left;
  margin-right: 10rem;
  @media (max-width: 1000px) {
    margin-left: 0rem;
    margin-right: 0rem;
  }
`;

const Relations = styled.div`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;
  padding: 0.6rem;
`;

const AnimeInfoImage = styled.img`
  border-radius: var(--global-border-radius);
  max-height: 12rem;
  margin-right: 1rem;
  @media (max-width: 1000px) {
    max-height: 10rem;
  }
`;

const AnimeCharacterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;
  padding: 0.6rem;
  margin-right: 10rem;
  @media (max-width: 1000px) {
    margin-right: 0rem;
  }
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

const DescriptionText = styled.p`
  text-align: left;
  line-height: 1.2rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VideoTrailer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: -1.5rem;
  overflow: hidden;
  position: relative;
  width: 50%;
  height: auto;
  border: none;

  @media (max-width: 1000px) {
    aspect-ratio: 16/9;
    width: 100%;
    height: 100%;
    margin-bottom: 0.5rem;
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

  return (
    <>
      {animeData && (
        <AnimeDataContainer>
          <AnimeDataContainerTop>
            <AnimeInfoImage src={animeData.image} alt="Anime Title Image" />
            <AnimeDataText className="bio">
              <p className="anime-title">{animeData.title.english ? animeData.title.english : animeData.title.romaji}</p>
              <p>
                <strong>Type:</strong> {animeData.type}
              </p>

              <p>
                <strong>Year:</strong>{" "}
                {animeData.releaseDate ? animeData.releaseDate : "Unknown"}
              </p>
              <p>
                <strong>Rating:</strong> {animeData.rating / 10}
              </p>
            </AnimeDataText>
          </AnimeDataContainerTop>
          <AnimeDataContainerBottom>
            <AnimeDataText>
              <p>
                <strong>Status:</strong> {animeData.status}
              </p>
              {animeData.genres.length > 0 && (
                <p>
                  <strong>Genres:</strong> {animeData.genres.join(", ")}
                </p>
              )}
              {animeData.startDate && (
                <p>
                  <strong> Date aired:</strong>{" "}
                  {getDateString(animeData.startDate)}
                  {animeData.endDate
                    ? ` to ${animeData.endDate.month && animeData.endDate.year
                      ? getDateString(animeData.endDate)
                      : "?"
                    }`
                    : animeData.status === "Ongoing"
                      ? ""
                      : " to ?"}
                </p>
              )}
              {animeData.studios && (
                <p>
                  <strong>Studios:</strong> {animeData.studios}
                </p>
              )}
              {animeData.trailer && (
                <>
                  <ShowTrailerButton onClick={toggleTrailer}>
                    {showTrailer ? "Hide Trailer" : "Show Trailer"}
                  </ShowTrailerButton>
                  {showTrailer && (
                    <VideoTrailer>
                      <IframeTrailer
                        src={`https://www.youtube.com/embed/${animeData.trailer.id}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </VideoTrailer>
                  )}
                </>
              )}
              {animeData.description && (
                <DescriptionText>
                  <strong>Description: </strong>
                  <ShowMoreButton onClick={toggleDescription}>
                    {isDescriptionExpanded
                      ? removeHTMLTags(animeData.description || "")
                      : `${removeHTMLTags(
                        animeData.description || ""
                      ).substring(0, 300)}...`}
                    <br />
                    <br />
                    <p style={{ textAlign: "center", fontWeight: "bold" }}>
                      {" "}
                      {isDescriptionExpanded ? "Show Less" : "Show More"}
                    </p>
                  </ShowMoreButton>
                </DescriptionText>
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
            </AnimeDataText>
          </AnimeDataContainerBottom>
        </AnimeDataContainer>
      )}
      {animeData &&
        animeData.relations.filter((relation: any) =>
          ["OVA", "SPECIAL", "TV", "MOVIE", "ONA", "NOVEL"].includes(
            relation.type
          )
        ).length > 0 && (
          <>
            <AnimeDataText className="bio">
              <p className="anime-title">Relations</p>
            </AnimeDataText>
            <Relations>
              <CardGrid
                animeData={animeData.relations
                  .filter((relation: any) =>
                    ["OVA", "SPECIAL", "TV", "MOVIE", "ONA", "NOVEL"].includes(
                      relation.type
                    )
                  )
                  .slice(0, 6)}
                totalPages={0}
                hasNextPage={false}
                onLoadMore={() => { }}
              />
            </Relations>
          </>
        )}

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
                  .slice(0, 6)}
                totalPages={0}
                hasNextPage={false}
                onLoadMore={() => { }}
              />
            </Relations>
          </>
        )}
    </>
  );
};

export default WatchAnimeData;
