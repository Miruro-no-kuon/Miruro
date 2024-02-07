import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import CardGrid from "../components/Cards/CardGrid";
import { StyledCardGrid } from "../components/Cards/CardGrid";
import { fetchAnimeData } from "../hooks/useApi";
import CardSkeleton from "../components/Skeletons/CardSkeleton";

const Container = styled.div`
  /* Add any styling for the container here */
`;

const Title = styled.h2`
  text-align: left;
  margin-bottom: 2rem;
  font-weight: 400;
`;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [animeData, setAnimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const delayTimeout = useRef(null);
  const lastCachedPage = useRef(0);
  const [loadingStates, setLoadingStates] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(1);
    lastCachedPage.current = 0;
  }, [query]);

  const initiateFetchAnimeData = async () => {
    setIsLoading(true);

    if (page > 1) {
      setLoadingStates((prev) => [
        ...prev,
        ...Array.from({ length: 20 }, () => true),
      ]);
    }

    try {
      const fetchedData = await fetchAnimeData(query, page, 20, (isCached) => {
        if (!isCached) {
          preloadNextPage(page + 1);
        }
      });

      if (page === 1) {
        setAnimeData(fetchedData.results);
        setLoadingStates(
          Array.from({ length: fetchedData.results.length }, () => false)
        );
        preloadNextPage(page + 1);
      } else {
        setAnimeData((prevData) => [...prevData, ...fetchedData.results]);
        setLoadingStates((prev) =>
          prev.map((state, index) => (index >= (page - 1) * 20 ? false : state))
        );
      }

      setTotalPages(fetchedData.totalPages);
      setHasNextPage(fetchedData.hasNextPage);
      setTotalResults(fetchedData.totalResults);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const preloadNextPage = (nextPage) => {
    if (
      nextPage <= totalPages &&
      nextPage > lastCachedPage.current &&
      hasNextPage
    ) {
      fetchAnimeData(query, nextPage, 25, (isCached) => {
        if (!isCached) {
          lastCachedPage.current = nextPage;
          preloadNextPage(nextPage + 1);
        }
      });
    }
  };

  useEffect(() => {
    clearTimeout(delayTimeout.current);
    delayTimeout.current = setTimeout(() => {
      initiateFetchAnimeData();
    }, 0);

    return () => clearTimeout(delayTimeout.current);
  }, [query, page]);

  return (
    <Container>
      {
        <Title>
          {animeData.length} Search Results found: <strong>{query}</strong>
        </Title>
      }
      {isLoading && page === 1 ? (
        <StyledCardGrid>
          {Array.from({ length: 20 }).map((_, index) => (
            <CardSkeleton key={index} isLoading={true} />
          ))}
        </StyledCardGrid>
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
