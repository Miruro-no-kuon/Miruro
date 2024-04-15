import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import { FaSearch } from 'react-icons/fa';
import makeAnimated from 'react-select/animated';
import { LuFilterX } from 'react-icons/lu';
import { FaSortAmountDown, FaSortAmountDownAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';
import {
  Option,
  FilterProps,
  genreOptions,
  anyOption,
  yearOptions,
  seasonOptions,
  formatOptions,
  statusOptions,
  sortOptions,
} from '../../index';

const selectStyles = {
  placeholder: (provided: any) => ({
    ...provided,
    color: 'var(--global-text-muted)',
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color:
      state.data.label === 'Popularity' || state.data.label === 'Any'
        ? 'var(--global-text-muted)'
        : 'var(--primary-accent)',
  }),
  control: (provided: any) => ({
    ...provided,
    width: '10rem',
    backgroundColor: 'var(--global-secondary-bg)',
    borderColor: 'transparent',
    color: 'var(--global-text)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'var(--primary-accent)',
    },
    '@media (max-width: 500px)': {
      width: '10rem',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 5,
    padding: '0.25rem',
    backgroundColor: 'var(--global-secondary-bg)',
    borderColor: 'var(--global-border)',
    color: 'var(--global-text)',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor:
      state.isSelected || state.isFocused
        ? 'var(--global-tertiary-bg)'
        : 'var(--global-secondary-bg)',
    color:
      state.isSelected || state.isFocused
        ? 'var(--primary-accent)'
        : 'var(--global-text)',
    borderRadius: 'var(--global-border-radius)',
    '&:hover': {
      backgroundColor: 'var(--global-tertiary-bg)',
      color: 'var(--primary-accent)',
    },
    marginBottom: '0.25rem',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--global-genre-button-bg)',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'var(--global-text)',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    '&:hover': {
      backgroundColor: 'var(--primary-accent)',
      color: 'var(--global-secondary-bg)',
    },
  }),
};

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--global-secondary-bg);
  border-radius: var(--global-border-radius);
  height: 38px;
  position: relative;
  width: 12rem;
  @media (max-width: 500px) {
    width: auto;
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
  gap: 1rem;
  @media (max-width: 500px) {
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
`;

const ButtonBase = styled.button`
  margin-top: 1.5rem;
  @media (max-width: 450px) {
    margin-top: 0.25rem;
  }
  flex: 1;
  align-items: right;
  justify-content: right;
  padding: 0.6rem;
  min-width: 4.5rem;
  max-width: 3rem;
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
  &:active,
  &:focus {
    transform: scale(1.025);
  }
  &:active {
    transform: scale(0.975);
  }
  svg {
    margin-bottom: -0.1rem;
    margin-right: 0.2rem;
  }
`;

const Button = styled(ButtonBase)`
  &.active {
    background-color: var(--primary-accent);
  }
`;

const ClearFilters = styled(ButtonBase)`
  &.active {
    background-color: none;
  }
  svg {
    color: red;
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
  updateSearchParams: () => void; // Added prop for updating search params
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
  updateSearchParams,
}) => {
  // State to track if any filter is changed from its default value
  const [filtersChanged, setFiltersChanged] = useState(false);

  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSelectedYear(anyOption);
    setSelectedSeason(anyOption);
    setSelectedFormat(anyOption);
    setSelectedStatus(anyOption);
    setSelectedSort({ value: 'POPULARITY_DESC', label: 'Popularity' });
    setSortDirection('DESC');
    setQuery('');
    updateSearchParams(); // Also reset URL parameters
  };

  useEffect(() => {
    const hasFiltersChanged =
      query !== '' || // Check if query is not default
      selectedGenres.length > 0 || // Check if any genres are selected
      selectedYear.value !== anyOption.value || // Check if year is not "Any"
      selectedSeason.value !== anyOption.value || // Same for season, type, status...
      selectedFormat.value !== anyOption.value ||
      selectedStatus.value !== anyOption.value ||
      selectedSort.value !== 'POPULARITY_DESC' || // Check if sort criteria is not "Popularity"
      sortDirection !== 'DESC'; // Check if sort direction is not descending

    setFiltersChanged(hasFiltersChanged);
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

  const handleChange = (setter: any) => (newValue: string) => {
    setter(newValue);
    updateSearchParams();
  };

  return (
    <FiltersContainer>
      <FilterSelect
        label='Search'
        value={query}
        onChange={handleChange(setQuery)}
      />
      <FilterSelect
        label='Genres'
        options={genreOptions}
        isMulti
        onChange={handleChange(setSelectedGenres)}
        value={selectedGenres}
      />
      <FilterSelect
        label='Year'
        options={yearOptions}
        onChange={handleChange(setSelectedYear)}
        value={selectedYear}
      />
      <FilterSelect
        label='Season'
        options={seasonOptions}
        onChange={handleChange(setSelectedSeason)}
        value={selectedSeason}
      />
      <FilterSelect
        label='Type'
        options={formatOptions}
        onChange={handleChange(setSelectedFormat)}
        value={selectedFormat}
      />
      <FilterSelect
        label='Status'
        options={statusOptions}
        onChange={handleChange(setSelectedStatus)}
        value={selectedStatus}
      />
      <FilterSelect
        label='Sort By'
        options={sortOptions}
        onChange={handleChange(setSelectedSort)}
        value={selectedSort}
      />
      <Button
        onClick={() => {
          setSortDirection(sortDirection === 'DESC' ? 'ASC' : 'DESC');
          updateSearchParams(); // Ensure sort direction changes also update URL
        }}
      >
        {sortDirection === 'DESC' ? (
          <FaSortAmountDown />
        ) : (
          <FaSortAmountDownAlt />
        )}
        Sort
      </Button>
      {filtersChanged && (
        <ClearFilters onClick={handleResetFilters}>
          <LuFilterX />
          Clear
        </ClearFilters>
      )}
    </FiltersContainer>
  );
};
