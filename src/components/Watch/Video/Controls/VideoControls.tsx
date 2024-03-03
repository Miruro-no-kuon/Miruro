import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import styled from "styled-components";
import VideoSettings from "./VideoSettings";
import { Timeline } from "./Timeline/Timeline";
import ControlButtonComponent from "./ControlButton";
import VolumeControlComponent from "./VolumeControl";
import TimeDisplayComponent from "./Timeline/TimeDisplay";
import KeyboardShortcutsHandler from "../KeyboardShortcutsHandler";

const ControlsWrapper = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  flex-direction: column;
  align-items: center;
  padding: 0 0.25rem 0.25rem 0.25rem;
  color: white;
  border-radius: 0.8rem; //SAME BORDER RADIUS AS VIDEPLAYER.
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) -100%, transparent 100%);
  transition: 0.3s;
  display: ${({ $isVisible }) => ($isVisible ? "flex" : "none")};
  z-index: 3;
  cursor: default;
  &:hover {
    display: flex;
  }
`;

const MainControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-left: 0.5rem;
`;

const ControlGroup = styled.div<{ $position: "left" | "right" }>`
  display: flex;
  align-items: center;
  margin: 0.25rem 0.5rem 0.5rem 0;
  flex-grow: 1;
  justify-content: ${({ $position }) =>
    $position === "left" ? "flex-start" : "flex-end"};
`;

const ControlPlayButton = styled(ControlButtonComponent)``;

const SettingsButton = styled(ControlButtonComponent)``;

const SubtitlesButton = styled(ControlButtonComponent)``;

const FullscreenButton = styled(ControlButtonComponent)``;

const SkipButton = styled(ControlButtonComponent)``;

const formatTime = (seconds: number) => {
  const format = (value: number) => String(value).padStart(2, "0");
  const hours = format(Math.floor(seconds / 3600));
  const minutes = format(Math.floor((seconds % 3600) / 60));
  const secs = format(Math.floor(seconds % 60));
  return seconds >= 3600 ? `${hours}:${minutes}:${secs}` : `${minutes}:${secs}`;
};
interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoControlsRef: React.RefObject<HTMLDivElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  togglePlayPause: () => void;
  toggleFullscreen: () => void;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  showControls: boolean;
  qualityOptions: string[]; // Assuming qualityOptions is an array of strings
  changeQuality: (quality: string) => void;
  subtitlesEnabled: boolean;
  onToggleSubtitles: () => void;
  subtitleTracks: string[]; // Assuming subtitleTracks is an array of strings
  setSubtitlesEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onSubtitleChange: (track: string | null) => void;
  selectedQuality: string; // Assuming selectedQuality is a string
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
}

