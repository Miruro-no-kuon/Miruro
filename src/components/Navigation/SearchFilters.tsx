import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import { FaSearch } from 'react-icons/fa';
import makeAnimated from 'react-select/animated';
import { LuSlidersHorizontal, LuFilterX } from 'react-icons/lu';
import { FiX } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';

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
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color:
      state.data.label === 'Any'
        ? 'var(--global-text-muted)'
        : 'var(--primary-accent)',
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
    padding: '0.25rem',
    backgroundColor: 'var(--global-secondary-bg)', // Customizing the dropdown menu background
    borderColor: 'var(--global-border)', // Customizing the border color of the menu
    color: 'var(--global-text)', // Customizing the text color of the menu
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor:
      state.isSelected || state.isFocused
        ? 'var(--global-tertiary-bg)' // Setting the background color for selected or hovered options
        : 'var(--global-secondary-bg)', // Default background color for unselected options
    color:
      state.isSelected || state.isFocused
        ? 'var(--primary-accent)' // Keeping the text color for selected or hovered options as per your requirement
        : 'var(--global-text)',
    borderRadius: 'var(--global-border-radius)', // Default text color for unselected options
    '&:hover': {
      backgroundColor: 'var(--global-tertiary-bg)', // Ensuring the hover background color matches the selected/focused color
      color: 'var(--primary-accent)', // Ensuring the hover text color remains consistent
    },
    marginBottom: '0.25rem',
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
  { value: 'RELEASING', label: 'Airing' },
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

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--global-secondary-bg);
  border-radius: var(--global-border-radius);
  height: 38px;
  position: relative;
  width: 12rem;
  @media (max-width: 500px) {
    width: 10rem;
  }
  overflow: hidden;
`;

const SearchInput = styled.input`
  flex-grow: 1; // Allow the input to fill the space
  border: none;
  margin-left: 0.5rem;
  padding: 0.3rem 0.3rem 0.3rem 0.6rem; // Adjust padding as needed
  background-color: transparent;
  color: var(--global-text);
  &:focus {
    outline: none;
  }
`;

const FiltersContainer = styled.div`
  justify-content: left;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
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
  font-size: 0.9rem;
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
  max-width: 6rem;
  @media (max-width: 1000px) {
    margin-top: 0.5rem;
  }
`;

const ClearIcon = styled(FiX)`
  cursor: pointer;
  position: absolute;
  right: 10px; // Adjust based on padding
  top: 50%;
  transform: translateY(-50%);
  color: var(--global-text-muted);
  size: 20px; // Ensure the icon has a fixed size
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
    // Update local state when external value prop changes
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (label === 'Search') {
      // Set up a delay for executing the onChange handler only for the Search input
      const handler = setTimeout(() => {
        onChange && onChange(inputValue);
      }, 300); // 300ms delay for debounce

      // Cleanup function to clear the timeout
      return () => {
        clearTimeout(handler);
      };
    }
  }, [inputValue, onChange, label]);

  //Add Check Circle to clicked option
  const CustomOption = (props: any) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{props.data.label}</span>
          {props.isSelected && <FaCheckCircle style={{ marginLeft: '10px' }} />}
        </div>
      </components.Option>
    );
  };
  return (
    <FilterSection>
      <FilterLabel>
        {label === 'Search'}
        {label}
      </FilterLabel>
      {label === 'Search' ? (
        <SearchInputWrapper>
          <FaSearch
            style={{
              marginLeft: '0.5rem',
              position: 'absolute',
              color: 'var(--global-text-muted)',
            }}
          />
          <SearchInput
            type='text'
            value={inputValue} // Use the local state value here
            onChange={(e) => setInputValue(e.target.value)} // Update local state instead of calling onChange directly
            placeholder=''
            style={{ paddingLeft: '1.5rem' }} // Ensure padding is consistent to make room for the icon
          />
          {value && (
            <ClearIcon
              size={20}
              onClick={() => {
                setInputValue(''); // Reset the local state
                onChange?.(''); // Propagate the change upwards
              }}
            />
          )}
        </SearchInputWrapper>
      ) : (
        <Select
          components={{
            ...animatedComponents,
            Option: CustomOption,
            IndicatorSeparator: () => null,
          }}
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
}) => {
  // State to track if any filter is changed from its default value
  const [filtersChanged, setFiltersChanged] = useState(false);

  const handleResetFilters = () => {
    setSelectedGenres([]); // Reset to default "Any" state
    setSelectedYear(anyOption); // Assuming `anyOption` is your default
    setSelectedSeason(anyOption);
    setSelectedFormat(anyOption);
    setSelectedStatus(anyOption);
    // Add any other filters you need to reset
    setQuery('');
  };
  useEffect(() => {
    const hasFiltersChanged =
      query !== '' || // Check if query is not default
      selectedGenres.length > 0 || // Check if any genres are selected
      selectedYear.value !== anyOption.value || // Check if year is not "Any"
      selectedSeason.value !== anyOption.value || // Same for season, type, status...
      selectedFormat.value !== anyOption.value ||
      selectedStatus.value !== anyOption.value;

    setFiltersChanged(hasFiltersChanged);
  }, [
    query,
    selectedGenres,
    selectedYear,
    selectedSeason,
    selectedFormat,
    selectedStatus,
  ]);

  return (
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
      {filtersChanged && (
        <ClearButton onClick={handleResetFilters}>
          <LuFilterX /> Clear
        </ClearButton>
      )}
    </FiltersContainer>
  );
};
