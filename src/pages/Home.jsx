import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Carousel from "../components/Home/Carousel";
import CardGrid from "../components/Cards/CardGrid";
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchTopAnime,
} from "../hooks/useApi";

const SimpleLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  max-width: 125rem;
  border-radius: 0.2rem;
`;

const SectionHeading = styled.h2`
  margin-top: 0;
  color: var(--global-text);
`;

const TabContainer = styled.div`
  border-radius: 0.2rem;
  width: 100%;
`;

const Tab = styled.button`
  background: transparent;
  margin: 0 1rem 0 0;
  padding: 0.5rem;
  border-radius: 0.2rem;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: var(--global-text);
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-accent-bg);
    transform-origin: left center;
    transform: scaleX(0);
    transition: transform 0.2s ease;
    transform: scaleX(
      ${({ $isActive }) => ($isActive ? 1 : 0)}
    ); /* Add this line */
  }

  &:hover::before,
  &:focus::before,
  &:active::before {
    transform: scaleX(1);
  }

  border-bottom: ${({ $isActive }) =>
    $isActive ? "2px solid transparent" : "none"};

  &:focus {
    outline: none;
  }
`;

const Section = styled.section`
  padding: 0rem;
  border-radius: 0.2rem;
`;

const Home = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, popular, top] = await Promise.all([
          fetchTrendingAnime(),
          fetchPopularAnime(),
          fetchTopAnime(),
        ]);

        setTrendingAnime(trending.results);
        setPopularAnime(popular.results);
        setTopAnime(top.results);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const renderCardGrid = (animeData) => (
    <Section>
      <CardGrid animeData={animeData} />
    </Section>
  );

  return (
    <SimpleLayout>
      {error && <p>Error: {error}</p>}
      <Carousel data={trendingAnime} />

      <TabContainer>
        <Tab
          $isActive={activeTab === "trending"}
          onClick={() => handleTabClick("trending")}
        >
          Trending Anime
        </Tab>
        <Tab
          $isActive={activeTab === "popular"}
          onClick={() => handleTabClick("popular")}
        >
          Popular Anime
        </Tab>
        <Tab
          $isActive={activeTab === "top"}
          onClick={() => handleTabClick("top")}
        >
          Top Anime
        </Tab>
      </TabContainer>

      {activeTab === "trending" && renderCardGrid(trendingAnime)}
      {activeTab === "popular" && renderCardGrid(popularAnime)}
      {activeTab === "top" && renderCardGrid(topAnime)}
    </SimpleLayout>
  );
};

export default Home;
