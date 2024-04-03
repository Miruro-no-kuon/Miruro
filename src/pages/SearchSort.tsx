import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { LuSlidersHorizontal } from 'react-icons/lu';
import {
  CardGrid,
  StyledCardGrid,
  fetchAdvancedSearch,
  CardSkeleton,
} from '../index';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const Container = styled.div`
  min-height: 65vh;
  margin-top: 1rem;

  @media (min-width: 1500px) {
    margin-left: 8rem;
    margin-right: 8rem;
    margin-top: 2rem;
  }
`;
const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 2rem;
`;

const FiltersContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 3rem;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
  svg {
    // font-size: 1.25rem;
    margin-right: 0.5rem;
  }
`;

const SearchInput = styled.input`
  display: flex;
  flex: 1;
  border: none;
  max-width: 10rem;
  height: 1.2rem;
  align-items: center;
  color: var(--global-text);
  padding: 0.6rem;
  border-radius: var(--global-border-radius);
  background-color: var(--global-secondary-bg);

  /* Override focus styles */
  &:focus {
    outline: none; /* Removes the outline */
    border: none; /* Ensures border stays unchanged */
    color: var(--global-text);
  }
`;

const selectStyles = {
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--global-text-muted)', // Use the CSS variable for the muted text color
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--global-text-muted)', // Ensures the selected value matches the global text color
  }),
  control: (provided: any) => ({
    ...provided,
    minWidth: '200px', // Set a minimum width for the dropdown container
    backgroundColor: 'var(--global-secondary-bg)', // Customizing the dropdown control background
    borderColor: 'transparent', // Customizing the border color
    color: 'var(--global-text)', // Customizing the text color
    boxShadow: 'none', // Removing the box-shadow
    '&:hover': {
      borderColor: 'var(--primary-accent)', // Customizing the border color on hover
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--global-primary-bg)', // Customizing the dropdown menu background
    borderColor: 'var(--global-border)', // Customizing the border color of the menu
    color: 'var(--global-text)', // Customizing the text color of the menu
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'var(--primary-accent-bg)' // Background color for selected option
      : state.isFocused
        ? 'var(--global-div)' // Background color for option under the cursor
        : 'var(--global-primary-bg)', // Default background color
    color: state.isSelected ? 'var(--global-primary-bg)' : 'var(--global-text)',
    '&:hover': {
      backgroundColor: 'var(--primary-accent-bg)',
      color: 'var(--global-primary-bg)',
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--global-genre-button-bg)', // Customizing the background of the selected item tag
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'var(--global-text)', // Customizing the text color of the selected item tag
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    '&:hover': {
      backgroundColor: 'var(--primary-accent)',
      color: 'var(--global-primary-bg)',
    },
  }),
};

const animatedComponents = makeAnimated();

