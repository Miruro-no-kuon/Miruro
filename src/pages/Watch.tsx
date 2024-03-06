import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import EpisodeList from "../components/Watch/EpisodeList";
import VideoPlayer from "../components/Watch/Video/VideoPlayer";
import CardGrid from "../components/Cards/CardGrid";
import {
  fetchAnimeInfo2,
  fetchAnimeInfo,
  fetchAnimeEpisodes,
} from "../hooks/useApi";

const LOCAL_STORAGE_KEYS = {
  LAST_WATCHED_EPISODE: "last-watched-",
  WATCHED_EPISODES: "watched-episodes-", // Key for storing array of watched episodes
};

const WatchContainer = styled.div`
  /* margin-right: 5rem;
  margin-left: 5rem; */
  font-size: 0.9rem;
  gap: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--global-primary-bg);
  color: var(--global-text);

  @media (min-width: 1200px) {
    flex-direction: row;
    align-items: flex-start;
    margin-right: 5rem;
    margin-left: 5rem;
  }
`;

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--global-border-radius);
  @media (min-width: 1000px) {
    flex: 3 1 auto;
  }
`;

const VideoPlayerImageWrapper = styled.div`
  border-radius: var(--global-border-radius); // Same radius as videplayer
  overflow: hidden; /* Add overflow property */
`;

const AnimeInfoContainer = styled.div`
  border-radius: var(--global-border-radius);
  margin-top: 0.8rem;
  padding: 0.6rem;
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  display: flex;
  align-items: center;
  flex-direction: row;
  align-items: flex-start;
