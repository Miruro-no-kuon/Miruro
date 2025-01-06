import { year as currentYear } from '../index';

export interface Option {
  value: string;
  label: string;
}

export interface FilterProps {
  label: string;
  options?: Option[];
  onChange?: (value: any) => void;
  value?: any;
  isMulti?: boolean;
}

export const anyOption: Option = { value: '', label: 'Any' };

export const genreOptions: Option[] = [
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

export const yearOptions: Option[] = [
  anyOption,
  { value: String(currentYear + 1), label: String(currentYear + 1) },
  ...Array.from({ length: currentYear - 1939 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  })),
];

export const seasonOptions: Option[] = [
  anyOption,
  { value: 'WINTER', label: 'Winter' },
  { value: 'SPRING', label: 'Spring' },
  { value: 'SUMMER', label: 'Summer' },
  { value: 'FALL', label: 'Fall' },
];

export const formatOptions: Option[] = [
  anyOption,
  { value: 'TV', label: 'TV' },
  { value: 'TV_SHORT', label: 'TV Short' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'MOVIE', label: 'Movie' },
  { value: 'SPECIAL', label: 'Special' },
  { value: 'MUSIC', label: 'Music' },
];

export const statusOptions: Option[] = [
  anyOption,
  { value: 'RELEASING', label: 'Airing' },
  { value: 'NOT_YET_RELEASED', label: 'Not Yet Aired' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const sortOptions: Option[] = [
  { value: 'POPULARITY_DESC', label: 'Popularity' },
  { value: 'TRENDING_DESC', label: 'Trending' },
  { value: 'SCORE_DESC', label: 'Rating' },
  { value: 'FAVOURITES_DESC', label: 'Favorites' },
  { value: 'EPISODES_DESC', label: 'Episodes' },
  { value: 'ID_DESC', label: 'ID' },
  { value: 'UPDATED_AT_DESC', label: 'Last Updated' },
  { value: 'START_DATE_DESC', label: 'Start Date' },
  { value: 'END_DATE_DESC', label: 'End Date' },
  { value: 'TITLE_ROMAJI_DESC', label: 'Title (Romaji)' },
  { value: 'TITLE_ENGLISH_DESC', label: 'Title (English)' },
  { value: 'TITLE_NATIVE_DESC', label: 'Title (Native)' },
];
