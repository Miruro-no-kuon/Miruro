import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Carousel from "../components/Home/Carousel";
import CardGrid, { StyledCardGrid } from "../components/Cards/CardGrid";
import CarouselSlideSkeleton from "../components/Skeletons/CarouselSlideSkeleton";
import CardSkeleton from "../components/Skeletons/CardSkeleton";
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchTopAiringAnime,
} from "../hooks/useApi";

const Home = () => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [error, setError] = useState(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingTopAiringAnime, setLoadingTopAiringAnime] = useState(true);
  const [loadingPopularAnime, setLoadingPopularAnime] = useState(true);

  const fetchData = async (fetchFunction, setState, setLoading) => {
    try {
      const data = await fetchFunction();
      if (data && data.results) {
        setState(data.results);
      }
    } catch (error) {
      setError((prevError) =>
        prevError ? `${prevError}, ${error.message}` : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(fetchTrendingAnime, setTrendingAnime, setLoadingTrending);
    fetchData(fetchPopularAnime, setPopularAnime, setLoadingPopularAnime);
    fetchData(fetchTopAiringAnime, setTopAiringAnime, setLoadingTopAiringAnime);
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <section>
        <h2>Trending Anime</h2>
        {loadingTrending ? (
          <CarouselSlideSkeleton />
        ) : (
          trendingAnime.length > 0 && <Carousel data={trendingAnime} />
        )}
      </section>
      <section>
        <h2>Popular Anime</h2>
        {loadingPopularAnime ? (
          <StyledCardGrid>
            {Array.from({ length: popularAnime.length || 16 }, (_, index) => (
              <CardSkeleton key={index} isLoading={true} />
            ))}
          </StyledCardGrid>
        ) : (
          popularAnime.length > 0 && (
            <CardGrid title="Popular Anime" animeData={popularAnime} />
          )
        )}
      </section>
      <section>
        <h2>Top Airing Anime</h2>
        {loadingTopAiringAnime ? (
          <StyledCardGrid>
            {Array.from(
              { length: loadingTopAiringAnime.length || 16 },
              (_, index) => (
                <CardSkeleton key={index} isLoading={true} />
              )
            )}
          </StyledCardGrid>
        ) : (
          topAiringAnime.length > 0 && (
            <CardGrid title="Top Airing Anime" animeData={topAiringAnime} />
          )
        )}
      </section>
    </div>
  );
};

export default Home;
