// Enums or types for sorting, assuming sorting options are known
type UserStatisticsSort =
  | 'COUNT_ASC'
  | 'COUNT_DESC'
  | 'SCORE_ASC'
  | 'SCORE_DESC';
export interface UserData {
  name: string;
  avatar: {
    large: string;
  };
  statistics: UserStatistics;
}

export enum MediaListStatus {
  CURRENT = 'CURRENT',
  PLANNING = 'PLANNING',
  COMPLETED = 'COMPLETED',
  REPEATING = 'REPEATING',
  PAUSED = 'PAUSED',
  DROPPED = 'DROPPED',
}

export interface UserStatistics {
  anime: AnimeMangaStatistics;
  manga: AnimeMangaStatistics;
}

export interface AnimeMangaStatistics {
  count: number;
  meanScore: number;
  standardDeviation: number;
  minutesWatched: number; // For anime
  episodesWatched: number; // For anime
  chaptersRead: number; // For manga
  volumesRead: number; // For manga
  formats: UserFormatStatistic[];
  statuses: UserStatusStatistic[];
  scores: UserScoreStatistic[];
  lengths: UserLengthStatistic[];
  releaseYears: UserReleaseYearStatistic[];
  startYears: UserStartYearStatistic[];
  genres: UserGenreStatistic[];
  tags: UserTagStatistic[];
  countries: UserCountryStatistic[];
  voiceActors: UserVoiceActorStatistic[];
  staff: UserStaffStatistic[];
  studios: UserStudioStatistic[];
}

export interface StatisticLimitSort {
  limit: number;
  sort: UserStatisticsSort[];
}

export interface UserFormatStatistic {
  format: string;
  count: number;
}

export interface UserStatusStatistic {
  status: string;
  count: number;
}

export interface UserScoreStatistic {
  score: number;
  count: number;
}

export interface UserLengthStatistic {
  length: string;
  count: number;
}

export interface UserReleaseYearStatistic {
  year: number;
  count: number;
}

export interface UserStartYearStatistic {
  year: number;
  count: number;
}

export interface UserGenreStatistic {
  genre: string;
  count: number;
}

export interface UserTagStatistic {
  tag: string;
  count: number;
}

export interface UserCountryStatistic {
  country: string;
  count: number;
}

export interface UserVoiceActorStatistic {
  voiceActorId: number;
  name: string;
  count: number;
  language: string;
}

export interface UserStaffStatistic {
  staffId: number;
  name: string;
  role: string;
  count: number;
}

export interface UserStudioStatistic {
  studioId: number;
  name: string;
  count: number;
}
