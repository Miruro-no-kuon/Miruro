import { useEffect, RefObject } from "react";
import { fetchAnimeStreamingLinks } from "../../../../hooks/useApi";

const useFetchAndSetupSources = (
  episodeId: string,
  setIsLoading: (isLoading: boolean) => void,
  setVideoSources: (sources: VideoSource[]) => void,
  setVideoQualityOptions: (options: string[]) => void,
  setSelectedSource: (source: string) => void,
  setSubtitleTracks: (tracks: SubtitleTrack[]) => void,  // Added this line
  setCurrentTime: (time: number) => void,               // Added this line
  setError: (error: string) => void,
  videoRef: RefObject<HTMLVideoElement>
) => {
  useEffect(() => {
    const deduplicateAndProcessSources = (sources: VideoSource[]): VideoSource[] => {
      const uniqueQualities = new Set();
      return sources
        .filter(source => {
          if (!uniqueQualities.has(source.quality)) {
            uniqueQualities.add(source.quality);
            return true;
          }
          return false;
        })
        .sort((a, b) => {
          if (!a || !b) return 0; // Null check for 'a' and 'b'
          // Extract numbers from the quality strings
          const extractNumber = (str: string) => parseInt(str.match(/\d+/)?.[0] ?? '0', 10);
          const qualityA = a.quality.toLowerCase();
          const qualityB = b.quality.toLowerCase();

          if (qualityA === "auto" && qualityB !== "auto") return 1;
          if (qualityA !== "auto" && qualityB === "auto") return -1;

          if (qualityA.includes("p") && qualityB.includes("p")) {
            // Extract and compare numbers if both have "p" (e.g., "1080p", "720p")
            const numberA = extractNumber(qualityA);
            const numberB = extractNumber(qualityB);
            return numberB - numberA; // Sort in descending order
          }

          return qualityA.localeCompare(qualityB);
        });
    };

    const addSubtitlesToVideo = (tracks: SubtitleTrack[]): void => {
      if (!Array.isArray(tracks) && typeof tracks === "object") {
        tracks = [tracks];
      }

      if (videoRef.current && Array.isArray(tracks)) {
        videoRef.current.innerHTML = ""; // Clear existing tracks

        tracks.forEach((track) => {
          const trackElement = document.createElement("track");
          trackElement.kind = "subtitles";
          trackElement.label = track.label;
          trackElement.src = track.src;
          trackElement.default = track.label === "English";
          if (videoRef.current) {
            videoRef.current.appendChild(trackElement);
          }
        });
      }
    };

    const fetchAndSetupSources = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAnimeStreamingLinks(episodeId);

        // Process and deduplicate sources
        const uniqueSources = deduplicateAndProcessSources(data.sources);
        setVideoSources(uniqueSources);
        setVideoQualityOptions(uniqueSources.map((source) => source.quality));

        // Select the initial source
        const initialSource = uniqueSources[0]?.url;
        setSelectedSource(initialSource);

        /* const processedSubtitles = data.subtitles
          .filter((sub: SubtitleTrack) => sub.lang !== "Thumbnails")
          .map((sub: SubtitleTrack) => ({
            label: sub.lang,
            src: `/api/vtt?url=${sub.url}`,
            kind: "subtitles",
          }));

        setSubtitleTracks(processedSubtitles);
        addSubtitlesToVideo(processedSubtitles); */

        const savedTimeString = localStorage.getItem(`savedTime-${episodeId}`);
        const savedTime = savedTimeString ? parseFloat(savedTimeString) : 0;

        setCurrentTime(savedTime);
        if (videoRef.current) {
          videoRef.current.currentTime = savedTime;
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
        setError("Failed to fetch video sources");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetupSources();
  }, [episodeId]);

  return {};
};

export default useFetchAndSetupSources;

// Define the types for VideoSource and SubtitleTrack
type VideoSource = {
  quality: string;
  url: string;
};

type SubtitleTrack = {
  label: string;
  src: string;
  kind: string;
  lang: string;
  url: string;
};