`;

const AnimeInfoText = styled.div`
  text-align: left;
  line-height: 1rem;

  p {
    margin-top: 0rem; /* Reset margin */
  }
  .episode-name {
    line-height: 1.6rem;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
`;

const AnimeInfoContainer2 = styled.div`
  border-radius: var(--global-border-radius);
  margin-top: 0.8rem;
  padding: 0.6rem;
  background-color: var(--global-secondary-bg);
  color: var(--global-text);
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
`;

const AnimeRecommendations = styled.div`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;
  padding: 0.6rem;
`;

const AnimeRelations = styled.div`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;
  padding: 0.6rem;
`;

const AnimeInfoImage = styled.img`
  border-radius: var(--global-border-radius);
  max-height: 150px;
  margin-right: 1rem;
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
  max-width: 150px;
  gap: 10px;
  padding: 0.6rem;
`;

const CharacterImages = styled.img`
  max-height: 150px;
  height: auto;
  border-radius: var(--global-border-radius);
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
  overflow: hidden;
  position: relative;
  width: 50%; // Default to full width to maintain responsiveness
  height: auto; // Attempt to maintain aspect ratio based on width
  border: none; // Remove quotation marks from "none"
  @media (max-width: 1000px) {
    aspect-ratio: 16/9; /* 16:9 aspect ratio (change as needed) */
    width: 100%; // Ensure full width on larger screens
    height: 100%;
  }
`;

const IframeTrailer = styled.iframe`
  aspect-ratio: 16/9; /* 16:9 aspect ratio (change as needed) */
  position: relative;
  border: none; // Remove quotation marks from "none"
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @media (max-width: 1000px) {
    width: 100%; // Ensure full width on larger screens
    height: 100%;
  }
`;

const EpisodeListContainer = styled.div`
  width: 100%;

  @media (min-width: 1000px) {
    aspect-ratio: 2 / 3;
    flex: 1 1 500px;
    max-height: 100%; // Ensures it doesn't exceed the parent's height
  }
`;

const GoToHomePageButton = styled.a`
  position: absolute;
  color: black;
  border-radius: var(--global-border-radius);
  background-color: var(--primary-accent-bg);
  margin-top: 1rem;
  padding: 0.7rem 0.8rem;
  transform: translate(-50%, -50%) scaleX(1.1);
  transition: transform 0.2s ease-in-out;
  text-decoration: none; /* Remove underline */

  &:hover {
    /* color: var(--primary-accent-bg); */
    transform: translate(-50%, -50%) scaleX(1.1) scale(1.1);
  }
`;

interface Episode {
  id: string;
  number: number;
  title: string;
  image: string;
}

interface CurrentEpisode {
  id: string;
  number: number;
  image: string;
}

const Watch: React.FC = () => {
  const { animeId, animeTitle, episodeNumber } = useParams<{
    animeId: string;
    animeTitle?: string;
    episodeNumber?: string;
  }>();
  const navigate = useNavigate();
  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<string>("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<CurrentEpisode>({
    id: "0",
    number: 1,
    image: "",
  });
  const [animeInfo, setAnimeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEpisodeChanging, setIsEpisodeChanging] = useState(false);
  const [showNoEpisodesMessage, setShowNoEpisodesMessage] = useState(false);

  const [showTrailer, setShowTrailer] = useState(false);

  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInfo = async () => {
      if (!animeId) {
        console.error("Anime ID is null.");
        setLoading(false);
        return;
      }

      try {
        const info = await fetchAnimeInfo(animeId);
        if (isMounted) {
          setAnimeInfo(info);
          // Do not set loading to false here to allow for independent loading states
        }
      } catch (error) {
        console.error("Failed to fetch anime info:", error);
        if (isMounted) setLoading(false); // Set loading false only on error to prevent early termination of loading state
      }
    };

    fetchInfo();

    return () => {
      isMounted = false;
    };
  }, [animeId]); // Depends only on animeId
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!animeId) return;

      try {
        const animeData = await fetchAnimeInfo2(animeId);
        if (isMounted && animeData) {
          const transformedEpisodes = animeData.map((ep: Episode) => ({
            id: ep.id,
            number: ep.number,
            title: ep.title,
            image: ep.image,
          }));

          setEpisodes(transformedEpisodes);

          // Determine the episode to navigate to
          let navigateToEpisode = transformedEpisodes[0]; // Default to the first episode

          if (animeTitle && episodeNumber) {
            const episodeId = `${animeTitle}-episode-${episodeNumber}`;
            const matchingEpisode = transformedEpisodes.find(
              (ep: any) => ep.id === episodeId
            );
            if (matchingEpisode) {
              setCurrentEpisode({
                id: matchingEpisode.id,
                number: matchingEpisode.number,
                image: matchingEpisode.image,
              });
              navigateToEpisode = matchingEpisode;
            } else {
              navigate(`/watch/${animeId}`, { replace: true });
            }
          } else {
            let savedEpisodeData = localStorage.getItem(
              LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId
            );
            let savedEpisode = savedEpisodeData
              ? JSON.parse(savedEpisodeData)
              : null;

            if (savedEpisode && savedEpisode.number) {
              const foundEpisode = transformedEpisodes.find(
                (ep: any) => ep.number === savedEpisode.number
              );
              if (foundEpisode) {
                setCurrentEpisode({
                  id: foundEpisode.id,
                  number: foundEpisode.number,
                  image: foundEpisode.image,
                });
                navigateToEpisode = foundEpisode;
              }
            } else {
              // Default to the first episode if no saved data
              setCurrentEpisode({
                id: navigateToEpisode.id,
                number: navigateToEpisode.number,
                image: navigateToEpisode.image,
              });
            }
          }

          // Update URL if needed (for uncached anime or when defaulting to the first/saved episode)
          if (isMounted && navigateToEpisode) {
            const newAnimeTitle = navigateToEpisode.id.split("-episode")[0];
            navigate(
              `/watch/${animeId}/${newAnimeTitle}/${navigateToEpisode.number}`,
              { replace: true }
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch additional anime data:", error);
      } finally {
        if (isMounted) setLoading(false); // End loading state when data fetching is complete or fails
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [animeId, animeTitle, episodeNumber, navigate]);

  // Right after your existing useEffect hooks
  useEffect(() => {
    // Automatically show the "No episodes found" message if loading is done and no episodes are available
    if (!loading && episodes.length === 0) {
      setShowNoEpisodesMessage(true);
    } else {
      setShowNoEpisodesMessage(false);
    }
  }, [loading, episodes]); // This useEffect depends on the loading and episodes states

  useEffect(() => {
    const updateBackgroundImage = () => {
      const episodeImage = currentEpisode.image;
      const bannerImage = animeInfo?.cover;

      if (episodeImage && episodeImage !== animeInfo.image) {
        const img = new Image();
        img.onload = () => {
          if (img.width > 500) {
            setSelectedBackgroundImage(episodeImage);
          } else {
            setSelectedBackgroundImage(bannerImage);
          }
        };
        img.onerror = () => {
          // Fallback in case of an error loading the episode image
          setSelectedBackgroundImage(bannerImage);
        };
        img.src = episodeImage;
      } else {
        // If no episode image is available or it's the same as animeInfo image, use the banner image
        setSelectedBackgroundImage(bannerImage);
      }
    };

    if (animeInfo && currentEpisode.id !== "0") {
      // Check if animeInfo is loaded and a current episode is selected
      updateBackgroundImage();
    }
  }, [animeInfo, currentEpisode]); // Depend on animeInfo and currentEpisode

  const handleEpisodeSelect = useCallback(
    async (selectedEpisode: Episode) => {
      setIsEpisodeChanging(true);
      // Ensure animeTitle is extracted correctly if needed here, or use selectedEpisode.title directly
      const animeTitle = selectedEpisode.id.split("-episode")[0];

      setCurrentEpisode({
        id: selectedEpisode.id,
        number: selectedEpisode.number,
        image: selectedEpisode.image,
      });

      // Update last watched episode, ensure title is not null here
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + animeId,
        JSON.stringify({
          id: selectedEpisode.id,
          title: selectedEpisode.title, // Make sure this is correctly set
          number: selectedEpisode.number,
        })
      );

      // Update watched episodes list
      updateWatchedEpisodes(selectedEpisode);

      // Use title in navigation if necessary. Here, we're assuming animeTitle is needed in the URL, adjust as necessary.
      navigate(
        `/watch/${animeId}/${encodeURI(animeTitle)}/${selectedEpisode.number}`,
        {
          replace: true,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate delay

      setIsEpisodeChanging(false);
    },
    [animeId, navigate]
  );
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

  // Function to toggle the description expanded state
  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };
  useEffect(() => {
    if (animeInfo) {
      document.title = "Miruro - " + animeInfo.title.english;
    } else {
      document.title = "Miruro";
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if the target element is an input of type "text" or "search"
      const isSearchBox =
        event.target instanceof HTMLInputElement &&
        (event.target.type === "text" || event.target.type === "search");

      if (event.code === "Space" && !isSearchBox) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [animeInfo]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!episodes || episodes.length === 0) {
        setShowNoEpisodesMessage(true);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [loading, episodes]);

  const removeHTMLTags = (description: string): string => {
    return description.replace(/<[^>]+>/g, "");
  };

  if (showNoEpisodesMessage) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "10rem",
          marginBottom: "10rem",
        }}
      >
        <h2>No episodes found :(</h2>
        <GoToHomePageButton href="/home">HomePage</GoToHomePageButton>
      </div>
    );
  }

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
    const formattedDate = `${monthNames[date.month - 1]} ${date.day}, ${
      date.year
    }`;
    return formattedDate;
  }

  const updateWatchedEpisodes = (episode: Episode) => {
    // Retrieve the existing watched episodes array
    const watchedEpisodesJson = localStorage.getItem(
      LOCAL_STORAGE_KEYS.WATCHED_EPISODES + animeId
    );
    const watchedEpisodes: Episode[] = watchedEpisodesJson
      ? JSON.parse(watchedEpisodesJson)
      : [];

    // Add the current episode to the array if it's not already included
    if (!watchedEpisodes.some((ep) => ep.id === episode.id)) {
      watchedEpisodes.push(episode);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.WATCHED_EPISODES + animeId,
        JSON.stringify(watchedEpisodes)
      );
    }
  };

  return (
    <WatchContainer>
      <VideoPlayerContainer>
        <VideoPlayerImageWrapper>
          <VideoPlayer
            episodeId={currentEpisode.id}
            bannerImage={selectedBackgroundImage} // Use the determined image
            isEpisodeChanging={isEpisodeChanging}
          />
        </VideoPlayerImageWrapper>
        {animeInfo && (
          <AnimeInfoContainer>
            <AnimeInfoImage src={animeInfo.image} alt="Anime Title Image" />
            <AnimeInfoText>
              <p className="episode-name">
                {episodes.find((episode) => episode.id === currentEpisode.id)
                  ?.title || `Episode ${currentEpisode.number}`}
              </p>
              <p>
                <strong>{animeInfo.title.english}</strong>
              </p>
              <p>
                Status: <strong>{animeInfo.status}</strong>
              </p>
              <p>
                Year:{" "}
                <strong>
                  {animeInfo.releaseDate ? animeInfo.releaseDate : "Unknown"}
                </strong>
              </p>
              <p>
                Rating: <strong>{animeInfo.rating / 10}</strong>
              </p>
            </AnimeInfoText>
          </AnimeInfoContainer>
        )}
        {animeInfo && (
          <AnimeInfoContainer2>
            <AnimeInfoText>
              <p>
                Genres: <strong>{animeInfo.genres.join(", ")}</strong>
              </p>
              <p>
                Date aired:{" "}
                <strong>
                  {getDateString(animeInfo.startDate)}
                  {animeInfo.endDate
                    ? ` to ${
                        animeInfo.endDate.month && animeInfo.endDate.year
                          ? getDateString(animeInfo.endDate)
                          : "?"
                      }`
                    : animeInfo.status === "Ongoing"
                    ? ""
                    : " to ?"}
                </strong>
              </p>

              {/* <p>
                <strong>Start Date: </strong>
                {animeInfo.startDate.month}-{animeInfo.startDate.year}
                <strong> || End Date: </strong>
                {animeInfo.endDate?.month && animeInfo.endDate?.year
                  ? `${animeInfo.endDate.month}-${animeInfo.endDate.year}`
                  : "Ongoing"}
              </p> */}
              <p>
                Studios: <strong>{animeInfo.studios}</strong>
              </p>
              <p>
                <DescriptionText>
                  <strong>Description: </strong>
                  {isDescriptionExpanded
                    ? removeHTMLTags(animeInfo.description || "")
                    : `${removeHTMLTags(animeInfo.description || "").substring(
                        0,
                        300
                      )}...`}
                  <button
                    onClick={toggleDescription}
                    style={{
                      backgroundColor: "var(--primary-accent-bg)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--global-border-radius)",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      outline: "none",
                    }}
                  >
                    {isDescriptionExpanded ? "Show Less" : "Show More"}
                  </button>
                </DescriptionText>
                {animeInfo.trailer && (
                  <button
                    onClick={toggleTrailer}
                    style={{
                      padding: "0.5rem 0.6rem",
                      backgroundColor: "var(--primary-accent-bg)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--global-border-radius)",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      outline: "none",
                    }}
                  >
                    {showTrailer ? "Hide Trailer" : "Show Trailer"}
                  </button>
                )}
                {showTrailer && (
                  <VideoTrailer>
                    <IframeTrailer
                      src={`https://www.youtube.com/embed/${animeInfo.trailer.id}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </VideoTrailer>
                )}
                <br></br>
                <br></br>
                {animeInfo &&
                  animeInfo.relations.filter((relation: any) =>
                    ["OVA", "SPECIAL", "TV", "MOVIE", "ONA"].includes(
                      relation.type
                    )
                  ).length > 0 && (
                    <>
                      <strong>Seasons/Related: </strong>
                      <AnimeRelations>
                        <CardGrid
                          animeData={animeInfo.relations.filter(
                            (relation: any) =>
                              ["OVA", "SPECIAL", "TV", "MOVIE", "ONA"].includes(
                                relation.type
                              )
                          )}
                          totalPages={0}
                          hasNextPage={false}
                        />
                      </AnimeRelations>
                    </>
                  )}

                <br></br>
                {animeInfo &&
                  animeInfo.recommendations.filter((recommendation: any) =>
                    ["OVA", "SPECIAL", "TV", "MOVIE", "ONA"].includes(
                      recommendation.type
                    )
                  ).length > 0 && (
                    <>
                      <strong>Recommendations: </strong>
                      <AnimeRecommendations>
                        <CardGrid
                          animeData={animeInfo.recommendations.filter(
                            (recommendation: any) =>
                              ["OVA", "SPECIAL", "TV", "MOVIE", "ONA"].includes(
                                recommendation.type
                              )
                          )}
                          totalPages={0}
                          hasNextPage={false}
                        />
                      </AnimeRecommendations>
                    </>
                  )}

                <br></br>
                <br></br>
                <strong>Characters: </strong>
                <AnimeCharacterContainer>
                  {animeInfo.characters
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
              </p>
            </AnimeInfoText>
          </AnimeInfoContainer2>
        )}
      </VideoPlayerContainer>
      <EpisodeListContainer>
        <EpisodeList
          animeId={animeId}
          episodes={episodes}
          selectedEpisodeId={currentEpisode.id}
          onEpisodeSelect={(episodeId: string) => {
            const episode = episodes.find((e) => e.id === episodeId);
            if (episode) {
              handleEpisodeSelect(episode);
            }
          }}
        />
      </EpisodeListContainer>
    </WatchContainer>
  );
};

export default Watch;
