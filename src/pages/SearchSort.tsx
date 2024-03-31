import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import {
  CardGrid,
  StyledCardGrid, 
  fetchAdvancedSearch,
  CardSkeleton,
} from '../index';

const Container = styled.div`
  min-height: 65vh;
  @media (max-width: 1500px) {
    margin-left: 0rem;
    margin-right: 0rem;
  }
`;

const SearchSort = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [animeData, setAnimeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const delayTimeout = useRef<number | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = query ? `${query} - Miruro` : 'Miruro';
    return () => {
      document.title = previousTitle;
    };
  }, [animeData.length, query]);

  useEffect(() => {
    setPage(1);

    const scrollToTopWithDelay = () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 250);
    };

    scrollToTopWithDelay();
  }, [query]);

  const initiatefetchAdvancedSearch = async () => {
    setIsLoading(true);

    try {
      const fetchedData = await fetchAdvancedSearch(query, page, 20);

      if (page === 1) {
        setAnimeData(fetchedData.results);
      } else {
        setAnimeData((prevData) => [...prevData, ...fetchedData.results]);
      }

      setHasNextPage(fetchedData.hasNextPage);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => {
      return prevPage < 10 ? prevPage + 1 : prevPage;
    });
  };

  useEffect(() => {
    if (delayTimeout.current !== null)
      clearTimeout(delayTimeout.current as any);
    delayTimeout.current = window.setTimeout(() => {
      initiatefetchAdvancedSearch();
    }, 0) as any;

    return () => {
      if (delayTimeout.current !== null)
        clearTimeout(delayTimeout.current as any);
    };
  }, [query, page]);

  return (
    <Container>
      {isLoading && page === 1 ? (
        <StyledCardGrid>
          {Array.from({ length: 20 }).map((_, index) => (
            <CardSkeleton key={index} {...{ isLoading: true }} />
          ))}
        </StyledCardGrid>
      ) : (
        <CardGrid
          animeData={animeData}
          hasNextPage={hasNextPage && page < 10}
          onLoadMore={handleLoadMore}
        />
      )}
    </Container>
  );
};

export default SearchSort;
