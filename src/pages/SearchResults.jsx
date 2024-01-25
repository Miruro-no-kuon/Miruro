import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import CardGrid from "../components/CardItem/CardGrid";
import { fetchAnimeData } from "../hooks/useApi";
import CardSkeleton from "../components/Skeletons/CardSkeleton";

const Container = styled.div`
  /* Add any styling for the container here */
`;

const GridContainer = styled.div`
  margin: 0 auto;
  display: grid;
  position: relative;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  grid-template-rows: auto;
  gap: 1.25rem;

  transition: grid-template-columns 0.5s ease-in-out;
`;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [animeData, setAnimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const delayTimeout = useRef(null);

  // Use a state to track the last cached page
  const [lastCachedPage, setLastCachedPage] = useState(0);

  // Reset page to 1 when the query changes
  useEffect(() => {
    setPage(1);
    setLastCachedPage(0); // Reset last cached page as well
  }, [query]);

  const initiateFetchAnimeData = async () => {
    let fromCache = true; // Flag to track if data comes from cache

    setIsLoading(true);
    try {
      const fetchedData = await fetchAnimeData(query, page, 12, (isCached) => {
        // Ensure `perPage` is correctly passed
        fromCache = isCached;
      });

      if (page === 1) {
        setAnimeData(fetchedData.results);
        // Preload page 2 when page 1 is loaded
        preloadNextPage(page + 1);
      } else {
        setAnimeData((prevData) => [...prevData, ...fetchedData.results]);
        // Preload the next page when a page is loaded and not from cache
        if (!fromCache) {
          preloadNextPage(page + 1);
        }
      }

      setTotalPages(fetchedData.totalPages);
      setHasNextPage(fetchedData.hasNextPage);

      if (fromCache) {
        setIsLoading(false); // Instantly stop loading if data from cache
      } else {
        setTimeout(() => setIsLoading(false), 600); // Apply delay if data from network
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setIsLoading(false);
    }
  };

  // Handle the "Load More" button click event
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    // Preload the next page when the "Load More" button is clicked
    preloadNextPage(page + 2);
  };

  // Function to preload the next page
  const preloadNextPage = (nextPage) => {
    if (nextPage <= totalPages && nextPage > lastCachedPage) {
      fetchAnimeData(query, nextPage, 12, (isCached) => {
        if (isCached) {
          setLastCachedPage(nextPage);
          preloadNextPage(nextPage + 1);
        }
      });
    }
  };

  useEffect(() => {
    clearTimeout(delayTimeout.current);
    delayTimeout.current = setTimeout(() => {
      initiateFetchAnimeData();
    }, 400);

    return () => clearTimeout(delayTimeout.current);
  }, [query, page]);

  // Create an array of loading states for each card
  const loadingStates = Array.from(
    { length: animeData.length },
    () => isLoading
  );

  return (
    <Container>
      {isLoading ? (
        <GridContainer>
          {Array.from({ length: 12 }).map((_, index) => (
            <CardSkeleton key={index} isLoading={true} />
          ))}
        </GridContainer>
      ) : (
        <CardGrid
          animeData={animeData}
          loadingStates={loadingStates}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          onLoadMore={handleLoadMore}
        />
      )}
    </Container>
  );
};

export default SearchResults;
