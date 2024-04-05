import React from 'react';
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
  { value: 'NOT_YET_RELEASED', label: 'Not Yet Aired' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'HIATUS', label: 'Hiatus' },
];

const SearchInput = styled.input`
  display: flex;
  flex: 1;
  border: none;
  width: 11rem;
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

const FilterSelect: React.FC<FilterProps> = ({
  label,
  options,
  onChange,
  value,
  isMulti = false,
}) => (
  <FilterSection>
    <FilterLabel>
      {label === 'Search' && <LuSlidersHorizontal />}
      {label}
    </FilterLabel>
    {label === 'Search' ? (
      <SearchInput
        type='text'
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
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
      />
    )}
  </FilterSection>
);

const FiltersContainer = styled.div`
  justify-content: left;
  align-items: center;
  display: flex;
  gap: 2rem;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 2rem;
`;

const FilterLabel = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
  svg {
    margin-right: 0.5rem;
  }
`;

const animatedComponents = makeAnimated();

export const Filters: React.FC<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedGenres: Option[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<Option[]>>;
  selectedYear: Option;
  setSelectedYear: React.Dispatch<React.SetStateAction<Option>>;
  selectedSeason: Option[];
  setSelectedSeason: React.Dispatch<React.SetStateAction<Option[]>>;
  selectedFormat: Option;
  setSelectedFormat: React.Dispatch<React.SetStateAction<Option>>;
  selectedStatus: Option;
  setSelectedStatus: React.Dispatch<React.SetStateAction<Option>>;
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
      isMulti
      onChange={setSelectedSeason}
      value={selectedSeason}
    />
    <FilterSelect
      label='Format'
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
  </FiltersContainer>
);
