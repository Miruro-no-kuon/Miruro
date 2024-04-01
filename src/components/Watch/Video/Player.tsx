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
import styled from 'styled-components';
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from 'react-icons/tb';
import { FaCheck } from 'react-icons/fa6';
import { RiCheckboxBlankFill } from 'react-icons/ri';
// Define types for your props
type PlayerProps = {
  episodeId: string;
  banner?: string;
  malId?: string;
  updateDownloadLink: (link: string) => void;
};

// Define a type for the source object structure within your response
type StreamingSource = {
  url: string;
  quality: string;
};

const ButtonBase = styled.button`
  padding: 0.25rem;
  font-size: 0.8rem;
  border: none;
  margin-right: 0.25rem;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  background-color: var(--global-div);
  color: var(--global-text);
  svg {
    margin-bottom: -0.1rem;
    color: grey;
  }
  @media (max-width: 500px) {
    font-size: 0.7rem;
  }
`;

const Button = styled(ButtonBase)`
  &.active {
    background-color: var(--primary-accent);
  }
  ${({ autoskip }) =>
    autoskip &&
    `
    color: #d69e00; // Text color
    svg {
      color: #d69e00; // Icon color
    }
  `}
`;

export function Player({
  episodeId,
  banner,
  malId,
  updateDownloadLink,
}: PlayerProps) {
  const player = useRef<MediaPlayerInstance>(null);
  const [src, setSrc] = useState('');
  const [vttUrl, setVttUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0); // State to hold the current time
  // State for controlling the new features
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);
  const [skipTimes, setSkipTimes] = useState([]);
  // Handlers for button clicks
  // Utility function to extract episode number from episodeId
  const getEpisodeNumber = (id: string) => {
    const parts = id.split('-');
    return parts[parts.length - 1];
  };

  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('autoPlay') === 'true';
    const savedAutoNext = localStorage.getItem('autoNext') === 'true';
    const savedAutoSkip = localStorage.getItem('autoSkip') === 'true';

    setAutoPlay(savedAutoPlay);
    setAutoNext(savedAutoNext);
    setAutoSkip(savedAutoSkip);
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
          // Assuming `response.download` exists and contains the URL
          updateDownloadLink(response.download); // Update parent component's state
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
          const response = await fetchSkipTimes({
            malId: malId.toString(), // Convert malId to a string if it's not already
            episodeNumber, // Use the episode number extracted from episodeId
          });
          const vttContent = generateWebVTTFromSkipTimes(response); // Assuming response is directly usable or adjust accordingly
          const blob = new Blob([vttContent], { type: 'text/vtt' });
          const vttBlobUrl = URL.createObjectURL(blob);
          setVttUrl(vttBlobUrl);
          setSkipTimes(response.results); // Update skipTimes state with fetched data
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
  }, [episodeId, malId, updateDownloadLink]);
  useEffect(() => {
    if (autoPlay && player.current) {
      player.current
        .play()
        .catch((e) =>
          console.log('Playback failed to start automatically:', e),
        );
    }
  }, [autoPlay, src]);
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
      const currentTime = player.current.currentTime; // Get the current playback time
      const duration = player.current.duration || 1; // Get the video duration, defaulting to 1 to avoid division by zero

      // Update the playback information
      const playbackPercentage = (currentTime / duration) * 100;
      const playbackInfo = {
        currentTime,
        playbackPercentage,
      };

      // Retrieve the existing playback info from local storage or initialize it if not present
      const allPlaybackInfo = JSON.parse(
        localStorage.getItem('all_episode_times') || '{}',
      );

      // Update the playback info for the current episode in the local storage
      allPlaybackInfo[episodeId] = playbackInfo;
      localStorage.setItem(
        'all_episode_times',
        JSON.stringify(allPlaybackInfo),
      );

      // Auto-skip logic: Check if autoSkip is enabled and there are skip times available
      if (autoSkip && skipTimes.length) {
        const skipInterval = skipTimes.find(
          ({ interval }) =>
            currentTime >= interval.startTime && currentTime < interval.endTime,
        );

        // If a skip interval is found, move the playback time to the end of this interval
        if (skipInterval) {
          player.current.currentTime = skipInterval.interval.endTime;
        }
      }
    }
  }
  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    localStorage.setItem('autoPlay', !autoPlay);
  };

  const toggleAutoNext = () => {
    setAutoNext(!autoNext);
    localStorage.setItem('autoNext', !autoNext);
  };

  const toggleAutoSkip = () => {
    setAutoSkip(!autoSkip);
    localStorage.setItem('autoSkip', !autoSkip);
  };

  // console.log(vttUrl);

  return (
    <>
      <MediaPlayer
        className='player'
        title=''
        src={src}
        autoplay={autoPlay}
        crossorigin
        playsinline
        onProviderChange={onProviderChange}
        onCanPlay={onCanPlay}
        onTimeUpdate={onTimeUpdate} // Call onTimeUpdate when time changes
        ref={player}
        aspectRatio='16/9'
        load='eager'
        posterLoad='eager'
        streamType='on-demand'
        storage='storage-key'
      >
        <MediaProvider>
          <Poster className='vds-poster' src={banner} alt='' />
          {vttUrl && (
            <Track kind='chapters' src={vttUrl} default label='Skip Times' />
          )}
        </MediaProvider>

        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          // thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
        />
      </MediaPlayer>
      <div
        className='player-menu'
        style={{
          backgroundColor: 'var(--global-div-tr)',
          borderRadius: 'var(--global-border-radius)', // Corrected syntax
        }}
      >
        <Button onClick={toggleAutoPlay}>
          {autoPlay ? <FaCheck /> : <RiCheckboxBlankFill />} Autoplay
        </Button>
        <Button autoskip onClick={toggleAutoSkip}>
          {autoSkip ? <FaCheck /> : <RiCheckboxBlankFill />} Auto Skip
        </Button>
        <Button>
          <TbPlayerTrackPrevFilled /> Prev
        </Button>
        <Button>
          <TbPlayerTrackNextFilled /> Next
        </Button>
        <Button onClick={toggleAutoNext}>
          {autoNext ? <FaCheck /> : <RiCheckboxBlankFill />} Auto Next
        </Button>
      </div>
    </>
  );
}
