import './player.css';
import { useEffect, useRef, useState } from 'react';
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from '@vidstack/react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { fetchSkipTimes } from '../../../hooks/useApi';
import { fetchAnimeStreamingLinks } from '../../../hooks/useApi';

// Define types for your props
type PlayerProps = {
  episodeId: string;
  banner?: string;
  malId?: string;
};

// Define a type for the source object structure within your response
type StreamingSource = {
  url: string;
  quality: string;
};

export function Player({ episodeId, banner, malId }: PlayerProps) {
  const player = useRef<MediaPlayerInstance>(null);
  const [src, setSrc] = useState('');
  const [vttUrl, setVttUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0); // State to hold the current time

  // Utility function to extract episode number from episodeId
  const getEpisodeNumber = (id: string) => {
    const parts = id.split('-');
    return parts[parts.length - 1];
  };

  useEffect(() => {
    // Load saved playback info for all episodes from local storage
    const allPlaybackInfo = JSON.parse(
      localStorage.getItem('all_episode_times') || '{}',
    );

    // Extract playback info for the current episode
    if (allPlaybackInfo[episodeId]) {
      const { currentTime, playbackPercentage } = allPlaybackInfo[episodeId];
      setCurrentTime(parseFloat(currentTime));
      // Optionally, you can use playbackPercentage here if you have a use case for it
    }

    // Fetch and set the source for the anime video
    async function fetchAndSetAnimeSource() {
      try {
        const response = await fetchAnimeStreamingLinks(episodeId);
        const backupSource = response.sources.find(
          (source: StreamingSource) => source.quality === 'default',
        );
        if (backupSource) {
          setSrc(backupSource.url);
        } else {
          console.error('Backup source not found');
        }
      } catch (error) {
        console.error('Failed to fetch anime streaming links', error);
      }
    }

    // Fetch and process skip times for the current episode
    async function fetchAndProcessSkipTimes() {
      if (malId && episodeId) {
        const episodeNumber = getEpisodeNumber(episodeId);
        try {
          const skipTimes = await fetchSkipTimes({
            malId: malId.toString(), // Convert malId to a string if it's not already
            episodeNumber, // Use the episode number extracted from episodeId
          });
          // console.log('Skip times:', skipTimes);
          const vttContent = generateWebVTTFromSkipTimes(skipTimes);
          const blob = new Blob([vttContent], { type: 'text/vtt' });
          const vttBlobUrl = URL.createObjectURL(blob);
          setVttUrl(vttBlobUrl);
        } catch (error) {
          console.error('Failed to fetch skip times', error);
        }
      }
    }

    fetchAndSetAnimeSource();
    fetchAndProcessSkipTimes();

    return () => {
      // Cleanup logic for the component
      if (vttUrl) {
        URL.revokeObjectURL(vttUrl); // Clean up the Blob URL when the component unmounts
      }
    };
  }, [episodeId, malId]);

  useEffect(() => {
    // Set the current time of the player when it's ready
    if (player.current && currentTime) {
      player.current.currentTime = currentTime;
    }
  }, [currentTime]);

  function generateWebVTTFromSkipTimes(skipTimes: any) {
    let vttString = 'WEBVTT\n\n';

    // Sort skip times based on the `startTime`
    const sortedSkipTimes = skipTimes.results.sort((a: any, b: any) => {
      const startTimeA = a.interval.startTime;
      const startTimeB = b.interval.startTime;
      return startTimeA - startTimeB;
    });

    sortedSkipTimes.forEach((result: any) => {
      const { startTime, endTime } = result.interval;
      let skipType = result.skipType;
      // Convert 'op' to 'Opening' and 'ed' to 'Ending'
      if (skipType === 'op') {
        skipType = 'Opening';
      } else if (skipType === 'ed') {
        skipType = 'Outro';
      }

      // Exclude 'mixed-ed' and 'mixed-op' types from being added to VTT
      if (skipType !== 'mixed-ed' && skipType !== 'mixed-op') {
        const startTimeFormatted = formatTime(startTime);
        const endTimeFormatted = formatTime(endTime);
        vttString += `${startTimeFormatted} --> ${endTimeFormatted}\n`;
        vttString += `${skipType}\n\n`;
      }
    });
    return vttString;
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${padTime(minutes)}:${padTime(remainingSeconds)}`;
  }

  function padTime(value: number) {
    return value.toString().padStart(2, '0');
  }

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    _nativeEvent: MediaProviderChangeEvent, // Prefixed unused parameter with an underscore
  ) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // Simplified unused parameters with underscores
  function onCanPlay(
    _detail: MediaCanPlayDetail,
    _nativeEvent: MediaCanPlayEvent,
  ) {
    // Implementation here...
  }

  function onTimeUpdate() {
    if (player.current) {
      const currentTime = player.current.currentTime;
      const duration = player.current.duration || 1; // Prevent division by zero to avoid NaN
      const playbackPercentage = (currentTime / duration) * 100;

      const playbackInfo = {
        currentTime,
        playbackPercentage,
      };

      // Retrieve the existing playback info from local storage or initialize it if not present
      const allPlaybackInfo = JSON.parse(
        localStorage.getItem('all_episode_times') || '{}',
      );

      // Update the playback info for the current episode
      allPlaybackInfo[episodeId] = playbackInfo;

      // Save the updated info back to local storage
      localStorage.setItem(
        'all_episode_times',
        JSON.stringify(allPlaybackInfo),
      );
    }
  }

  // console.log(vttUrl);

  return (
    <>
      <MediaPlayer
        className='player'
        title=''
        src={src}
        crossorigin
        playsinline
        onProviderChange={onProviderChange}
        onCanPlay={onCanPlay}
        onTimeUpdate={onTimeUpdate} // Call onTimeUpdate when time changes
        ref={player}
        aspectRatio='16/9'
        load='eager'
        posterLoad='eager'
        streamType="on-demand"
        storage="storage-key"
      >
        <MediaProvider>
          <Poster className='vds-poster' src={banner} alt='' />
          {vttUrl && (
            <Track
              kind='chapters'
              src={vttUrl}
              default
              label='Skip Times'
            />
          )}
        </MediaProvider>

        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          // thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
        />
      </MediaPlayer>
    </>
  );
}
