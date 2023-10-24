import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Carousel from "../components/Home/Carousel";
import axios from "axios";
import { Helmet } from "react-helmet";
import AnimeCards from "../components/Home/AnimeCards";
import HomeSkeleton from "../components/Skeletons/CarouselSkeleton";
import WatchingEpisodes from "../components/Home/WatchingEpisodes";

function Home({ changeMetaArr }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState([]);

  const title = "Miruro | Watch The Best Quality Anime Online";
  const content = `Miruro. An ad-free anime streaming site. Catch your favorite shows and movies right here! 
    Help us by contributing to the project on GitHub.`;
  const image =
    "https://cdn.discordapp.com/attachments/985501610455224389/1041832015105884241/logo512.png";

  useEffect(() => {
    changeMetaArr("title", title);
  });

  useEffect(() => {
    getImages();
  }, []);

  async function getImages() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}meta/anilist/trending`
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
              <span>Anime New</span> Seasons
            </Heading>
            <div className="vall-button">
              <Links to="new-season">View All</Links>
            </div>
          </HeadingWrapper>
          <AnimeCards criteria="meta/anilist/new-season" />
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
          <AnimeCards criteria="anime/gogoanime/recent-episodes" />
        </div>
      </HomeDiv>
    </div>
  );
}

const Links = styled(Link)`
  color: rgba(255, 255, 255, 1);
  background: rgb(19, 21, 22);
  padding: 0.4rem 0.5rem 0.4rem 0.5rem;
  border-radius: 5px;
  border: 1px solid rgba(48, 52, 54, 0.3);
  font-size: 1.1rem;
  font-family: "Gilroy-Medium", sans-serif;
  text-decoration: none;
  transition: 0.2s;

  @media screen and (max-width: 600px) {
    color: #ffffff;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
  }
`;

const HomeDiv = styled.div`
  margin: 1.5rem 5rem 1rem 5rem;
  @media screen and (max-width: 600px) {
    margin: 1rem 1rem 0rem 1rem;
  }
  .vall-button:hover {
    transform: scale(1.05);
    transition: 0.2s;
  }
`;

const HomeHeading = styled.p`
  font-size: 2.3rem;
  color: #ffffff;
  font-family: "Gilroy-Light", sans-serif;

  span {
    font-family: "Gilroy-Bold", sans-serif;
  }
  margin-bottom: 1rem;

  @media screen and (max-width: 600px) {
    font-size: 1.7rem;
  }
`;

const Heading = styled.p`
  font-size: 1.8rem;
  color: #ffffff;
  font-family: "Gilroy-Light", sans-serif;

  span {
    font-family: "Gilroy-Bold", sans-serif;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.5rem;
  }
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
