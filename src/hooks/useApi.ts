import axios from 'axios';
import { year, getCurrentSeason, getNextSeason } from '../index';

// Utility function to ensure URL ends with a slash
function ensureUrlEndsWithSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

// Adjusting environment variables to ensure they end with a slash
const BASE_URL = ensureUrlEndsWithSlash(
  import.meta.env.VITE_BACKEND_URL as string,
);
const SKIP_TIMES = ensureUrlEndsWithSlash(
  import.meta.env.VITE_SKIP_TIMES as string,
);
let PROXY_URL = import.meta.env.VITE_PROXY_URL; // Default to an empty string if no proxy URL is provided
// Check if the proxy URL is provided and ensure it ends with a slash
if (PROXY_URL) {
  PROXY_URL = ensureUrlEndsWithSlash(import.meta.env.VITE_PROXY_URL as string);
}

const API_KEY = import.meta.env.VITE_API_KEY as string;

// Axios instance
const axiosInstance = axios.create({
  baseURL: PROXY_URL || undefined,
  timeout: 10000,
  headers: {
    'X-API-Key': API_KEY, // Assuming your API expects the key in this header
  },
});

// Error handling function
// Function to handle errors and throw appropriately
function handleError(error: any, context: string) {
  let errorMessage = 'An error occurred';

  // Handling CORS errors (Note: This is a simplification. Real CORS errors are hard to catch in JS)
  if (error.message && error.message.includes('Access-Control-Allow-Origin')) {
    errorMessage = 'A CORS error occurred';
  }

  switch (context) {
    case 'data':
      errorMessage = 'Error fetching data';
      break;
    case 'anime episodes':
      errorMessage = 'Error fetching anime episodes';
      break;
    // Extend with other cases as needed
  }

  if (error.response) {
    // Extend with more nuanced handling based on HTTP status codes
    const status = error.response.status;
    if (status >= 500) {
      errorMessage += ': Server error';
    } else if (status >= 400) {
      errorMessage += ': Client error';
    }
    // Include server-provided error message if available
    errorMessage += `: ${error.response.data.message || 'Unknown error'}`;
  } else if (error.message) {
    errorMessage += `: ${error.message}`;
  }

  console.error(`${errorMessage}`, error);
  throw new Error(errorMessage);
}

// Cache key generator
// Function to generate cache key from arguments
function generateCacheKey(...args: string[]) {
  return args.join('-');
}

interface CacheItem {
  value: any; // Replace 'any' with a more specific type if possible
  timestamp: number;
}

// Session storage cache creation
// Function to create a cache in session storage
function createOptimizedSessionStorageCache(
  maxSize: number,
  maxAge: number,
  cacheKey: string,
) {
  const cache = new Map<string, CacheItem>(
    JSON.parse(sessionStorage.getItem(cacheKey) || '[]'),
  );
  const keys = new Set<string>(cache.keys());

  function isItemExpired(item: CacheItem) {
    return Date.now() - item.timestamp > maxAge;
  }

  function updateSessionStorage() {
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify(Array.from(cache.entries())),
    );
  }

  return {
    get(key: string) {
      if (cache.has(key)) {
        const item = cache.get(key);
        if (!isItemExpired(item!)) {
          keys.delete(key);
          keys.add(key);
          return item!.value;
        }
        cache.delete(key);
        keys.delete(key);
      }
      return undefined;
    },
    set(key: string, value: any) {
      if (cache.size >= maxSize) {
        const oldestKey = keys.values().next().value;
        cache.delete(oldestKey);
        keys.delete(oldestKey);
      }
      keys.add(key);
      cache.set(key, { value, timestamp: Date.now() });
      updateSessionStorage();
    },
  };
}

// Constants for cache configuration
// Cache size and max age constants
const CACHE_SIZE = 20;
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Factory function for cache creation
// Function to create cache with given cache key
function createCache(cacheKey: string) {
  return createOptimizedSessionStorageCache(
    CACHE_SIZE,
    CACHE_MAX_AGE,
    cacheKey,
  );
}

interface FetchOptions {
  type?: string;
  season?: string;
  format?: string;
  sort?: string[];
  genres?: string[];
  id?: string;
  year?: string;
  status?: string;
}

