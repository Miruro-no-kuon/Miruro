import { useEffect, useRef, useState } from 'react';
import './PlayerStyles.css';
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
import {
  fetchSkipTimes,
  fetchAnimeStreamingLinks,
  useSettings,
} from '../../../index';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { TbPlayerTrackPrev, TbPlayerTrackNext } from 'react-icons/tb';
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
  onEpisodeEnd: () => Promise<void>;
  onPrevEpisode: () => void;
  onNextEpisode: () => void;
  animeTitle?: string;
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

type FetchSkipTimesResponse = {
  results: SkipTime[];
};

export function Player({
  episodeId,
  banner,
  malId,
  updateDownloadLink,
  onEpisodeEnd,
  onPrevEpisode,
  onNextEpisode,
  animeTitle,
}: PlayerProps) {
  const player = useRef<MediaPlayerInstance>(null);
  const [src, setSrc] = useState<string>('');
  const [vttUrl, setVttUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [skipTimes, setSkipTimes] = useState<SkipTime[]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [vttGenerated, setVttGenerated] = useState<boolean>(false);
  const episodeNumber = getEpisodeNumber(episodeId);
  const animeVideoTitle = animeTitle;

  const { settings, setSettings } = useSettings();
  const { autoPlay, autoNext, autoSkip } = settings;

  useEffect(() => {
    setCurrentTime(parseFloat(localStorage.getItem('currentTime') || '0'));

    fetchAndSetAnimeSource();
    fetchAndProcessSkipTimes();
    return () => {
      if (vttUrl) URL.revokeObjectURL(vttUrl);
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

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    _nativeEvent: MediaProviderChangeEvent,
  ) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  function onLoadedMetadata() {
    if (player.current) {
      setTotalDuration(player.current.duration);
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

  function generateWebVTTFromSkipTimes(
    skipTimes: FetchSkipTimesResponse,
    totalDuration: number,
  ): string {
    let vttString = 'WEBVTT\n\n';
    let previousEndTime = 0;

    const sortedSkipTimes = skipTimes.results.sort(
      (a, b) => a.interval.startTime - b.interval.startTime,
    );

    sortedSkipTimes.forEach((skipTime, index) => {
      const { startTime, endTime } = skipTime.interval;
      const skipType =
        skipTime.skipType.toUpperCase() === 'OP' ? 'Opening' : 'Outro';

      // Insert default title chapter before this skip time if there's a gap
      if (previousEndTime < startTime) {
        vttString += `${formatTime(previousEndTime)} --> ${formatTime(startTime)}\n`;
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`;
      }

      // Insert this skip time
      vttString += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
      vttString += `${skipType}\n\n`;
      previousEndTime = endTime;

      // Insert default title chapter after the last skip time
      if (index === sortedSkipTimes.length - 1 && endTime < totalDuration) {
        vttString += `${formatTime(endTime)} --> ${formatTime(totalDuration)}\n`;
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`;
      }
    });

    return vttString;
  }

  async function fetchAndProcessSkipTimes() {
    if (malId && episodeId) {
      const episodeNumber = getEpisodeNumber(episodeId);
      try {
        const response: FetchSkipTimesResponse = await fetchSkipTimes({
          malId: malId.toString(),
          episodeNumber,
        });
        const filteredSkipTimes = response.results.filter(
          ({ skipType }) => skipType === 'op' || skipType === 'ed',
        );
        if (!vttGenerated) {
          const vttContent = generateWebVTTFromSkipTimes(
            { results: filteredSkipTimes },
            totalDuration,
          );
          const blob = new Blob([vttContent], { type: 'text/vtt' });
          const vttBlobUrl = URL.createObjectURL(blob);
          setVttUrl(vttBlobUrl);
          setSkipTimes(filteredSkipTimes);
          setVttGenerated(true);
        }
      } catch (error) {
        console.error('Failed to fetch skip times', error);
      }
    }
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

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function getEpisodeNumber(id: string): string {
    const parts = id.split('-');
    return parts[parts.length - 1];
  }

  const toggleAutoPlay = () =>
    setSettings({ ...settings, autoPlay: !autoPlay });
  const toggleAutoNext = () =>
    setSettings({ ...settings, autoNext: !autoNext });
  const toggleAutoSkip = () =>
    setSettings({ ...settings, autoSkip: !autoSkip });

  const handlePlaybackEnded = async () => {
    if (!autoNext) return;

    try {
      player.current?.pause();

      await new Promise((resolve) => setTimeout(resolve, 200)); // Delay for transition
      await onEpisodeEnd();
    } catch (error) {
      console.error('Error moving to the next episode:', error);
    }
  };

  return (
    <div style={{ animation: 'popIn 0.25s ease-in-out' }}>
      <MediaPlayer
        className='player'
        title={`${animeVideoTitle} - Episode ${episodeNumber}`}
        src={src}
        autoplay={autoPlay}
        crossorigin
        playsinline
        onLoadedMetadata={onLoadedMetadata}
        onProviderChange={onProviderChange}
        onTimeUpdate={onTimeUpdate}
        ref={player}
        aspectRatio='16/9'
        load='eager'
        posterLoad='eager'
        streamType='on-demand'
        storage='storage-key'
        keyTarget='player'
        onEnded={handlePlaybackEnded}
      >
        <MediaProvider>
          <Poster className='vds-poster' src={banner} alt='' />
          {vttUrl && (
            <Track kind='chapters' src={vttUrl} default label='Skip Times' />
          )}
        </MediaProvider>
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
      <div
        className='player-menu'
        style={{
          backgroundColor: 'var(--global-div-tr)',
          borderRadius: 'var(--global-border-radius)',
        }}
      >
        <Button onClick={toggleAutoPlay}>
          {autoPlay ? <FaCheck /> : <RiCheckboxBlankFill />} Autoplay
        </Button>
        <Button $autoskip onClick={toggleAutoSkip}>
          {autoSkip ? <FaCheck /> : <RiCheckboxBlankFill />} Auto Skip
        </Button>
        <Button onClick={onPrevEpisode}>
          <TbPlayerTrackPrev /> Prev
        </Button>
        <Button onClick={onNextEpisode}>
          <TbPlayerTrackNext /> Next
        </Button>
        <Button onClick={toggleAutoNext}>
          {autoNext ? <FaCheck /> : <RiCheckboxBlankFill />} Auto Next
        </Button>
      </div>
    </div>
  );
}
