import { useEffect } from 'react';
import { fetchAnimeStreamingLinks } from '../../../../hooks/useApi';

// Define the types for VideoSource
type VideoSource = {
  quality: string;
  url: string;
};

export const useFetchSources = (
  episodeId: string,
  setVideoSources: (sources: VideoSource[]) => void,
  setVideoQualityOptions: (options: string[]) => void,
) => {
  useEffect(() => {
    const deduplicateAndProcessSources = (
      sources: VideoSource[],
    ): VideoSource[] => {
      const uniqueQualities = new Set();
      return sources
        .filter((source) => source.quality.toLowerCase() !== 'backup')
        .map((source) => ({
          ...source,
          quality:
            source.quality.toLowerCase() === 'default'
              ? 'auto'
              : source.quality,
        }))
        .filter((source) => {
          if (!uniqueQualities.has(source.quality.toLowerCase())) {
            uniqueQualities.add(source.quality.toLowerCase());
            return true;
          }
          return false;
        })
        .sort((a, b) => {
          if (!a || !b) return 0;
          const extractNumber = (str: string) =>
            parseInt(str.match(/\d+/)?.[0] ?? '0', 10);
          const qualityA = a.quality.toLowerCase();
          const qualityB = b.quality.toLowerCase();

          if (qualityA === 'auto' && qualityB !== 'auto') return 1;
          if (qualityA !== 'auto' && qualityB === 'auto') return -1;

          if (qualityA.includes('p') && qualityB.includes('p')) {
            const numberA = extractNumber(qualityA);
            const numberB = extractNumber(qualityB);
            return numberB - numberA;
          }

          return qualityA.localeCompare(qualityB);
        });
    };

    const fetchAndSetupSources = async () => {
      try {
        const data = await fetchAnimeStreamingLinks(episodeId);
        // Process and deduplicate sources
        const uniqueSources = deduplicateAndProcessSources(data.sources);
        setVideoSources(uniqueSources);
        setVideoQualityOptions(uniqueSources.map((source) => source.quality));
      } catch (error) {
        console.error('Error fetching sources:', error);
      }
    };

    fetchAndSetupSources();
  }, [episodeId, setVideoSources, setVideoQualityOptions]);

  return {};
};
