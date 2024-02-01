addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    if (pathname.startsWith("/api/vtt")) {
      return proxyHandler(request, "text/vtt");
    } else if (pathname.startsWith("/api/m3u8")) {
      return proxyHandler(request, "application/x-mpegURL");
    } else if (pathname.startsWith("/api/text")) {
      return proxyHandler(request, "text/plain");
    } else if (pathname.startsWith("/api/json")) {
      // Adding handling for JSON content type
      return proxyHandler(request, "application/json");
    } else {
      return new Response("Not Found", { status: 404 });
    }
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
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
