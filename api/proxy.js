import fetch from "node-fetch";
import { createLogger, transports, format } from "winston";
import chalk from "chalk";

// Initialize Winston logger
const { combine, timestamp, printf } = format;
const colors = {
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  info: chalk.green.bold,
  gray: chalk.gray,
};

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    printf(({ timestamp, level, message }) => {
      const formattedLevel = colors[level]
        ? colors[level](level.toUpperCase())
        : level.toUpperCase();
      const parts = message.split("from ");
      const formattedMessage = `${formattedLevel}: ${parts[0]}${colors.gray(
        "from "
      )}${colors.gray(parts[1])}`;
      return `${timestamp} ${formattedMessage}\n`;
    })
  ),
  transports: [new transports.Console()],
});

// Proxy handler function
const proxyHandler = async (req, contentType) => {
  const url = req.query.url;
  if (!url) {
    const errorMessage = "URL parameter is required";
    logger.error(errorMessage);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: errorMessage }),
    };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${contentType} data from ${url}`);
    }

    const data = await response.text();
    logger.info(`Successfully fetched ${contentType} data from ${url}`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*", // Set appropriate CORS headers
        // Additional headers can be added here if needed
      },
      body: data,
    };
  } catch (error) {
    const errorMessage = `Error fetching ${contentType}: ${error.message}`;
    logger.error(errorMessage);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

// Main handler function for serverless function
export default async function handler(req, res) {
  const { path } = req.query;

  switch (path[0]) {
    case "api":
      // Handle API proxy routes
      const contentType = path[1];
      const result = await proxyHandler(req, contentType);
      res
        .status(result.statusCode)
        .setHeader("Content-Type", result.headers["Content-Type"])
        .end(result.body);
      break;

    default:
      // Handle unknown routes
      res.status(404).send("Not Found");
      break;
  }
}
