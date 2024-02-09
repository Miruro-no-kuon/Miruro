import axios from "axios";

// Environment variables
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL_2 = import.meta.env.VITE_BACKEND_URL_2;
const API_KEY = import.meta.env.VITE_API_KEY;
const PROXY_URL = import.meta.env.VITE_PROXY_URL;
const IS_LOCAL = import.meta.env.VITE_IS_LOCAL;

// Axios instance
const PROXY_SERVER_BASE_URL =
  IS_LOCAL == "true"
    ? "http://localhost:5173/api/json"
    : `${PROXY_URL}/api/json`;

const axiosInstance = axios.create({
  baseURL: PROXY_SERVER_BASE_URL,
  timeout: 10000,
});

// Error handling function
function handleError(error, context) {
  const errorMessage =
    error.response?.data?.message || "Unknown error occurred";
  console.error(`Error fetching ${context}: ${errorMessage}`, error);
  throw new Error(errorMessage);
}

// Cache key generator
function generateCacheKey(...args) {
  return args.join("-");
}

// Session storage cache creation
function createOptimizedSessionStorageCache(maxSize, maxAge, cacheKey) {
  const cache = new Map(JSON.parse(sessionStorage.getItem(cacheKey)) || []);
  const keys = new Set(cache.keys());

  function isItemExpired(item) {
    return Date.now() - item.timestamp > maxAge;
  }

  function updateSessionStorage() {
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify(Array.from(cache.entries()))
    );
  }

  return {
    get(key) {
      if (cache.has(key)) {
        const item = cache.get(key);
        if (!isItemExpired(item)) {
          keys.delete(key);
          keys.add(key);
          return item.value;
        }
        cache.delete(key);
        keys.delete(key);
      }
      return undefined;
    },
    set(key, value) {
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
const CACHE_SIZE = 10;
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Factory function for cache creation
function createCache(cacheKey) {
  return createOptimizedSessionStorageCache(
    CACHE_SIZE,
    CACHE_MAX_AGE,
    cacheKey
  );
}

// Individual caches for different types of data
const animeDataCache = createCache("animeDataCache");
const animeInfoCache = createCache("animeInfoCache");
const animeEpisodesCache = createCache("animeEpisodesCache");
const videoSourcesCache = createCache("videoSourcesCache");

// Fetch data from proxy with caching
async function fetchFromProxy(url, cache, cacheKey) {
  try {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) return cachedResponse;

    const proxyUrl = `${PROXY_SERVER_BASE_URL}`;

    const response = await axiosInstance.get(proxyUrl, {
      params: { url },
    });
    const data = response.data;

    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    handleError(error, "data");
  }
}

// Function to fetch anime data
export async function fetchAnimeData(
  searchQuery = "",
  page = 1,
  perPage = 16,
  options = {}
) {
  // Destructuring options with default values
  const {
    type = "ANIME",
    season,
    format,
    sort = ["POPULARITY_DESC", "SCORE_DESC"],
    genres = [],
    id,
    year,
    status,
  } = options;

  // Building query parameters
  const queryParams = new URLSearchParams({
    ...(searchQuery && { query: searchQuery }),
    page,
    perPage,
    type,
    ...(season && { season }),
    ...(format && { format }),
    ...(id && { id }),
    ...(year && { year }),
    ...(status && { status }),
    ...(sort && { sort: JSON.stringify(sort) }),
    ...(genres.length > 0 && { genres: genres.filter((g) => g).join(",") }),
  });

  // Constructing URL and cache key
  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }meta/anilist/advanced-search?${queryParams.toString()}`;
  const cacheKey = generateCacheKey("animeData", queryParams.toString());

  // Fetching data
  return fetchFromProxy(url, animeDataCache, cacheKey);
}

// Fetch Anime Info Function
export async function fetchAnimeInfo(animeId, provider = "gogoanime") {
  const cacheKey = generateCacheKey("animeInfo", animeId, provider);
  const url = `${BASE_URL}meta/anilist/info/${animeId}`;
  const params = new URLSearchParams({ provider });

  return fetchFromProxy(
    `${url}?${params.toString()}`,
    animeInfoCache,
    cacheKey
  );
}

// Fetch List Function (adjusted for specific cases like Top Anime)
async function fetchList(type, page = 1, perPage = 16, options = {}) {
  let cacheKey, url, params;

  // Special handling for Top, Trending, and Popular Anime
  if (["Top", "Trending", "Popular"].includes(type)) {
    cacheKey = generateCacheKey(`${type}Anime`, page, perPage);
    url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`;
    params = new URLSearchParams({ page, perPage });

    // Adjusting options for Top Anime
    if (type === "Top") {
      options = {
        type: "ANIME",
        sort: ['["SCORE_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`;
    }
  } else {
    // Handling for other types if needed
  }

  const specificCache = createCache(`${type.toLowerCase()}AnimeCache`);
  return fetchFromProxy(`${url}?${params.toString()}`, specificCache, cacheKey);
}

export const fetchTopAnime = (page, perPage) => fetchList("Top", page, perPage);
export const fetchTrendingAnime = (page, perPage) =>
  fetchList("Trending", page, perPage);
export const fetchPopularAnime = (page, perPage) =>
  fetchList("Popular", page, perPage);

// ? CONSUMET VIDEO SOURCES
/* // Fetch Watch Info Function
export async function fetchWatchInfo(episodeId) {
  const cacheKey = generateCacheKey("watchInfo", episodeId);
  const url = `${BASE_URL}/meta/anilist/watch/${episodeId}`;

  return fetchFromProxy(url, watchInfoCache, cacheKey);
} */

// ! Anify info/{id}
/* // Fetch Anime Info 2 Function
export async function fetchAnimeInfo2(id, fields = []) {
  const cacheKey = generateCacheKey("animeInfo", id, fields.join("-"));
  const url = `${BASE_URL_2}info/${id}`;
  const params = new URLSearchParams(
    API_KEY
      ? { apikey: API_KEY, fields: fields.join(",") }
      : { fields: fields.join(",") }
  );

  return fetchFromProxy(
    `${url}?${params.toString()}`,
    animeInfo2Cache,
    cacheKey
  );
}
 */

// Fetch Anime Episodes Function
export async function fetchAnimeEpisodes(id) {
  const preferredProviders = ["gogoanime", "zoro", "animepache"];

  for (const providerId of preferredProviders) {
    const url = `${BASE_URL_2}episodes/${id}${
      API_KEY ? `?apiKey=${API_KEY}` : ""
    }`;
    const cacheKey = generateCacheKey("animeEpisodes", id, providerId);

    try {
      const cachedData = animeEpisodesCache.get(cacheKey);
      if (cachedData) return cachedData;

      const response = await fetchFromProxy(url, animeEpisodesCache, cacheKey);
      const providerData = response.find(
        (provider) => provider.providerId === providerId
      );
      if (providerData) {
        animeEpisodesCache.set(cacheKey, providerData);
        return providerData;
      }
    } catch (error) {
      handleError(error, "anime episodes");
    }
  }

  throw new Error("No episodes found from the preferred providers.");
}

// Fetch Episode Video URLs Function
export async function fetchEpisodeVideoUrls(
  watchId,
  partialPreload = false,
  id,
  provider,
  episodeNumber
) {
  const cacheKey = generateCacheKey(
    "videoSources",
    id,
    provider,
    episodeNumber,
    partialPreload ? "partial" : "full"
  );

  const params = new URLSearchParams({
    providerId: provider,
    watchId,
    id,
    episodeNumber,
    subType: "sub",
    ...(API_KEY && { apiKey: API_KEY }),
  });

  const url = `${BASE_URL_2}sources?${params.toString()}`;

  try {
    const cachedData = videoSourcesCache.get(cacheKey);
    if (cachedData) return cachedData;

    const response = await fetchFromProxy(url, videoSourcesCache, cacheKey);
    sessionStorage.setItem(cacheKey, JSON.stringify(response));

    return response;
  } catch (error) {
    handleError(error, "episode video URLs");
  }
}
