import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import SearchResultsSkeleton from "../components/Skeletons/SearchResultsSkeleton";
import axios from "axios";

function RecentEpisodesAnime() {
  // State variables
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedAllPages, setLoadedAllPages] = useState(false);

  // Ref for intersection observer
  const bottomBoundaryRef = useRef(null);

  // Scroll tracking state
  const [hasScrolled, setHasScrolled] = useState(false);

  // Use effect to handle initial scroll
  useEffect(() => {
    if (!hasScrolled) {
      window.scrollTo(0, 0);
      setHasScrolled(true);
    }
  }, [hasScrolled]);

  // Use effect to fetch initial anime data
  useEffect(() => {
    getAnime(1);
  }, []);

  // Use effect to fetch more anime data when scrolling
  useEffect(() => {
    if (!isFetching || currentPage >= 5 || loadedAllPages) return;
    getAnime(currentPage + 1);
  }, [isFetching, currentPage, loadedAllPages]);

  // Use effect to observe scrolling for triggering data fetching
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (bottomBoundaryRef.current) {
      observer.observe(bottomBoundaryRef.current);
    }

    return () => {
      if (bottomBoundaryRef.current) {
        observer.unobserve(bottomBoundaryRef.current);
      }
    };
  }, [bottomBoundaryRef]);

  // Callback to handle intersection observer event
  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setIsFetching(true);
    }
  };

  // Function to fetch anime data
  // Modify the getAnime function to filter out results with currentEpisode !== null
  async function getAnime(page) {
    try {
      // Get the current year
      const currentYear = new Date().getFullYear();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}meta/anilist/advanced-search`,
        {
          params: {
            sort: ["SCORE_DESC"],
            status: "RELEASING",
            year: currentYear,
            page: page,
            perPage: 50,
          },
        }
      );

      if (response.data && response.data.results) {
        // Filter out results with currentEpisode !== null
        const filteredResults = response.data.results.filter(
          (item) => item.currentEpisode !== null
        );

        setAnimeDetails((prevData) => [
          ...prevData,
          ...filteredResults.filter((item) =>
            prevData.every((prevItem) => prevItem.id !== item.id)
          ),
        ]);
        setCurrentPage(page);
      } else {
        console.error("Invalid response structure:", response.data);
      }

      setLoading(false);
      setIsFetching(false);

      if (currentPage >= 4) {
        setHasMore(false);
        setLoadedAllPages(true);
      }
    } catch (error) {
      console.error("Error fetching anime:", error);
      setLoading(false);
      setIsFetching(false);
    }
  }

  return (
    <div>
      {loading && <SearchResultsSkeleton name="Recent Episodes Anime" />}
      <Parent>
        <Heading>
          <span>Recent Episodes Anime</span> Results
        </Heading>
        <CardWrapper>
          {animeDetails.map((item, i) => (
            <Wrapper to={`/search/${item.title.romaji}`} key={i}>
              <img className="card-img" src={item.image} alt="" />
              <p>
                {item.title.english ||
                  item.title.romaji ||
                  item.title.native ||
                  item.title.userPreferred ||
                  item.title}
              </p>
              <p>Episode: {item.currentEpisode || "Unknown"}</p>
              {/* The line above displays the episode number or "Unknown Episode Number" if not available */}
            </Wrapper>
          ))}
        </CardWrapper>
      </Parent>
      {hasMore && !loadedAllPages && <div ref={bottomBoundaryRef}></div>}
      {isFetching && hasMore && !loadedAllPages && (
        <SearchResultsSkeleton name="Loading" />
      )}
    </div>
  );
}

// Styled components

const Parent = styled.div`
  margin: 2rem 5rem 2rem 5rem;

  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-gap: 1rem;
  grid-row-gap: 1.5rem;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 120px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, 110px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 380px) {
    grid-template-columns: repeat(auto-fill, 100px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }
`;

const CommonImageStyles = css`
  width: 160px;
  height: 235px;
  border-radius: 0.4rem;
  object-fit: cover;

  @media screen and (max-width: 600px) {
    width: 120px;
    height: 180px;
    border-radius: 0.3rem;
  }

  @media screen and (max-width: 400px) {
    width: 110px;
    height: 170px;
  }

  @media screen and (max-width: 380px) {
    width: 100px;
    height: 160px;
  }
`;

const Wrapper = styled(Link)`
  text-decoration: none;
  img {
    ${CommonImageStyles}
  }

  p {
    color: #ffffff;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
    text-decoration: none;
    max-width: 160px;

    @media screen and (max-width: 380px) {
      width: 100px;
      font-size: 0.9rem;
    }
  }
`;

const Heading = styled.p`
  font-size: 1.8rem;
  color: #fff;
  font-family: "Gilroy-Light", sans-serif;
  margin-bottom: 2rem;

  span {
    font-family: "Gilroy-Bold", sans-serif;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
`;

export default RecentEpisodesAnime;
