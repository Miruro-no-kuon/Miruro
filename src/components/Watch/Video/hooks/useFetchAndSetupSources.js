import { useEffect } from "react";
import { fetchEpisodeVideoUrls } from "../../../../hooks/useApi";

const useFetchAndSetupSources = (
  watchId,
  shouldPreload,
  id,
  provider,
  episodeNumber,
  isLoading,
  setIsLoading,
  videoSources,
  setVideoSources,
  videoQualityOptions,
  setVideoQualityOptions,
  selectedSource,
  setSelectedSource,
  subtitleTracks,
  setSubtitleTracks,
  error,
  setError,
  currentTime,
  setCurrentTime,
  videoRef
) => {
  useEffect(() => {
    const deduplicateSources = (sources) => {
      const uniqueQualities = new Set();

      return sources
        .map((source) => {
          if (source.quality === "default") {
            source.quality = "auto"; // Change "default" to "auto"
          }
          if (!uniqueQualities.has(source.quality)) {
            uniqueQualities.add(source.quality);
            return source;
          }
          return null; // Filter out duplicate qualities
        })
        .filter(Boolean) // Remove null values from the result
        .sort((a, b) => {
          // Extract numbers from the quality strings
          const extractNumber = (str) => parseInt(str.match(/\d+/)[0], 10);
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

    const addSubtitlesToVideo = (tracks) => {
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
          videoRef.current.appendChild(trackElement);
        });
      }
    };

    const fetchAndSetupSources = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEpisodeVideoUrls(
          watchId,
          shouldPreload,
          id,
          provider,
          episodeNumber
        );

        // Add your proxy base URL for M3U8 URLs
        const uniqueSources = deduplicateSources(data.sources);

        setVideoSources(uniqueSources);
        setVideoQualityOptions(uniqueSources.map((source) => source.quality));
        const initialSource = uniqueSources[0]?.url;

        setSelectedSource(initialSource);

        const processedSubtitles = data.subtitles
          .filter((sub) => sub.lang !== "Thumbnails")
          .map((sub) => ({
            label: sub.lang,
            src: `/api/vtt?url=${sub.url}`,
            kind: "subtitles",
          }));

        setSubtitleTracks(processedSubtitles);
        addSubtitlesToVideo(processedSubtitles);

        const savedTime =
          parseFloat(localStorage.getItem(`savedTime-${watchId}`)) || 0;
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
  }, [watchId, shouldPreload, id, provider, episodeNumber]);

  return {};
};

export default useFetchAndSetupSources;
