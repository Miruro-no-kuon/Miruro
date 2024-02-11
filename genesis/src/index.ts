/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/**
 * Cloudflare Workers script for proxying requests and adding CORS headers.
 * This script listens for fetch events and routes requests based on the pathname.
 */

/**
 * @description Cloudflare Workers script for proxying requests and adding CORS headers.
 * This script listens for fetch events and routes requests based on the pathname.
 * @event fetch
 * @param {Event} event - The fetch event object
 * @returns {Response} - The response to the request
 */

// Event listener for fetch events
addEventListener("fetch", (event: FetchEvent) => {
	event.respondWith(handleRequest(event));
});

/**
 * @description Handles incoming requests and routes them accordingly.
 * @param {Event} event - The fetch event object
 * @returns {Response} - The response to the request
 */
async function handleRequest(event: FetchEvent): Promise<Response> {
	const request = event.request;
	const url = new URL(request.url);
	const pathname = url.pathname;
	const urlParam = url.searchParams.get("url");

	// Return a Welcome message for the root ("/") route
	if (pathname === "/") {
		return new Response("Welcome to genesis proxy! 🧪", {
			status: 200,
			headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
		});
	}

	// Return a message for the "/api" route
	if (pathname === "/api") {
		return new Response("Welcome to the genesis /api route!", {
			status: 200,
			headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
		});
	}

	// Check if the 'url' parameter is provided
	if (!urlParam) {
		// If 'url' parameter is missing, provide route explanation
		if (pathname.startsWith("/api/vtt")) {
			return provideRouteExplanation("/api/vtt", "text/vtt");
		} else if (pathname.startsWith("/api/m3u8")) {
			return provideRouteExplanation("/api/m3u8", "application/x-mpegURL");
		} else if (pathname.startsWith("/api/text")) {
			return provideRouteExplanation("/api/text", "text/plain");
		} else if (pathname.startsWith("/api/json")) {
			return provideRouteExplanation("/api/json", "application/json");
		} else {
			return jsonResponse({ error: "Not Found", status: 404 }, 404);
		}
	}

	// Perform the actual functionality of the route
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
			return jsonResponse({ error: "Not Found", status: 404 }, 404);
		}
	} catch (error) {
		return jsonResponse({ error: `Error: ${(error as Error).message}`, status: 500 }, 500);
	}
}

/**
 * @description Provides an explanation for the route.
 * @param {string} path - The route path
 * @param {string} contentType - The content type of the response
 * @returns {Response} - The response with route explanation
 */
async function provideRouteExplanation(path: string, contentType: string): Promise<Response> {
	const explanation = {
		path: path,
		contentType: contentType,
		description: "This route proxies requests to a specified URL and adds CORS headers. It expects a 'url' parameter with the target URL to fetch.",
		usage: `Use this route by appending the 'url' parameter like this: ${path}?url=[your-url-here]`,
		example: `${path}?url=https://example.com/data`
	};

	return jsonResponse(explanation, 200);
}

/**
 * @description Creates a JSON response.
 * @param {object} data - The data to be included in the response
 * @param {number} status - The status code of the response
 * @returns {Response} - The JSON response
 */
function jsonResponse(data: object, status: number): Response {
	return new Response(JSON.stringify(data), {
		status: status,
		headers: { 'Content-Type': 'application/json' }
	});
}

// Interface to extend CacheStorage with default property
interface ExtendedCacheStorage extends CacheStorage {
	default: Cache;
}

/**
 * @description Handles proxying requests and caching responses.
 * @param {Event} event - The fetch event object
 * @param {string} contentType - The content type of the response
 * @returns {Response} - The proxied response
 */
async function handleProxy(event: FetchEvent, contentType: string): Promise<Response> {
	const request = event.request;
	const cacheUrl = new URL(request.url);
	const cacheKey = new Request(cacheUrl.toString(), request);
	const cache = (caches as ExtendedCacheStorage).default;

	let response = await cache.match(cacheKey);
	if (!response) {
		response = await proxyHandler(request, contentType);
		response = new Response(response.body, response);
		response.headers.append("Cache-Control", "s-maxage=3600");
		event.waitUntil(cache.put(cacheKey, response.clone()));
	}

	return response;
}

/**
 * @description Proxies the request to the specified URL and adds CORS headers.
 * @param {Request} request - The request object
 * @param {string} contentType - The content type of the response
 * @returns {Response} - The proxied response
 */
async function proxyHandler(request: Request, contentType: string): Promise<Response> {
	const urlParam = new URL(request.url).searchParams.get("url");
	if (!urlParam) {
		return new Response(JSON.stringify({ error: "URL parameter is required", requiredParameter: "url" }), { status: 400 });
	}

	try {
		const response = await fetch(urlParam);
		const headers = new Headers(response.headers);
		headers.set("Access-Control-Allow-Origin", "*");
		headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		headers.set("Access-Control-Allow-Headers", "Content-Type");

		if (contentType === "application/json") {
			const data = await response.text();
			try {
				const jsonData = JSON.parse(data);
				return new Response(JSON.stringify(jsonData, null, 2), {
					status: 200,
					headers,
				});
			} catch (error) {
				return new Response(JSON.stringify({ error: `Error parsing JSON: ${(error as Error).message}` }), {
					status: 400,
					headers,
				});
			}
		} else {
			const data = contentType.includes("text/") ? await response.text() : await response.arrayBuffer();
			return new Response(data, {
				status: 200,
				headers,
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: `Error fetching ${contentType}: ${(error as Error).message}` }), {
			status: 500,
		});
	}
}
