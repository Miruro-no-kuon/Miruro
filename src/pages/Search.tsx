import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import {
  SearchFilters,
  CardGrid,
  StyledCardGrid,
  fetchAdvancedSearch,
  SkeletonCard,
} from '../index';
import { Paging } from '../index';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1500px) {
    margin-left: 8rem;
    margin-right: 8rem;
    margin-top: 2rem;
  }
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = searchParams.get('sort');
  // Directly initialize state from URL parameters
  const initialQuery = searchParams.get('query') || '';
  // Adjusting initialization to ensure non-null values
  let initialSortDirection: 'DESC' | 'ASC' = 'DESC'; // Default to 'DESC'
  if (sortParam) {
    initialSortDirection = sortParam.endsWith('_DESC') ? 'DESC' : 'ASC';
  }
  const initialSortValue = sortParam
    ? sortParam.replace(/(_DESC|_ASC)$/, '')
    : 'POPULARITY_DESC';

  const initialSort = {
    value: initialSortValue,
    label:
      initialSortValue.replace('_DESC', '').charAt(0) +
      initialSortValue.replace('_DESC', '').slice(1).toLowerCase(),
  };
  const genresParam = searchParams.get('genres');
  const initialGenres = genresParam
    ? genresParam.split(',').map((value) => ({ value, label: value }))
    : [];

  const initialYear = {
    value: searchParams.get('year') || '',
    label: searchParams.get('year') || 'Any',
  };

  const initialSeason = {
    value: searchParams.get('season') || '',
    label: searchParams.get('season') || 'Any',
  };

  const initialFormat = {
    value: searchParams.get('format') || '',
    label: searchParams.get('format') || 'Any',
  };

  const initialStatus = {
    value: searchParams.get('status') || '',
    label: searchParams.get('status') || 'Any',
  };

  // State hooks
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedFormat, setSelectedFormat] = useState(initialFormat);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [sortDirection, setSortDirection] = useState<'DESC' | 'ASC'>(
    initialSortDirection,
  );

  //Other logic
  const [animeData, setAnimeData] = useState<Paging[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const delayTimeout = useRef<number | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${query} | Search Results`;
    return () => {
      document.title = previousTitle;
    };
  }, [query]);

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    params.set('query', query);
    if (selectedGenres.length > 0) {
      params.set('genres', selectedGenres.map((g) => g.value).join(','));
    }
    if (selectedYear.value) params.set('year', selectedYear.value);
    if (selectedSeason.value) params.set('season', selectedSeason.value);
    if (selectedFormat.value) params.set('format', selectedFormat.value);
    if (selectedStatus.value) params.set('status', selectedStatus.value);
    const sortBase = selectedSort.value.replace(/(_DESC|_ASC)$/, '');
    const sortParam =
      sortDirection === 'DESC' ? `${sortBase}_DESC` : `${sortBase}_ASC`;
    params.set('sort', sortParam);

    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    setPage(1);

    const scrollToTopWithDelay = () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 350);
    };

    scrollToTopWithDelay();
  }, [
    query,
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    selectedSort,
    sortDirection,
  ]);

  const initiateFetchAdvancedSearch = useCallback(async () => {
    setIsLoading(true);
    const sortBase = selectedSort.value.replace('_DESC', '');
    const sortParam = sortDirection === 'DESC' ? `${sortBase}_DESC` : sortBase;
    try {
      const fetchedData = await fetchAdvancedSearch(query, page, 17, {
        genres: selectedGenres.map((g) => g.value),
        year: selectedYear.value,
        season: selectedSeason.value,
        format: selectedFormat.value,
        status: selectedStatus.value,
        sort: [sortParam], // Ensure this is correctly formatted
      });
      setAnimeData(
        page === 1
          ? fetchedData.results
          : [...animeData, ...fetchedData.results],
      );
      setHasNextPage(fetchedData.hasNextPage);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    query,
    page,
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    selectedSort,
    sortDirection,
  ]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const newQuery = searchParams.get('query') || '';
    if (newQuery !== query) {
      setQuery(newQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    // Clear existing timeout to ensure no double fetches
    if (delayTimeout.current !== null) clearTimeout(delayTimeout.current);

    // Debounce to minimize fetches during rapid state changes
    delayTimeout.current = window.setTimeout(() => {
      initiateFetchAdvancedSearch();
    }, 0);

    // Cleanup timeout on unmount or before executing a new fetch
    return () => {
      if (delayTimeout.current !== null) clearTimeout(delayTimeout.current);
    };
  }, [initiateFetchAdvancedSearch]); // Include all dependencies here

  return (
    <Container>
      <SearchFilters
        query={query}
        setQuery={setQuery}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        updateSearchParams={updateSearchParams}
      />

      <div>
        {(isLoading && page === 1) ||
        (isLoading && page === 1 && animeData.length === 0) ? (
          <StyledCardGrid>
            {Array.from({ length: 17 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </StyledCardGrid>
        ) : (
          <CardGrid
            animeData={animeData}
            hasNextPage={hasNextPage}
            onLoadMore={handleLoadMore}
          />
        )}
        {!isLoading && animeData.length === 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '10vh',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            No Results
          </div>
        )}
      </div>
    </Container>
  );
};

export default Search;