const genreOptions = [
  { value: 'Action', label: 'Action' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Cars', label: 'Cars' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Drama', label: 'Drama' },
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Horror', label: 'Horror' },
  { value: 'Mahou Shoujo', label: 'Mahou Shoujo' },
  { value: 'Mecha', label: 'Mecha' },
  { value: 'Music', label: 'Music' },
  { value: 'Mystery', label: 'Mystery' },
  { value: 'Psychological', label: 'Psychological' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Sci-Fi', label: 'Sci-Fi' },
  { value: 'Slice of Life', label: 'Slice of Life' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Supernatural', label: 'Supernatural' },
  { value: 'Thriller', label: 'Thriller' },
];

const anyOption = { value: '', label: 'Any' };

const yearOptions = [
  anyOption,
  ...Array.from({ length: new Date().getFullYear() - 1939 }, (_, i) => ({
    value: String(new Date().getFullYear() - i),
    label: String(new Date().getFullYear() - i),
  })),
];

const seasonOptions = [
  { value: 'WINTER', label: 'Winter' },
  { value: 'SPRING', label: 'Spring' },
  { value: 'SUMMER', label: 'Summer' },
  { value: 'FALL', label: 'Fall' },
];

const formatOptions = [
  anyOption,
  { value: 'TV', label: 'TV' },
  { value: 'TV_SHORT', label: 'TV Short' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'MOVIE', label: 'Movie' },
  { value: 'SPECIAL', label: 'Special' },
  { value: 'MUSIC', label: 'Music' },
];

const statusOptions = [
  anyOption,
  { value: 'RELEASING', label: 'Releasing' },
  { value: 'NOT YET AIRED', label: 'Not Yet Aired' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'HIATUS', label: 'Hiatus' },
];

const SearchSort = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(initialQuery);
  const [animeData, setAnimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const delayTimeout = useRef(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState([]);
  const [selectedYear, setSelectedYear] = useState(anyOption);
  const [selectedFormat, setSelectedFormat] = useState(anyOption);
  const [selectedStatus, setSelectedStatus] = useState(anyOption);

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

  const initiatefetchAdvancedSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      // If the value is '', it means "Any" is selected, so don't apply the filter
      const yearFilter = selectedYear.value ? selectedYear.value : undefined;
      const formatFilter = selectedFormat.value
        ? selectedFormat.value
        : undefined;
      const statusFilter = selectedStatus.value
        ? selectedStatus.value
        : undefined;

      const fetchedData = await fetchAdvancedSearch(query, page, 20, {
        genres: selectedGenres.map((g) => g.value),
        year: yearFilter,
        season: selectedSeason.map((s) => s.value).join(','),
        format: formatFilter,
        status: statusFilter,
      });

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
  }, [
    query,
    page,
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
  ]);

  const handleLoadMore = () => {
    setPage((prevPage) => {
      return prevPage < 10 ? prevPage + 1 : prevPage;
    });
  };
  useEffect(() => {
    const newQuery = searchParams.get('query') || '';
    if (newQuery !== query) {
      setQuery(newQuery);
      // You might consider removing the automatic search here too, depending on your needs
      // initiatefetchAdvancedSearch();
    }
  }, [searchParams]);
  useEffect(() => {
    // Debounce to avoid too many requests
    if (delayTimeout.current !== null) clearTimeout(delayTimeout.current);
    delayTimeout.current = setTimeout(() => {
      initiatefetchAdvancedSearch();
    }, 300); // Adjust debounce time as needed

    return () => {
      if (delayTimeout.current !== null) clearTimeout(delayTimeout.current);
    };
  }, [
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
    initiatefetchAdvancedSearch,
  ]); // Watch filter states

  const handleSearch = useCallback(() => {
    setPage(1); // Reset page to start the search from the beginning
    // It's important to not just set the query here but also to directly call your search function
    setSearchParams({ query }); // This updates the URL, which might trigger the useEffect above
    initiatefetchAdvancedSearch(); // Directly initiate the search when button is clicked
  }, [query, setSearchParams, initiatefetchAdvancedSearch]);
  return (
    <Container>
      <FiltersContainer>
        <FilterSection>
          <FilterLabel>
            <LuSlidersHorizontal />
            Search
          </FilterLabel>
          <SearchInput
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=''
          />
        </FilterSection>
        <FilterSection>
          <FilterLabel>Genres</FilterLabel>
          <Select
            components={animatedComponents}
            isMulti
            options={genreOptions}
            onChange={setSelectedGenres}
            placeholder='Any'
            styles={selectStyles}
          />
        </FilterSection>

        <FilterSection>
          <FilterLabel>Year</FilterLabel>
          <Select
            components={animatedComponents}
            options={yearOptions}
            onChange={setSelectedYear}
            value={selectedYear}
            placeholder='Year'
            styles={selectStyles}
          />
        </FilterSection>

        <FilterSection>
          <FilterLabel>Season</FilterLabel>
          <Select
            components={animatedComponents}
            isMulti
            options={seasonOptions}
            onChange={setSelectedSeason}
            placeholder='Any'
            styles={selectStyles}
          />
        </FilterSection>

        <FilterSection>
          <FilterLabel>Format</FilterLabel>
          <Select
            components={animatedComponents}
            options={formatOptions}
            onChange={(selectedOption) => setSelectedFormat(selectedOption)}
            value={selectedFormat}
            placeholder='Format'
            styles={selectStyles}
          />
        </FilterSection>

        <FilterSection>
          <FilterLabel>Status</FilterLabel>
          <Select
            components={animatedComponents}
            options={statusOptions}
            onChange={(selectedOption) => setSelectedStatus(selectedOption)}
            value={selectedStatus}
            placeholder='Status'
            styles={selectStyles}
          />
        </FilterSection>
      </FiltersContainer>

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
