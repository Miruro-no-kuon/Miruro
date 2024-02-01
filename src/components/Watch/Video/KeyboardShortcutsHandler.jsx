import React from "react";
import useKeyboardShortcut from "../../../hooks/useKeyboardShortcut";

const KeyboardShortcutsHandler = ({
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

  const shortcuts = {
    k: togglePlayPause,
    j: seekBackward,
    l: seekForward,
    " ": togglePlayPause,
    f: toggleFullscreen,
    m: toggleMute,
    ArrowUp: increaseVolume,
    ArrowRight: seekForward,
    ArrowDown: decreaseVolume,
    ArrowLeft: seekBackward,
    c: toggleSubtitles,
    t: cycleSubtitleTracks,

    ...Array.from({ length: 10 }, (_, i) => ({
      [`${i}`]: () => jumpToPercentage(i * 10),
    })),

    ">": () => {
      const currentSpeed = videoRef.current.playbackRate;
      const currentIndex = speeds.indexOf(currentSpeed);
      if (currentIndex < speeds.length - 1) {
        const newSpeed = speeds[currentIndex + 1];
        changePlaybackSpeed(newSpeed);
      }
    },
    "<": () => {
      const currentSpeed = videoRef.current.playbackRate;
      const currentIndex = speeds.indexOf(currentSpeed);
      if (currentIndex > 0) {
        const newSpeed = speeds[currentIndex - 1];
        changePlaybackSpeed(newSpeed);
      }
    },
  };

  Object.entries(shortcuts).forEach(([key, callback]) => {
    useKeyboardShortcut(key, callback, videoRef);
  });

  return null;
};

export default KeyboardShortcutsHandler;