const VideoControls: React.FC<VideoControlsProps> = React.memo(
  ({
    videoRef,
    isPlaying,
    togglePlayPause,
    toggleFullscreen,
    currentTime,
    setCurrentTime,
    showControls,
    qualityOptions,
    changeQuality,
    subtitlesEnabled,
    onToggleSubtitles,
    subtitleTracks,
    setSubtitlesEnabled,
    onSubtitleChange,
    selectedQuality,
    volume,
    setVolume,
  }) => {
    const [isSettingsPopupVisible, setIsSettingsPopupVisible] = useState(false);
    const [activeSubtitleTrack, setActiveSubtitleTrack] = useState("English");
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const settingsRef = useRef<HTMLDivElement>(null);

    const changePlaybackSpeed = (speed: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = speed;
        setPlaybackSpeed(speed);
      }
    };

    const toggleSettingsPopup = () =>
      setIsSettingsPopupVisible(!isSettingsPopupVisible);

    const handleQualityChange = useCallback(
      (quality: string) => {
        changeQuality(quality);
        setIsSettingsPopupVisible(false);
      },
      [changeQuality]
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          settingsRef.current &&
          !settingsRef.current.contains(event.target as Node)
        ) {
          setIsSettingsPopupVisible(false);
        }
      };

      if (isSettingsPopupVisible) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isSettingsPopupVisible]);

    useEffect(() => {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      const updateProgress = () => {
        const progressTime = videoElement.currentTime;
        setCurrentTime(progressTime);
        const progressPercentage = (progressTime / videoElement.duration) * 100;
        document.documentElement.style.setProperty(
          "--progress-percentage",
          `${progressPercentage}%`
        );
      };

      videoElement.addEventListener("timeupdate", updateProgress);

      return () => {
        videoElement.removeEventListener("timeupdate", updateProgress);
      };
    }, [videoRef, setCurrentTime]);

    const formattedTime = useMemo(() => formatTime(currentTime), [currentTime]);

    const handleVolumeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
      },
      [setVolume]
    );

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }
    }, [volume, videoRef]);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
      setCurrentTime(newTime);
    };

    const toggleSubtitles = () => {
      setSubtitlesEnabled(!subtitlesEnabled);
      if (!subtitlesEnabled) {
        onSubtitleChange(activeSubtitleTrack);
      } else {
        onSubtitleChange(null);
      }
    };

    useEffect(() => {
      if (subtitlesEnabled && subtitleTracks.length > 0) {
        onSubtitleChange(activeSubtitleTrack);
      }
    }, [
      subtitleTracks,
      subtitlesEnabled,
      activeSubtitleTrack,
      onSubtitleChange,
    ]);

    const maxVideoDuration = useMemo(
      () => videoRef.current?.duration || 100,
      [videoRef]
    );

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
        setVolume(videoRef.current.muted ? 0 : 1);
      }
    };

    const changeVolume = (delta: number) => {
      const newVolume = Math.max(0, Math.min(1, volume + delta));
      setVolume(newVolume);
    };

    const seekTime = (seconds: number) => {
      if (videoRef.current) {
        const newTime = Math.max(
          0,
          Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + seconds
          )
        );
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    };

    const cycleSubtitleTracks = () => {
      if (subtitleTracks.length > 0) {
        const currentIndex = subtitleTracks.findIndex(
          (track) => track === activeSubtitleTrack
        );
        const nextIndex = (currentIndex + 1) % subtitleTracks.length;
        setActiveSubtitleTrack(subtitleTracks[nextIndex]);
        onSubtitleChange(subtitleTracks[nextIndex]);
      }
    };

    const jumpToPercentage = (percentage: number) => {
      if (videoRef.current) {
        const duration = videoRef.current.duration;
        const newTime = (percentage / 100) * duration;
        videoRef.current.currentTime = newTime;
      }
    };

    return (
      <ControlsWrapper $isVisible={showControls}>
        <Timeline
          min={0}
          max={maxVideoDuration}
          value={currentTime}
          onChange={handleTimeChange}
        />
        <MainControls>
          <ControlGroup $position="left">
            <ControlPlayButton
              onClick={togglePlayPause}
              icon={isPlaying ? "pause" : "play_arrow"}
              tooltip={isPlaying ? "Pause" : "Play"}
            />
            <VolumeControlComponent
              volume={volume}
              setVolume={setVolume}
              onMuteToggle={toggleMute}
              onVolumeChange={handleVolumeChange}
              isSettingsPopupVisible={isSettingsPopupVisible} // Add this line
            />
            <TimeDisplayComponent
              currentTime={formattedTime}
              duration={formatTime(videoRef.current?.duration || 0)}
            />
          </ControlGroup>
          <ControlGroup $position="right">
            <SkipButton
              onClick={() => seekTime(-10)}
              icon="replay_10"
              tooltip="-10s"
            />
            <SkipButton
              onClick={() => seekTime(10)}
              icon="forward_10"
              tooltip="+10s"
            />
            {/* <SubtitlesButton
              onClick={toggleSubtitles}
              icon={subtitlesEnabled ? "closed_caption" : "closed_caption_off"}
              tooltip={subtitlesEnabled ? "Captions On" : "Captions Off"}
            /> */}
            <div ref={settingsRef}>
              <SettingsButton
                icon="settings"
                tooltip="Settings"
                onClick={toggleSettingsPopup}
              />
              <VideoSettings
                isSettingsPopupVisible={isSettingsPopupVisible}
                toggleSettingsPopup={toggleSettingsPopup}
                qualityOptions={qualityOptions}
                handleQualityChange={handleQualityChange}
                selectedQuality={selectedQuality}
                playbackSpeed={playbackSpeed}
                changePlaybackSpeed={changePlaybackSpeed}
              />
            </div>
            <FullscreenButton
              onClick={toggleFullscreen}
              icon="fullscreen"
              tooltip="Fullscreen"
            />
          </ControlGroup>
        </MainControls>
        <KeyboardShortcutsHandler
          videoRef={videoRef}
          togglePlayPause={togglePlayPause}
          toggleFullscreen={toggleFullscreen}
          toggleMute={toggleMute}
          increaseVolume={() => changeVolume(0.1)}
          decreaseVolume={() => changeVolume(-0.1)}
          seekBackward={() => seekTime(-5)}
          seekForward={() => seekTime(5)}
          cycleSubtitleTracks={cycleSubtitleTracks}
          toggleSubtitles={onToggleSubtitles}
          jumpToPercentage={jumpToPercentage}
          changePlaybackSpeed={changePlaybackSpeed}
        />
      </ControlsWrapper>
    );
  }
);

export default VideoControls;
