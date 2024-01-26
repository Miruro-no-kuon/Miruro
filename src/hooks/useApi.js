import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL_2 = import.meta.env.VITE_BACKEND_URL_2;
const API_KEY = import.meta.env.VITE_API_KEY;
const PROXY_SERVER_BASE_URL = import.meta.env.IS_SERVERLESS
  ? "/api"
  : "http://localhost:5173/api";

const axiosInstance = axios.create({
  baseURL: PROXY_SERVER_BASE_URL,
  timeout: 10000, // Set a reasonable timeout
});

// Centralized error handling function
function handleError(error, context) {
  const errorMessage =
    error.response?.data?.message || "Unknown error occurred";
  console.error(`Error fetching ${context}: ${errorMessage}`, error);
  throw new Error(errorMessage);
}

// Create an LRU cache function with session storage
function createSessionStorageCache(maxSize, maxAge) {
  const cache = new Map(JSON.parse(sessionStorage.getItem("cacheData")) || []);
  const keys = JSON.parse(sessionStorage.getItem("cacheKeys")) || [];
  let pendingCacheUpdate = false;

  function updateSessionStorage() {
    if (!pendingCacheUpdate) {
      pendingCacheUpdate = true;
      setTimeout(() => {
        sessionStorage.setItem(
          "cacheData",
          JSON.stringify(Array.from(cache.entries()))
        );
        sessionStorage.setItem("cacheKeys", JSON.stringify(keys));
        pendingCacheUpdate = false;
      }, 1000); // Update session storage every second
    }
  }

  // Function to check if an item has expired
  function isItemExpired(item) {
    const currentTime = Date.now();
    return currentTime - item.timestamp > maxAge;
  }

  return {
    get(key) {
      if (cache.has(key)) {
        const item = cache.get(key);
        if (!isItemExpired(item)) {
          const index = keys.indexOf(key);
          keys.splice(index, 1);
          keys.unshift(key);
          updateSessionStorage();
          return item.value;
        }
        // If the item is expired, remove it from the cache
        cache.delete(key);
      }
      return undefined;
    },
    set(key, value) {
      if (cache.size >= maxSize) {
        const lastKey = keys.pop();
        cache.delete(lastKey);
      }
      keys.unshift(key);
      cache.set(key, { value, timestamp: Date.now() });
      updateSessionStorage();
    },
  };
}

const CACHE_SIZE = 50;
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const cachedResults = createSessionStorageCache(CACHE_SIZE, CACHE_MAX_AGE);

async function fetchFromProxy(url) {
  try {
    const cachedResponse = cachedResults.get(url);
    if (cachedResponse) return cachedResponse;

    const response = await axiosInstance.get("/text", {
      params: { url },
    });
    const data = response.data;

    // Store the result in cache
    cachedResults.set(url, data);

    return data;
  } catch (error) {
    handleError(error, "data");
  }
}

export async function fetchAnimeData(
  searchQuery,
  page = 1,
  perPage = 12,
  cacheCallback = null
) {
  const cacheKey = `animeData-${searchQuery}-${page}-${perPage}`;

  // Try to get data from cache
  const cachedData = cachedResults.get(cacheKey);
  if (cachedData) {
    if (cacheCallback) {
      cacheCallback(true); // Indicate data is from cache
    }
    return cachedData;
  }

  const queryParams = new URLSearchParams();
  if (searchQuery) {
    queryParams.append("query", searchQuery);
  }
  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());
  const url = `${BASE_URL}meta/anilist/advanced-search?${queryParams.toString()}`;

  try {
    const response = await fetchFromProxy(url);
    const totalPages = Math.ceil(response.totalResults / perPage);
    const result = {
      results: response.results,
      totalPages: totalPages,
      hasNextPage: response.hasNextPage,
    };

    // Store the result in cache
    cachedResults.set(cacheKey, result);

    if (cacheCallback) {
      cacheCallback(false); // Indicate data is from network
    }

    return result;
  } catch (error) {
    handleError(error, "anime data");
  }
}

export async function fetchAnimeEpisodes(id) {
  const preferredProviders = ["gogoanime", "zoro", "animepache"];

  try {
    for (const providerId of preferredProviders) {
      const url = `${BASE_URL_2}episodes/${id}${
        API_KEY ? `?apiKey=${API_KEY}` : ""
      }`;
      const response = await fetchFromProxy(url);
      const providerData = response.find(
        (provider) => provider.providerId === providerId
      );
      if (providerData) {
        return providerData;
      }
    }

    throw new Error("No episodes found from the preferred providers.");
  } catch (error) {
    handleError(error, "anime info");
  }
}

export async function fetchEpisodeVideoUrls(
  watchId,
  partialPreload = false,
  id,
  provider,
  episodeNumber
) {
  const cacheKey = `video-sources-${id}-${provider}-${episodeNumber}-${
    partialPreload ? "partial" : "full"
  }`;
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
    const response = await fetchFromProxy(url);
    const responseData = JSON.stringify(response);

    // Store the result in session storage
    sessionStorage.setItem(cacheKey, responseData);

    return response;
  } catch (error) {
    handleError(error, "episode video URLs");
  }
}