// Individual caches for different types of data
// Creating caches for anime data, anime info, and video sources
const advancedSearchCache = createCache('Advanced Search');
const animeDataCache = createCache('Data');
const animeInfoCache = createCache('Info');
const animeEpisodesCache = createCache('Episodes');
const fetchAnimeEmbeddedEpisodesCache = createCache('Video Embedded Sources');
const videoSourcesCache = createCache('Video Sources');

// Fetch data from proxy with caching
// Function to fetch data from proxy with caching
async function fetchFromProxy(url: string, cache: any, cacheKey: string) {
  try {
    // Attempt to retrieve the cached response using the cacheKey
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse; // Return the cached response if available
    }

    // Adjust request parameters based on PROXY_URL's availability
    const requestConfig = PROXY_URL
      ? { params: { url } } // If PROXY_URL is defined, send the original URL as a parameter
      : {}; // If PROXY_URL is not defined, make a direct request

    // Proceed with the network request
    const response = await axiosInstance.get(PROXY_URL ? '' : url, requestConfig);

    // After obtaining the response, verify it for errors or empty data
    if (
      response.status !== 200 ||
      (response.data.statusCode && response.data.statusCode >= 400)
    ) {
      const errorMessage = response.data.message || 'Unknown server error';
      throw new Error(
        `Server error: ${response.data.statusCode || response.status
        } ${errorMessage}`,
      );
    }

    // Assuming response data is valid, store it in the cache
    cache.set(cacheKey, response.data);

    return response.data; // Return the newly fetched data
  } catch (error) {
    handleError(error, 'data');
    throw error; // Rethrow the error for the caller to handle
  }
}

// Function to fetch anime data
export async function fetchAdvancedSearch(
  searchQuery: string = '',
  page: number = 1,
  perPage: number = 20,
  options: FetchOptions = {},
) {
  const queryParams = new URLSearchParams({
    ...(searchQuery && { query: searchQuery }),
    page: page.toString(),
    perPage: perPage.toString(),
    type: options.type ?? 'ANIME',
    ...(options.season && { season: options.season }),
    ...(options.format && { format: options.format }),
    ...(options.id && { id: options.id }),
    ...(options.year && { year: options.year }),
    ...(options.status && { status: options.status }),
    ...(options.sort && { sort: JSON.stringify(options.sort) }),
  });

  if (options.genres && options.genres.length > 0) {
    // Correctly encode genres as a JSON array
    queryParams.set('genres', JSON.stringify(options.genres));
  }
  const url = `${BASE_URL}meta/anilist/advanced-search?${queryParams.toString()}`;
  const cacheKey = generateCacheKey('advancedSearch', queryParams.toString());

  return fetchFromProxy(url, advancedSearchCache, cacheKey);
}

// Fetch Anime DATA Function
export async function fetchAnimeData(
  animeId: string,
  provider: string = 'gogoanime',
) {
  const params = new URLSearchParams({ provider });
  const url = `${BASE_URL}meta/anilist/data/${animeId}?${params.toString()}`;
  const cacheKey = generateCacheKey('animeData', animeId, provider);

  return fetchFromProxy(url, animeDataCache, cacheKey);
}

// Fetch Anime INFO Function
export async function fetchAnimeInfo(
  animeId: string,
  provider: string = 'gogoanime',
) {
  const params = new URLSearchParams({ provider });
  const url = `${BASE_URL}meta/anilist/info/${animeId}?${params.toString()}`;
  const cacheKey = generateCacheKey('animeInfo', animeId, provider);

  return fetchFromProxy(url, animeInfoCache, cacheKey);
}

