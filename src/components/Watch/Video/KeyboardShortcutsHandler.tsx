import React from "react";
import useKeyboardShortcut from "../../../hooks/useKeyboardShortcut";

interface KeyboardShortcutsHandlerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  togglePlayPause: () => void;
  toggleFullscreen: () => void;
  toggleMute: () => void;
  increaseVolume: () => void;
  decreaseVolume: () => void;
  seekBackward: () => void;
  seekForward: () => void;
  toggleSubtitles: () => void;
  cycleSubtitleTracks: () => void;
  jumpToPercentage: (percentage: number) => void;
  changePlaybackSpeed: (speed: number) => void;
}

const KeyboardShortcutsHandler: React.FC<KeyboardShortcutsHandlerProps> = ({
  videoRef,
  togglePlayPause,
  toggleFullscreen,
  toggleMute,
  increaseVolume,
  decreaseVolume,
  seekBackward,
  seekForward,
  toggleSubtitles,
  cycleSubtitleTracks,
  jumpToPercentage,
  changePlaybackSpeed,
}) => {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleArrowKey = (event: KeyboardEvent) => {
    // Prevent default arrow key behavior if video is focused
    if (
      event.key.startsWith("Arrow") &&
      document.activeElement === videoRef.current
    ) {
      event.preventDefault();
    }
  };

  const shortcuts: Record<string, () => void> = {
    k: togglePlayPause,
    j: () => {
      const video = videoRef.current;
      if (video) {
        video.currentTime -= 10;
      }
    },
    l: () => {
      const video = videoRef.current;
      if (video) {
        video.currentTime += 10;
      }
    },
    " ": togglePlayPause,
    f: toggleFullscreen,
    m: toggleMute,
    ArrowUp: increaseVolume,
    ArrowRight: seekForward,
    ArrowDown: decreaseVolume,
    ArrowLeft: seekBackward,
    c: toggleSubtitles,
    t: cycleSubtitleTracks,
    ">": () => {
      const currentSpeed = videoRef.current?.playbackRate;
      const currentIndex = currentSpeed ? speeds.indexOf(currentSpeed) : -1;
      if (currentIndex < speeds.length - 1) {
        const newSpeed = speeds[currentIndex + 1];
        changePlaybackSpeed(newSpeed);
      }
    },
    "<": () => {
      const currentSpeed = videoRef.current?.playbackRate;
      const currentIndex = currentSpeed ? speeds.indexOf(currentSpeed) : -1;
      if (currentIndex > 0) {
        const newSpeed = speeds[currentIndex - 1];
        changePlaybackSpeed(newSpeed);
      }
    },
  };

  // Dynamically assign number keys for percentage-based seeking
  for (let i = 0; i <= 9; i++) {
    shortcuts[i.toString()] = () => jumpToPercentage(i * 10);
  }

  Object.entries(shortcuts).forEach(([key, callback]) => {
    useKeyboardShortcut(key, callback, videoRef);
    // Also listen for capitalized letter shortcuts when Caps Lock is on
    if (key.length === 1 && key.toUpperCase() !== key) {
      useKeyboardShortcut(key.toUpperCase(), callback);
    }
  });

  // Listen for arrow key events to prevent default scrolling if the video is focused
  document.addEventListener("keydown", handleArrowKey);

  // Cleanup function to remove event listener when component unmounts
  React.useEffect(() => {
    return () => {
      document.removeEventListener("keydown", handleArrowKey);
    };
  }, []);

  return null;
};

export default KeyboardShortcutsHandler;
