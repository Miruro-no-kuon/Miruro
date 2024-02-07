import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL_2 = import.meta.env.VITE_BACKEND_URL_2;
const API_KEY = import.meta.env.VITE_API_KEY;
const PROXY_URL = import.meta.env.VITE_PROXY_URL;
const IS_LOCAL = import.meta.env.VITE_IS_LOCAL;

const PROXY_SERVER_BASE_URL =
  IS_LOCAL == "true" ? "http://192.168.1.143:5173/api" : `${PROXY_URL}`;

const axiosInstance = axios.create({
  baseURL: PROXY_SERVER_BASE_URL,
  timeout: 10000,
});

// Centralized error handling function
function handleError(error, context) {
  const errorMessage =
    error.response?.data?.message || "Unknown error occurred";
  console.error(`Error fetching ${context}: ${errorMessage}`, error);
  throw new Error(errorMessage);
}

// Helper function to generate a consistent cache key
function generateCacheKey(...args) {
  return args.join("-");
}

// Optimized LRU cache function
function createOptimizedSessionStorageCache(maxSize, maxAge) {
  const cache = new Map(JSON.parse(sessionStorage.getItem("cacheData")) || []);
  const keys = new Set(cache.keys());

  // Helper function to check if an item has expired
  function isItemExpired(item) {
    const currentTime = Date.now();
    return currentTime - item.timestamp > maxAge;
  }

  // Function to update session storage
  function updateSessionStorage() {
    sessionStorage.setItem(
      "cacheData",
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

const CACHE_SIZE = 50;
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const cachedResults = createOptimizedSessionStorageCache(
  CACHE_SIZE,
  CACHE_MAX_AGE
);

async function fetchFromProxy(url) {
  try {
    const cacheKey = generateCacheKey("proxy", url);
    const cachedResponse = cachedResults.get(cacheKey);
    if (cachedResponse) return cachedResponse;

    // Determine the correct endpoint based on IS_LOCAL
    const endpoint = IS_LOCAL == "true" ? "/text" : "/json";
    const proxyUrl = `${PROXY_SERVER_BASE_URL}${endpoint}`;

    // Make the request to the proxy
    const response = await axiosInstance.get(proxyUrl, {
      params: { url }, // Pass the original URL as a query parameter
    });
    const data = response.data;

    // Store the result in cache
    cachedResults.set(cacheKey, data);

    return data;
  } catch (error) {
    handleError(error, "data");
  }
}

//? Consumet* | miruro-api.vercel.app/

export async function fetchAnimeData(
  searchQuery = "",
  page = 1,
  perPage = 16,
  options = {},
  cacheCallback = null
) {
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

  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append("query", searchQuery);
  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());
  queryParams.append("type", type);
  if (season) queryParams.append("season", season);
  if (format) queryParams.append("format", format);
  if (id) queryParams.append("id", id);
  if (year) queryParams.append("year", year);
  if (status) queryParams.append("status", status);
  if (sort && sort.length) queryParams.append("sort", JSON.stringify(sort));
  genres.forEach((g) => g && queryParams.append("genres", g));

  const url = `${BASE_URL}meta/anilist/advanced-search?${queryParams.toString()}`;
  const cacheKey = generateCacheKey("animeData", queryParams.toString());

  const cachedData = cachedResults.get(cacheKey);
  if (cachedData) {
    if (cacheCallback) cacheCallback(true);
    return cachedData;
  }

  try {
    const response = await fetchFromProxy(url);
    const result = {
      currentPage: response.currentPage,
      hasNextPage: response.hasNextPage,
      totalPages: response.totalPages,
      totalResults: response.totalResults,
      results: response.results,
      page,
    };

    cachedResults.set(cacheKey, result);
    if (cacheCallback) cacheCallback(false);
    return result;
  } catch (error) {
    handleError(error, "anime data");
  }
}

export async function fetchAnimeInfo(animeId, provider = "gogoanime") {
  const cacheKey = generateCacheKey("animeInfo", animeId, provider);
  const cachedData = cachedResults.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const url = `${BASE_URL}meta/anilist/info/${animeId}`;
  const params = new URLSearchParams({ provider });

  try {
    const response = await fetchFromProxy(`${url}?${params.toString()}`);
    const result = response;
    cachedResults.set(cacheKey, result);
    return result;
  } catch (error) {
    handleError(error, "anime info");
  }
}

export async function fetchTopAnime(page = 1, perPage = 16) {
  const options = {
    type: "ANIME",
    sort: ["SCORE_DESC"],
  };
  return fetchAnimeData("", page, perPage, options);
}

export async function fetchTrendingAnime(page = 1, perPage = 16) {
  const cacheKey = generateCacheKey("trendingAnime", page, perPage);
  const cachedData = cachedResults.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const url = `${BASE_URL}meta/anilist/trending`;
  const params = new URLSearchParams({ page, perPage });

  try {
    const response = await fetchFromProxy(`${url}?${params.toString()}`);
    const result = {
      currentPage: response.currentPage,
      hasNextPage: response.hasNextPage,
      results: response.results,
    };

    cachedResults.set(cacheKey, result);
    return result;
  } catch (error) {
    handleError(error, "trending anime data");
  }
}

export async function fetchPopularAnime(page = 1, perPage = 16) {
  const cacheKey = generateCacheKey("popularAnime", page, perPage);
  const cachedData = cachedResults.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const url = `${BASE_URL}meta/anilist/popular`;
  const params = new URLSearchParams({ page, perPage });

  try {
    const response = await fetchFromProxy(`${url}?${params.toString()}`);
    const result = {
      currentPage: response.currentPage,
      hasNextPage: response.hasNextPage,
      results: response.results,
    };

    cachedResults.set(cacheKey, result);
    return result;
  } catch (error) {
    handleError(error, "popular anime data");
  }
}

export async function fetchWatchInfo(episodeId) {
  const cacheKey = generateCacheKey("watchInfo", episodeId);
  const cachedData = cachedResults.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const url = `${BASE_URL}/meta/anilist/watch/${episodeId}`;
  try {
    const response = await fetchFromProxy(url);
    cachedResults.set(cacheKey, response);
    return response;
  } catch (error) {
    handleError(error, "watch info");
  }
}

//? Anify* | localhost:3060/

export async function fetchAnimeInfo2(id, fields = []) {
  const cacheKey = generateCacheKey("animeInfo", id, fields.join("-"));
  const cachedData = cachedResults.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const url = `${BASE_URL_2}info/${id}`;
  const params = new URLSearchParams(API_KEY ? { apikey: API_KEY } : {});

  // Append 'fields' to the parameters only if it's not empty
  if (fields.length > 0) {
    params.append("fields", fields.join(","));
  }

  try {
    const response = await fetchFromProxy(`${url}?${params.toString()}`);
    const result = response;
    cachedResults.set(cacheKey, result);
    return result;
  } catch (error) {
    handleError(error, "anime info");
  }
}

export async function fetchAnimeEpisodes(id) {
  const preferredProviders = ["gogoanime", "zoro", "animepache"];

  try {
    for (const providerId of preferredProviders) {
      const url = `${BASE_URL_2}episodes/${id}${
        API_KEY ? `?apiKey=${API_KEY}` : ""
      }`;
      const cacheKey = generateCacheKey("animeEpisodes", id, providerId);

      const cachedData = cachedResults.get(cacheKey);
      if (cachedData) return cachedData;

      const response = await fetchFromProxy(url);
      const providerData = response.find(
        (provider) => provider.providerId === providerId
      );
      if (providerData) {
        cachedResults.set(cacheKey, providerData);
        return providerData;
      }
    }

    throw new Error("No episodes found from the preferred providers.");
  } catch (error) {
    handleError(error, "anime episodes");
  }
}

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
  try {
    const params = new URLSearchParams({
      providerId: provider,
      watchId: watchId,
      id: id,
      episodeNumber: episodeNumber,
      subType: "sub",
      ...(API_KEY ? { apiKey: API_KEY } : {}),
    });

    const url = `${BASE_URL_2}sources?${params.toString()}`;

    const cachedData = cachedResults.get(cacheKey);
    if (cachedData) return cachedData;

    const response = await fetchFromProxy(url);
    const responseData = JSON.stringify(response);

    // Store the result in session storage
    sessionStorage.setItem(cacheKey, responseData);

    return response;
  } catch (error) {
    handleError(error, "episode video URLs");
  }
}
