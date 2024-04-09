import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { LuSlidersHorizontal } from 'react-icons/lu';

interface Option {
  value: string;
  label: string;
}

interface FilterProps {
  label: string;
  options?: Option[];
  onChange?: (value: any) => void;
  value?: any;
  isMulti?: boolean;
}

const selectStyles = {
  placeholder: (provided: any) => ({
    ...provided,
    color: 'var(--global-text-muted)', // Use the CSS variable for the muted text color
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--global-text-muted)', // Ensures the selected value matches the global text color
  }),
  control: (provided: any) => ({
    ...provided,
    width: '12rem', // Set a minimum width for the dropdown container
    backgroundColor: 'var(--global-secondary-bg)', // Customizing the dropdown control background
    borderColor: 'transparent', // Customizing the border color
    color: 'var(--global-text)', // Customizing the text color
    boxShadow: 'none', // Removing the box-shadow
    '&:hover': {
      borderColor: 'var(--primary-accent)', // Customizing the border color on hover
    },
    '@media (max-width: 500px)': {
      width: '10rem', // Adjust width under 500px screen width
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 5,
    backgroundColor: 'var(--global-secondary-bg)', // Customizing the dropdown menu background
    borderColor: 'var(--global-border)', // Customizing the border color of the menu
    color: 'var(--global-text)', // Customizing the text color of the menu
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'var(--primary-accent-bg)' // Background color for selected option
      : state.isFocused
        ? 'var(--global-div)' // Background color for option under the cursor
        : 'var(--global-secondary-bg)', // Default background color
    color: state.isSelected
      ? 'var(--global-secondary-bg)'
      : 'var(--global-text)',
    '&:hover': {
      backgroundColor: 'var(--primary-accent-bg)',
      color: 'var(--global-secondary-bg)',
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
      color: 'var(--global-secondary-bg)',
    },
  }),
};

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
  anyOption,
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
  { value: 'NOT_YET_RELEASED', label: 'Not Yet Aired' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const sortOptions = [
  { value: 'POPULARITY', label: 'Popularity' },
  { value: 'TRENDING', label: 'Trending' },
  { value: 'UPDATED_AT', label: 'Last Updated' },
  { value: 'START_DATE', label: 'Start Date' },
  { value: 'END_DATE', label: 'End Date' },
  { value: 'FAVOURITES', label: 'Favorites' },
  { value: 'SCORE', label: 'Score' },
  { value: 'TITLE_ROMAJI', label: 'Title (Romaji)' },
  { value: 'TITLE_ENGLISH', label: 'Title (English)' },
  { value: 'TITLE_NATIVE', label: 'Title (Native)' },
  { value: 'EPISODES', label: 'Episodes' },
  { value: 'ID', label: 'ID' },
];

const SearchInput = styled.input`
  display: flex;
  flex: 1;
  border: none;
  width: 9rem;
  height: 1.2rem;
  align-items: center;
  color: var(--global-text);
  padding: 0.6rem;
  border-radius: var(--global-border-radius);
  background-color: var(--global-secondary-bg);
  &:focus {
    outline: none;
    border: none;
    color: var(--global-text);
  }
`;

const FiltersContainer = styled.div`
  justify-content: left;
  align-items: center;
  display: flex;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 2rem;
  @media (max-width: 501px) {
    gap: 0.5rem;
    justify-content: center;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const FilterLabel = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
  svg {
    margin-right: 0.5rem;
  }
`;

const ButtonBase = styled.button`
  flex: 1; // Make the button expand to fill the wrapper
  padding: 0.6rem;
  max-width: 10rem;
  border: none;
  font-weight: bold;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: var(--global-div);
  color: var(--global-text);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease-in-out;
  text-align: center;

  &:hover {
    background-color: var(--primary-accent);
  }
  &:active,
  &:focus {
    transform: scale(1.025);
  }
  &:active {
    transform: scale(0.975);
  }
`;

const Button = styled(ButtonBase)`
  &.active {
    background-color: var(--primary-accent);
  }
`;

const ClearButton = styled(ButtonBase)`
  margin-top: 1.75rem;
  max-width: 7rem;

  @media (max-width: 1000px) {
    margin-top: 0.5rem;
  }
`;

const animatedComponents = makeAnimated();

const FilterSelect: React.FC<FilterProps> = ({
  label,
  options,
  onChange,
  value,
  isMulti = false,
}) => {
  // Local state to handle input value and debounce
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    // Set up a delay for executing the onChange handler
    const handler = setTimeout(() => {
      onChange && onChange(inputValue);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onChange]);

  return (
    <FilterSection>
      <FilterLabel>
        {label === 'Search' && <LuSlidersHorizontal />}
        {label}
      </FilterLabel>
      {label === 'Search' ? (
        <SearchInput
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder=''
        />
      ) : (
        <Select
          components={{ ...animatedComponents, IndicatorSeparator: () => null }}
          isMulti={isMulti}
          options={options}
          onChange={onChange}
          value={value}
          placeholder='Any'
          styles={selectStyles}
          isSearchable={false}
        />
      )}
    </FilterSection>
  );
};

export const SearchFilters: React.FC<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedGenres: Option[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<Option[]>>;
  selectedYear: Option;
  setSelectedYear: React.Dispatch<React.SetStateAction<Option>>;
  selectedSeason: Option;
  setSelectedSeason: React.Dispatch<React.SetStateAction<Option>>;
  selectedFormat: Option;
  setSelectedFormat: React.Dispatch<React.SetStateAction<Option>>;
  selectedStatus: Option;
  setSelectedStatus: React.Dispatch<React.SetStateAction<Option>>;
  selectedSort: Option;
  setSelectedSort: React.Dispatch<React.SetStateAction<Option>>;
  sortDirection: 'DESC' | 'ASC';
  setSortDirection: React.Dispatch<React.SetStateAction<'DESC' | 'ASC'>>;
  resetFilters: () => void;
}> = ({
  query,
  setQuery,
  selectedGenres,
  setSelectedGenres,
  selectedYear,
  setSelectedYear,
  selectedSeason,
  setSelectedSeason,
  selectedFormat,
  setSelectedFormat,
  selectedStatus,
  setSelectedStatus,
  selectedSort,
  setSelectedSort,
  sortDirection,
  setSortDirection,
  resetFilters,
}) => (
  <FiltersContainer>
    <FilterSelect label='Search' value={query} onChange={setQuery} />
    <FilterSelect
      label='Genres'
      options={genreOptions}
      isMulti
      onChange={setSelectedGenres}
      value={selectedGenres}
    />
    <FilterSelect
      label='Year'
      options={yearOptions}
      onChange={setSelectedYear}
      value={selectedYear}
    />
    <FilterSelect
      label='Season'
      options={seasonOptions}
      onChange={setSelectedSeason}
      value={selectedSeason}
    />
    <FilterSelect
      label='Type'
      options={formatOptions}
      onChange={setSelectedFormat}
      value={selectedFormat}
    />
    <FilterSelect
      label='Status'
      options={statusOptions}
      onChange={setSelectedStatus}
      value={selectedStatus}
    />
    {/* <FilterSelect
      label='Sort By'
      options={sortOptions}
      onChange={setSelectedSort}
      value={selectedSort}
    /> */}
    {/* <Button
      onClick={() =>
        setSortDirection(sortDirection === 'DESC' ? 'ASC' : 'DESC')
      }
    >
      {sortDirection === 'DESC' ? 'Desc' : 'Asc'}
    </Button> */}
    <ClearButton onClick={resetFilters}>Clear Filters</ClearButton>
  </FiltersContainer>
);
