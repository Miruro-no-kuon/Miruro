/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "bun run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "bun run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    if (pathname.startsWith("/api/vtt")) {
      return handleProxy(event, "text/vtt");
    } else if (pathname.startsWith("/api/m3u8")) {
      return handleProxy(event, "application/x-mpegURL");
    } else if (pathname.startsWith("/api/text")) {
      return handleProxy(event, "text/plain");
    } else if (pathname.startsWith("/api/json")) {
      return handleProxy(event, "application/json");
    } else {
      return new Response("Not Found", { status: 404 });
    }
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

interface ExtendedCacheStorage extends CacheStorage {
  default: Cache;
}

async function handleProxy(event, contentType) {
  const request = event.request;
  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString(), request);
  const cache = (caches as ExtendedCacheStorage).default;

  // Check whether the response is already in the cache
  let response = await cache.match(cacheKey);
  if (!response) {
    // If not in cache, fetch from the network
    response = await proxyHandler(request, contentType);

    // Update the cache with the fetched response
    response = new Response(response.body, response);
    response.headers.append("Cache-Control", "s-maxage=3600"); // Adjust cache duration as needed
    event.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
}

async function proxyHandler(request, contentType) {
  const urlParam = new URL(request.url).searchParams.get("url");
  if (!urlParam) {
    return new Response("URL parameter is required", { status: 400 });
  }

  try {
    const response = await fetch(urlParam);
    if (contentType === "application/json") {
      // Assuming the content is JSON, parse it and then stringify to format
      const data = await response.text();
      try {
        // This will reformat the text to JSON if it's already JSON
        const jsonData = JSON.parse(data);
        return new Response(JSON.stringify(jsonData, null, 2), {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error) {
        // If parsing fails, return an error message
        return new Response(`Error parsing JSON: ${error.message}`, {
          status: 400,
        });
      }
    } else {
      // For other content types, handle as before
      const data = contentType.includes("text/")
        ? await response.text()
        : await response.arrayBuffer();
      return new Response(data, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (error) {
    return new Response(`Error fetching ${contentType}: ${error.message}`, {
      status: 500,
    });
  }
}