// Function to fetch list of anime based on type (TopRated, Trending, Popular)
async function fetchList(
  type: string,
  page: number = 1,
  perPage: number = 16,
  options: FetchOptions = {},
) {
  let cacheKey: string;
  let url: string;
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  if (
    ['TopRated', 'Trending', 'Popular', 'TopAiring', 'Upcoming'].includes(type)
  ) {
    cacheKey = generateCacheKey(
      `${type}Anime`,
      page.toString(),
      perPage.toString(),
    );
    url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`;

    if (type === 'TopRated') {
      options = {
        type: 'ANIME',
        sort: ['["SCORE_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`;
    } else if (type === 'Popular') {
      options = {
        type: 'ANIME',
        sort: ['["POPULARITY_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`;
    } else if (type === 'Upcoming') {
      const season = getNextSeason(); // This will set the season based on the current month
      options = {
        type: 'ANIME',
        season: season,
        year: year.toString(),
        status: 'NOT_YET_RELEASED',
        sort: ['["POPULARITY_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`;
    } else if (type === 'TopAiring') {
      const season = getCurrentSeason(); // This will set the season based on the current month
      options = {
        type: 'ANIME',
        season: season,
        year: year.toString(),
        status: 'RELEASING',
        sort: ['["POPULARITY_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`;
    }
  } else {
    cacheKey = generateCacheKey(
      `${type}Anime`,
      page.toString(),
      perPage.toString(),
    );
    url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`;
    // params already defined above
  }

  const specificCache = createCache(`${type}`);
  return fetchFromProxy(`${url}?${params.toString()}`, specificCache, cacheKey);
}

// Functions to fetch top, trending, and popular anime
export const fetchTopAnime = (page: number, perPage: number) =>
  fetchList('TopRated', page, perPage);
export const fetchTrendingAnime = (page: number, perPage: number) =>
  fetchList('Trending', page, perPage);
export const fetchPopularAnime = (page: number, perPage: number) =>
  fetchList('Popular', page, perPage);
export const fetchTopAiringAnime = (page: number, perPage: number) =>
  fetchList('TopAiring', page, perPage);
export const fetchUpcomingSeasons = (page: number, perPage: number) =>
  fetchList('Upcoming', page, perPage);

// Fetch Anime Episodes Function
export async function fetchAnimeEpisodes(
  animeId: string,
  provider: string = 'gogoanime',
  dub: boolean = false,
) {
  const params = new URLSearchParams({ provider, dub: dub ? 'true' : 'false' });
  const url = `${BASE_URL}meta/anilist/episodes/${animeId}?${params.toString()}`;
  const cacheKey = generateCacheKey(
    'animeEpisodes',
    animeId,
    provider,
    dub ? 'dub' : 'sub',
  );

  return fetchFromProxy(url, animeEpisodesCache, cacheKey);
}

// Fetch Embedded Anime Episodes Servers
export async function fetchAnimeEmbeddedEpisodes(episodeId: string) {
  const url = `${BASE_URL}meta/anilist/servers/${episodeId}`;
  const cacheKey = generateCacheKey('animeEmbeddedServers', episodeId);

  return fetchFromProxy(url, fetchAnimeEmbeddedEpisodesCache, cacheKey);
}

// Function to fetch anime streaming links
export async function fetchAnimeStreamingLinks(episodeId: string) {
  const url = `${BASE_URL}meta/anilist/watch/${episodeId}`;
  const cacheKey = generateCacheKey('animeStreamingLinks', episodeId);

  return fetchFromProxy(url, videoSourcesCache, cacheKey);
}

// Function to fetch skip times for an anime episode
interface FetchSkipTimesParams {
  malId: string;
  episodeNumber: string;
  episodeLength?: string;
}

// Function to fetch skip times for an anime episode
export async function fetchSkipTimes({
  malId,
  episodeNumber,
  episodeLength = '0',
}: FetchSkipTimesParams) {
  // Constructing the URL with query parameters
  const types = ['ed', 'mixed-ed', 'mixed-op', 'op', 'recap'];
  const url = new URL(`${SKIP_TIMES}v2/skip-times/${malId}/${episodeNumber}`);
  url.searchParams.append('episodeLength', episodeLength.toString());
  types.forEach((type) => url.searchParams.append('types[]', type));

  const cacheKey = generateCacheKey(
    'skipTimes',
    malId,
    episodeNumber,
    episodeLength || '',
  );

  // Use the fetchFromProxy function to make the request and handle caching
  return fetchFromProxy(url.toString(), createCache('SkipTimes'), cacheKey);
}

// Fetch Recent Anime Episodes Function
export async function fetchRecentEpisodes(
  page: number = 1,
  perPage: number = 18,
  provider: string = 'gogoanime',
) {
  // Construct the URL with query parameters for fetching recent episodes
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    provider: provider, // Default to 'gogoanime' if no provider is specified
  });

  // Using the BASE_URL defined at the top of your file
  const url = `${BASE_URL}meta/anilist/recent-episodes?${params.toString()}`;
  const cacheKey = generateCacheKey(
    'recentEpisodes',
    page.toString(),
    perPage.toString(),
    provider,
  );

  // Utilize the existing fetchFromProxy function to handle the request and caching logic
  return fetchFromProxy(url, createCache('RecentEpisodes'), cacheKey);
}
