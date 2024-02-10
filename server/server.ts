import express, { Request, Response } from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { createLogger, transports, format, Logger } from "winston";
import chalk from "chalk";

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5173;

const { combine, timestamp, printf } = format;

const colors: { [key: string]: Function } = {
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  info: chalk.green.bold,
  gray: chalk.gray,
};

const logger: Logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    printf(({ timestamp, level, message }) => {
      const formattedLevel = colors[level]
        ? colors[level](level.toUpperCase())
        : level.toUpperCase();
      const parts = message.split("from ");
      const formattedMessage = `${formattedLevel}: ${parts[0]
        }${colors.gray("from ")}${colors.gray(parts[1])}`;

      return `${timestamp} ${formattedMessage}\n`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "server.log" }),
  ],
});

app.use(cors());
app.use(express.static(path.join(__dirname, "../dist")));

const proxyHandler = async (
  req: Request,
  res: Response,
  contentType: string
): Promise<void> => {
  const url: string | string[] | undefined = req.query.url as string;
  if (!url) {
    const errorMessage: string = "URL parameter is required";
    logger.error(errorMessage);
    res.status(400).send(errorMessage);
    return; // Return early without continuing further
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${contentType} data from ${url}`);
    }

    // Check if content type is JSON and parse accordingly
    const data =
      contentType === "application/json"
        ? await response.json()
        : await response.text();
    res.header("Content-Type", contentType);
    res.send(data);
    logger.info(`Successfully fetched ${contentType} data from ${url}`);
  } catch (error) {
    handleError(res, contentType, error);
  }
};


const handleError = (res: Response, contentType: string, error: any): void => {
  const errorMessage = `Error fetching ${contentType}: ${error.message}`;
  logger.error(errorMessage);
  res.status(500).send(`Error occurred while fetching ${contentType} data`);
};


app.get("/api/vtt", async (req: Request, res: Response) => {
  try {
    await proxyHandler(req, res, "text/vtt");
  } catch (error) {
    handleError(res, "text/vtt", error);
  }
});

app.get("/api/m3u8", async (req: Request, res: Response) => {
  try {
    await proxyHandler(req, res, "application/x-mpegURL");
  } catch (error) {
    handleError(res, "application/x-mpegURL", error);
  }
});

app.get("/api/text", async (req: Request, res: Response) => {
  try {
    await proxyHandler(req, res, "text/plain");
  } catch (error) {
    handleError(res, "text/plain", error);
  }
});

app.get("/api/json", async (req: Request, res: Response) => {
  try {
    await proxyHandler(req, res, "application/json");
  } catch (error) {
    handleError(res, "application/json", error);
  }
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"), (err) => {
    if (err) {
      handleError(res, "index.html", err);
    }
  });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}\n`);
});
