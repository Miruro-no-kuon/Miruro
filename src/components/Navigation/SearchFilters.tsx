import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import {
  FaSearch,
  FaSortAmountDown,
  FaSortAmountDownAlt,
  FaCheckCircle,
  FaTrashAlt,
} from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
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

interface StateProps {
  data: {
    label: string;
  };
  isSelected: boolean;
  isFocused: boolean;
}

const selectStyles: any = {
  placeholder: (provided: object) => ({
    ...provided,
    color: 'var(--global-text-muted)',
  }),
  singleValue: (provided: object, state: StateProps) => ({
    ...provided,
    color:
      state.data.label === 'Popularity' || state.data.label === 'Any'
        ? 'var(--global-text-muted)'
        : 'var(--primary-accent)',
  }),
  control: (provided: object) => ({
    ...provided,
    width: '11.5rem',
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
  menu: (provided: object) => ({
    ...provided,
    zIndex: 5,
    padding: '0.25rem',
    backgroundColor: 'var(--global-secondary-bg)',
    borderColor: 'var(--global-border)',
    color: 'var(--global-text)',
  }),
  option: (provided: object, state: StateProps) => ({
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
  multiValue: (provided: object) => ({
    ...provided,
    backgroundColor: 'var(--global-genre-button-bg)',
  }),
  multiValueLabel: (provided: object) => ({
    ...provided,
    color: 'var(--global-text)',
  }),
  multiValueRemove: (provided: object) => ({
    ...provided,
    '&:hover': {
      backgroundColor: 'var(--primary-accent)',
      color: 'var(--global-secondary-bg)',
    },
  }),
};

const InputContainer = styled.div`
  display: flex;
  max-width: 10.4rem;
  flex: 1;
  align-items: center;
  padding: 0 0.3rem;
  border-radius: var(--global-border-radius);
  background-color: var(--global-div);
  @media (max-width: 500px) {
    max-width: 100%;
  }
`;

const Icon = styled.div`
  font-size: 0.8rem;
  margin: 0;
  padding: 0 0.25rem;
  color: 'var(--global-text-muted)',
  transition: opacity 0.2s;
  max-height: 100%;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: var(--global-text);
  display: inline-block;
  font-size: 0.8rem;
  outline: 0;
  padding: 0;
  max-height: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  height: 2.375rem;

  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  grid-template-rows: auto;
  margin: 0 auto;
  position: relative;
  gap: 1rem;
  justify-content: left;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    display: flex;
    justify-content: center;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: bold;
  font-size: 0.9rem;
`;

const ButtonBase = styled.button`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  max-width: 4.5rem;
  min-width: 4.5rem;
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
  &:hover,
  &:active,
  &:focus {
    background-color: red;
    opacity: 1;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const ClearButton = styled.button<{ $query: string }>`
  background: transparent;
  border: none;
  color: var(--global-text);
  font-size: 1.2rem;
  cursor: pointer;
  opacity: ${({ $query }) => ($query ? 0.5 : 0)};
  visibility: ${({ $query }) => ($query ? 'visible' : 'hidden')};
  transition:
    color 0.2s,
    opacity 0.2s;
  max-height: 100%;
  display: flex;
  align-items: center;

  &:hover,
  &:active,
  &:focus {
    color: var(--global-text);
    opacity: 1;
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
        <InputContainer>
          <Icon>
            <FaSearch
              style={{
                marginRight: '0.25rem',
                color: 'var(--global-text-muted)',
              }}
            />
          </Icon>
          <SearchInput
            type='text'
            value={inputValue} // Use the local state value here
            onChange={(e) => setInputValue(e.target.value)} // Update local state instead of calling onChange directly
            placeholder=''
          />
          <ClearButton
            $query={inputValue}
            onClick={() => {
              setInputValue(''); // Reset the local state
              onChange?.(''); // Propagate the change upwards
            }}
            aria-label='Clear Search'
          >
            <FiX />
          </ClearButton>
        </InputContainer>
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

  const handleChange =
    (
      setter:
        | React.Dispatch<React.SetStateAction<Option[]>>
        | React.Dispatch<React.SetStateAction<Option>>
        | React.Dispatch<React.SetStateAction<string>>,
    ) =>
    (
      newValue: React.SetStateAction<Option[]> &
        React.SetStateAction<Option> &
        React.SetStateAction<string>,
    ) => {
      setter(newValue);
      updateSearchParams();
    };

  return (
    <FiltersWrapper>
      <div>
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
        </FiltersContainer>
      </div>
      <ButtonContainer>
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
        </Button>
        {filtersChanged && (
          <ClearFilters onClick={handleResetFilters}>
            <FaTrashAlt />
          </ClearFilters>
        )}
      </ButtonContainer>
    </FiltersWrapper>
  );
};
