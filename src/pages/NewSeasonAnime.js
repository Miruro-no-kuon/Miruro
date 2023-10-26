import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SearchResultsSkeleton from "../components/Skeletons/SearchResultsSkeleton";
import axios from "axios";

function NewSeasonAnime() {

  // State variables
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedAllPages, setLoadedAllPages] = useState(false);
  const bottomBoundaryRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Check if scrolling has not happened yet
    if (!hasScrolled) {
      window.scrollTo(0, 0);
      // Mark that scrolling has occurred by updating the state
      setHasScrolled(true);
    }
  }, [hasScrolled]);

  // Effect to fetch initial anime data
  useEffect(() => {
    getAnime(1);
  }, []);

  // Effect to fetch more anime data when scrolling
  useEffect(() => {
    if (!isFetching || currentPage >= 3 || loadedAllPages) return;

    getAnime(currentPage + 1);
  }, [isFetching, currentPage, loadedAllPages]);

  // Effect to observe scrolling for triggering data fetching
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
  async function getAnime(page) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}meta/anilist/new-season?page=${page}&perPage=30`
      );

      if (response.data && response.data.results) {
        setAnimeDetails((prevData) => [
          ...prevData,
          ...response.data.results.filter((item) =>
            prevData.every((prevItem) => prevItem.id !== item.id)
          ),
        ]);
        setCurrentPage(page);
      } else {
        console.error("Invalid response structure:", response.data);
      }

      setLoading(false);
      setIsFetching(false);

      if (currentPage >= 2) {
        setHasMore(false);
        setLoadedAllPages(true);
      }
    } catch (error) {
      console.error("Error fetching anime:", error);
      setLoading(false);
      setIsFetching(false);
    }
  }

  // JSX for rendering
  return (
    <div>
      {loading && <SearchResultsSkeleton name="New Seasons" />}
      <Parent>
        <Heading>
          <span>New Seasons</span> Results
        </Heading>
        <CardWrapper>
          {animeDetails.map((item, i) => (
            <Wrapper to={`/search/${item.title.romaji}`} key={i}>
              <img className="card-img" src={item.image} alt="" />
              <p>
                {item.title.romaji ||
                  item.title.english ||
                  item.title.native ||
                  item.title.userPreferred}
              </p>
              <p>{item.type || 'Unknown Type'}</p>
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

// ... styles for Parent component
const Parent = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

// ... styles for CardWrapper component
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

const Wrapper = styled(Link)`
  text-decoration: none;
  img {
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
  }

  p {
    color: #ffffff;
    font-size: 1rem;
    font-family: 'Gilroy-Medium', sans-serif;
    text-decoration: none;
    max-width: 160px;
    @media screen and (max-width: 380px) {
      width: 100px;
      font-size: 0.9rem;
    }
  }
`;

// ... styles for Links component
const Links = styled(Link)`
  text-decoration: none;
  img {
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
  }

  p {
    color: #fff;
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

// ... styles for Heading component
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

export default NewSeasonAnime;
