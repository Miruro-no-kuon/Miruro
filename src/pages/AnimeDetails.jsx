import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import AnimeDetailsSkeleton from "../components/Skeletons/AnimeDetailsSkeleton";
import useWindowDimensions from "../hooks/useWindowDimensions";
import EpisodeLinksList from "../components/EpisodeLinks/EpisodeLinksList";

function AnimeDetails() {
  let slug = useParams().slug;
  const [animeDetails, setAnimeDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const [localStorageDetails, setLocalStorageDetails] = useState(0);

  // Define the stripHtmlTags function here
  function stripHtmlTags(htmlString) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText;
  }

  useEffect(() => {
    async function getAnimeDetails() {
      setLoading(true);
      setExpanded(false);
      window.scrollTo(0, 0);
      try {
        // Make a GET request to the provided API
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}meta/anilist/info/${slug}?provider=gogoanime`
        );

        setLoading(false);

        // Check if the response data exists and contains the required fields
        if (response.data && response.data.title) {
          const data = response.data;
          setAnimeDetails(data);
          getLocalStorage(data);
        } else {
          // Handle the case where response data is empty or lacks required fields
          console.error("No data found for the given slug:", slug);
          // You might want to navigate to an error page or show a message to the user.
        }
      } catch (error) {
        // Handle the error
        console.error("Error fetching anime details:", error);
        setLoading(false);
      }
    }
    getAnimeDetails();
  }, [slug]);

  function readMoreHandler() {
    setExpanded(!expanded);
  }

  function getLocalStorage(animeDetails) {
    if (localStorage.getItem("Animes")) {
      let lsData = localStorage.getItem("Animes");
      lsData = JSON.parse(lsData);

      let index = lsData.Names.findIndex(
        (i) => i.name === animeDetails.title.english
      );

      if (index !== -1) {
        setLocalStorageDetails(lsData.Names[index].currentEpisode);
      }
    }
  }

  return (
    <div>
      {loading && <AnimeDetailsSkeleton />}
      {!loading && (
        <Content>
          {animeDetails.title && (
            <div>
              <Banner
                src={
                  animeDetails.cover !== animeDetails.image
                    ? animeDetails.cover
                    : "https://cdn.discordapp.com/attachments/985501610455224389/1041877819589927014/Miruro_Public_Preview.png?ex=65404f55&is=652dda55&hm=d9cf0985dbbea351c30d1f647046b36d3b343705f29fb066c5cf9b9f8dfd06b3"
                }
                alt=""
              />
              <ContentWrapper>
                <Poster>
                  <img className="card-img" src={animeDetails.image} alt="" />
                  {localStorageDetails !== 0 &&
                  animeDetails.episodes &&
                  animeDetails.episodes.length > 0 ? (
                    <Button to={"/watch/" + animeDetails.episodes[0].id}>
                      EP - {localStorageDetails}
                    </Button>
                  ) : (
                    <Button
                      className="details-button"
                      to={"/watch/" + animeDetails.episodes[0].id}
                    >
                      Watch Now
                    </Button>
                  )}
                </Poster>
                <div>
                  <h1>{animeDetails.title.english}</h1>
                  <p>
                    <span>Type: </span>
                    {animeDetails.type}
                  </p>
                  {width <= 600 && expanded && (
                    <p>
                      <span>Plot Summary: </span>
                      {stripHtmlTags(animeDetails.description)}
                      <button onClick={() => readMoreHandler()}>
                        read less
                      </button>
                    </p>
                  )}
                  {width <= 600 && !expanded && (
                    <p>
                      <span>Plot Summary: </span>
                      {stripHtmlTags(animeDetails.description).substring(
                        0,
                        200
                      ) + "... "}
                      <button onClick={() => readMoreHandler()}>
                        read more
                      </button>
                    </p>
                  )}
                  {width > 600 && (
                    <p>
                      <span>Plot Summary: </span>
                      {stripHtmlTags(animeDetails.description)}
                    </p>
                  )}

                  {/* Rest of your code remains the same */}
                </div>
              </ContentWrapper>
              {animeDetails.episodes && animeDetails.episodes.length > 1 && (
                <EpisodeLinksList
                  episodeArray={animeDetails.episodes}
                  episodeNum={parseInt(localStorageDetails)}
                  state={false}
                />
              )}
            </div>
          )}
        </Content>
      )}
    </div>
  );
}

const Content = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  position: relative;

  @media screen and (max-width: 1000px) {
    margin: 1rem;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 3rem 0 3rem;
  display: flex;

  div > * {
    margin-bottom: 0.6rem;
  }

  div {
    margin: 1rem;
    font-size: 1rem;
    color: #808080;
    font-family: "Gilroy-Regular", sans-serif;
    span {
      font-family: "Gilroy-Bold", sans-serif;
      color: #ffffff;
    }
    p {
      text-align: justify;
    }
    h1 {
      font-family: "Gilroy-Bold", sans-serif;
      font-weight: normal;
      color: #ffffff;
    }
    button {
      display: none;
    }
  }

  @media screen and (max-width: 1000px) {
    display: flex;
    flex-direction: column-reverse;
    padding: 0;
    div {
      margin: 1rem;
      margin-bottom: 0.2rem;
      h1 {
        font-size: 1.6rem;
      }
      p {
        font-size: 1rem;
      }
      button {
        display: inline;
        border: none;
        outline: none;
        background-color: transparent;
        text-decoration: underline;
        font-family: "Gilroy-Bold", sans-serif;
        font-size: 1rem;
        color: #ffffff;
      }
    }
  }
`;

const Poster = styled.div`
  display: flex;
  flex-direction: column;
  img {
    width: 220px;
    height: 300px;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    position: relative;
    top: -20%;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
  }
  @media screen and (max-width: 1000px) {
    img {
      display: none;
    }
  }
`;

const Button = styled(Link)`
  font-size: 1.3rem;
  padding: 1rem 3.4rem;
  text-align: center;
  text-decoration: none;
  color: rgb(208, 204, 197);
  background-color: rgb(24, 26, 27);
  font-family: "Gilroy-Bold", sans-serif;
  border-radius: 0.4rem;
  position: relative;
  top: -25%;
  white-space: nowrap;
  transition: 0.2s;

  :hover {
    transform: scale(0.95);
    background-color: rgb(155, 0, 59);
    color: rgb(255, 255, 255);
  }

  @media screen and (max-width: 1000px) {
    display: block;
    width: 100%;
  }
`;

const Banner = styled.img`
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-radius: 0.7rem;

  @media screen and (max-width: 1000px) {
    height: 13rem;
    border-radius: 0.5rem;
  }
`;

export default AnimeDetails;
