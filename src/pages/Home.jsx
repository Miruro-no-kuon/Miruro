import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Carousel from "../components/Home/Carousel";
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AnimeCards from "../components/Home/AnimeCards";
import HomeSkeleton from "../components/Skeletons/CarouselSkeleton";
import WatchingEpisodes from "../components/Home/WatchingEpisodes";

function Home({ changeMetaArr }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState([]);

  const title = "Miruro";
  const content = `Miruro. An ad-free anime streaming site. Catch your favorite shows and movies right here! 
    Help us by contributing to the project on GitHub.`;
  const image =
    "/src/assets/logo-tr.png";

  useEffect(() => {
    changeMetaArr("title", title);
  });

  useEffect(() => {
    getImages();
  }, []);

  async function getImages() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}meta/anilist/trending`
      );

      if (res.data && res.data.results) {
        const trendingAnime = res.data.results;
        setImages(trendingAnime);
      } else {
        console.error("Invalid response structure:", res.data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  }

  function checkSize() {
    let lsData = localStorage.getItem("Animes");
    lsData = JSON.parse(lsData);
    if (lsData.Names.length === 0) {
      return false;
    }
    return true;
  }

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{title}</title>
          <meta property="description" content={content} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={content} />
          <meta property="og:image" content={image} />
        </Helmet>
        <HomeDiv>
          <HomeHeading>
            <span>Recommended</span> to you
          </HomeHeading>
          {loading && <HomeSkeleton />}
          {!loading && <Carousel images={images} />}
          {localStorage.getItem("Animes") && checkSize() && (
            <div className="margin">
              <HeadingWrapper>
                <Heading>
                  <span>Continue</span> Watching
                </Heading>
              </HeadingWrapper>
              <WatchingEpisodes
                confirmRemove={confirmRemove}
                setConfirmRemove={setConfirmRemove}
              />
            </div>
          )}
          <div className="margin">
            <HeadingWrapper>
              <Heading>
                <span>All Time</span> Popular
              </Heading>
              <div className="vall-button">
                <Links to="popular">View All</Links>
              </div>
            </HeadingWrapper>
            <AnimeCards criteria="meta/anilist/popular" />
          </div>
          <div className="margin">
            <HeadingWrapper>
              <Heading>
                <span>Trending</span> Now
              </Heading>
              <div className="vall-button">
                <Links to="trending">View All</Links>
              </div>
            </HeadingWrapper>
            <AnimeCards criteria="meta/anilist/trending" />
          </div>
          <div className="margin">
            <HeadingWrapper>
              <Heading>
                <span>Top 100</span> Anime
              </Heading>
              <div className="vall-button">
                <Links to="top100">View All</Links>
              </div>
            </HeadingWrapper>
            <AnimeCards criteria="top/anime" />
          </div>
          <div className="margin">
            <HeadingWrapper>
              <Heading>
                <span>Popular Anime</span> Movies
              </Heading>
              <div className="vall-button">
                <Links to="movies">View All</Links>
              </div>
            </HeadingWrapper>
            <AnimeCards criteria="meta/anilist/advanced-search?sort[]=POPULARITY&format=MOVIE" />
          </div>
          <div className="margin">
            <HeadingWrapper>
              <Heading>
                <span>Recent</span> Episodes
              </Heading>
              <div className="vall-button">
                <Links to="recent-episodes">View All</Links>
              </div>
            </HeadingWrapper>
            <AnimeCards criteria="meta/anilist/advanced-search?sort[]=SCORE_DESC&status=RELEASING&year=2023" />
          </div>
        </HomeDiv>
      </div>
    </HelmetProvider>
  );
}

const Links = styled(Link)`
  color: rgba(255, 255, 255, 1);
  background: rgb(19, 21, 22);
  padding: 0.4rem 0.5rem;
  border-radius: 5px;
  border: 1px solid rgba(48, 52, 54, 0.3);
  font-size: 1.1rem;
  font-family: "Gilroy-Medium", sans-serif;
  text-decoration: none;
  transition: 0.2s;

  @media screen and (max-width: 600px) {
    color: #ffffff;
    font-size: 1rem;
  }
`;

const HomeDiv = styled.div`
  margin: 1.5rem 5rem 1rem 5rem;

  @media screen and (max-width: 600px) {
    margin: 1rem;
  }

  .vall-button {
    transition: 0.2s;
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const commonHeadingStyles = `
  font-family: "Gilroy-Light", sans-serif;
  color: #ffffff;

  @media screen and (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const HomeHeading = styled.p`
  font-size: 2.3rem;
  margin-bottom: 1rem;

  span {
    font-family: "Gilroy-Bold", sans-serif;
  }

  ${commonHeadingStyles}
`;

const Heading = styled.p`
  font-size: 1.8rem;

  span {
    font-family: "Gilroy-Bold", sans-serif;
  }

  ${commonHeadingStyles}
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media screen and (max-width: 600px) {
    margin-top: 1rem;
  }
`;

export default Home;
