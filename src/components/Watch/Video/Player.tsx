import { useEffect, useRef, useState } from 'react';
import './player.css';
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  type MediaPlayerInstance,
} from '@vidstack/react';
import styled from 'styled-components';
import { fetchSkipTimes, fetchAnimeStreamingLinks } from '../../../index';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from 'react-icons/tb';
import { FaCheck } from 'react-icons/fa6';
import { RiCheckboxBlankFill } from 'react-icons/ri';

const Button = styled.button<{ $autoskip?: boolean }>`
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

  &.active {
    background-color: var(--primary-accent);
  }
  ${({ $autoskip }) =>
    $autoskip &&
    `
    color: #d69e00; 
    svg {
      color: #d69e00; 
    }
  `}
`;

type PlayerProps = {
  episodeId: string;
  banner?: string;
  malId?: string;
  updateDownloadLink: (link: string) => void;
};

type StreamingSource = {
  url: string;
  quality: string;
};

type SkipTime = {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: string;
};

export function Player({
  episodeId,
  banner,
  malId,
  updateDownloadLink,
}: PlayerProps) {
  const player = useRef<MediaPlayerInstance>(null);
  const [src, setSrc] = useState('');
  const [vttUrl, setVttUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);
  const [skipTimes, setSkipTimes] = useState<SkipTime[]>([]);

  const getEpisodeNumber = (id: string) => {
    const parts = id.split('-');
    return parts[parts.length - 1];
  };
  const episodeNumber = getEpisodeNumber(episodeId);
  const animeVideoTitle = document.title.replace('Miruro | ', '');

  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('autoPlay') === 'true';
    const savedAutoNext = localStorage.getItem('autoNext') === 'true';
    const savedAutoSkip = localStorage.getItem('autoSkip') === 'true';

    setAutoPlay(savedAutoPlay);
    setAutoNext(savedAutoNext);
    setAutoSkip(savedAutoSkip);

    const allPlaybackInfo = JSON.parse(
      localStorage.getItem('all_episode_times') || '{}',
    );

    if (allPlaybackInfo[episodeId]) {
      const { currentTime } = allPlaybackInfo[episodeId];
      setCurrentTime(parseFloat(currentTime));
    }

    async function fetchAndSetAnimeSource() {
      try {
        const response = await fetchAnimeStreamingLinks(episodeId);
        const backupSource = response.sources.find(
          (source: StreamingSource) => source.quality === 'default',
        );
        if (backupSource) {
          setSrc(backupSource.url);
          updateDownloadLink(response.download);
        } else {
          console.error('Backup source not found');
        }
      } catch (error) {
        console.error('Failed to fetch anime streaming links', error);
      }
    }

    interface SkipTime {
      interval: {
        startTime: number;
        endTime: number;
      };
      skipType: 'op' | 'ed' | string;
    }

    interface FetchSkipTimesResponse {
      results: SkipTime[];
    }
    async function fetchAndProcessSkipTimes() {
      if (malId && episodeId) {
        const episodeNumber = getEpisodeNumber(episodeId);
        try {
          const response: FetchSkipTimesResponse = await fetchSkipTimes({
            malId: malId.toString(),
            episodeNumber,
          });
          // Filter out skip times that are not 'op' or 'ed'
          const filteredSkipTimes = response.results.filter(
            ({ skipType }: SkipTime) => skipType === 'op' || skipType === 'ed',
          );
          const vttContent = generateWebVTTFromSkipTimes({
            results: filteredSkipTimes,
          }); // Adjusted to pass an object with results key
          const blob = new Blob([vttContent], { type: 'text/vtt' });
          const vttBlobUrl = URL.createObjectURL(blob);
          setVttUrl(vttBlobUrl);
          setSkipTimes(filteredSkipTimes);
        } catch (error) {
          console.error('Failed to fetch skip times', error);
        }
      }
    }

    fetchAndSetAnimeSource();
    fetchAndProcessSkipTimes();

    return () => {
      if (vttUrl) {
        URL.revokeObjectURL(vttUrl);
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
    if (player.current && currentTime) {
      player.current.currentTime = currentTime;
    }
  }, [currentTime]);

  function generateWebVTTFromSkipTimes(skipTimes: any) {
    let vttString = 'WEBVTT\n\n';

    const sortedSkipTimes = skipTimes.results.sort((a: any, b: any) => {
      const startTimeA = a.interval.startTime;
      const startTimeB = b.interval.startTime;
      return startTimeA - startTimeB;
    });

    sortedSkipTimes.forEach((result: any) => {
      const { startTime, endTime } = result.interval;
      let skipType = result.skipType;

      if (skipType === 'op') {
        skipType = 'Opening';
      } else if (skipType === 'ed') {
        skipType = 'Outro';
      }

      // Only add entries for 'op' and 'ed' to the VTT string
      if (skipType === 'Opening' || skipType === 'Outro') {
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
    _nativeEvent: MediaProviderChangeEvent,
  ) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  function onTimeUpdate() {
    if (player.current) {
      const currentTime = player.current.currentTime;
      const duration = player.current.duration || 1;

      const playbackPercentage = (currentTime / duration) * 100;
      const playbackInfo = {
        currentTime,
        playbackPercentage,
      };

      const allPlaybackInfo = JSON.parse(
        localStorage.getItem('all_episode_times') || '{}',
      );

      allPlaybackInfo[episodeId] = playbackInfo;
      localStorage.setItem(
        'all_episode_times',
        JSON.stringify(allPlaybackInfo),
      );

      if (autoSkip && skipTimes.length) {
        const skipInterval = skipTimes.find(
          ({ interval }) =>
            currentTime >= interval.startTime && currentTime < interval.endTime,
        );

        if (skipInterval) {
          player.current.currentTime = skipInterval.interval.endTime;
        }
      }
    }
  }

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    localStorage.setItem('autoPlay', (!autoPlay).toString());
  };

  const toggleAutoNext = () => {
    setAutoNext(!autoNext);
    localStorage.setItem('autoNext', (!autoNext).toString());
  };

  const toggleAutoSkip = () => {
    setAutoSkip(!autoSkip);
    localStorage.setItem('autoSkip', (!autoSkip).toString());
  };

  return (
    <>
      <MediaPlayer
        className='player'
        title={`${animeVideoTitle} - Episode ${episodeNumber}`}
        src={src}
        autoplay={autoPlay}
        crossorigin
        playsinline
        onProviderChange={onProviderChange}
        onTimeUpdate={onTimeUpdate}
        ref={player}
        aspectRatio='16/9'
        load='eager'
        posterLoad='eager'
        streamType='on-demand'
        storage='storage-key'
        keyTarget='player'
        keyShortcuts={{
          togglePaused: 'k K Space',
          toggleMuted: 'm M',
          toggleFullscreen: 'f F',
          togglePictureInPicture: 'i I',
          toggleCaptions: 'c C',
          volumeUp: 'ArrowUp',
          volumeDown: 'ArrowDown',
          speedUp: '> <',
          slowDown: '< >',
          // Custom seek behavior
          seekBackward: {
            keys: ['ArrowLeft', 'j', 'J'],
            onKeyDown: ({ event, player }) => {
              event.preventDefault(); // Prevent the default behavior
              // Subtract 5 seconds for ArrowLeft, 10 seconds for 'j' and 'J'
              const seekTime = event.key === 'ArrowLeft' ? -5 : -10;
              player.currentTime = Math.max(0, player.currentTime + seekTime);
            },
          },
          seekForward: {
            keys: ['ArrowRight', 'l', 'L'],
            onKeyDown: ({ event, player }) => {
              event.preventDefault(); // Prevent the default behavior
              // Add 5 seconds for ArrowRight, 10 seconds for 'l' and 'L'
              const seekTime = event.key === 'ArrowRight' ? 5 : 10;
              player.currentTime = Math.min(
                player.duration,
                player.currentTime + seekTime,
              );
            },
          },
        }}
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
          // thumbnails='https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt'
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
        <Button $autoskip onClick={toggleAutoSkip}>
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
