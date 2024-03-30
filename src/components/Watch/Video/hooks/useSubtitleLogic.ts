import { useEffect } from 'react';

const useSubtitleLogic = (
  videoRef,
  subtitleTracks,
  subtitlesEnabled,
  setSubtitlesEnabled,
) => {
  useEffect(() => {
    let isMounted = true;

    const cleanupTextTracks = () => {
      if (videoRef.current) {
        const existingTracks = videoRef.current.querySelectorAll('track');
        existingTracks.forEach((track) => videoRef.current.removeChild(track));
      }
    };

    const addDefaultSubtitleTrack = () => {
      if (videoRef.current && subtitleTracks.length > 0) {
        const defaultLanguageTrack = subtitleTracks.find(
          (track) => track.label === 'English',
        );

        if (defaultLanguageTrack) {
          const trackElement = document.createElement('track');
          trackElement.kind = 'subtitles';
          trackElement.label = defaultLanguageTrack.label;
          trackElement.src = defaultLanguageTrack.src;
          trackElement.default = true;
          videoRef.current.appendChild(trackElement);
        }
      }
    };

    if (isMounted) {
      cleanupTextTracks();
      addDefaultSubtitleTrack();
    }

    return () => {
      isMounted = false;
      cleanupTextTracks();
    };
  }, [videoRef, subtitleTracks]);

  useEffect(() => {
    if (videoRef.current && subtitleTracks.length > 0) {
      const textTracks = videoRef.current.textTracks;
      for (const track of textTracks) {
        track.mode = subtitlesEnabled ? 'showing' : 'hidden';
      }
    }
  }, [videoRef, subtitlesEnabled, subtitleTracks]);

  const handleSubtitleChange = (selectedSubtitleLabel) => {
    if (!subtitlesEnabled) return;

    if (videoRef.current) {
      const textTracks = videoRef.current.textTracks;
      for (const track of textTracks) {
        track.mode =
          track.label === selectedSubtitleLabel ? 'showing' : 'hidden';
      }
    }
  };

  const toggleSubtitles = () => {
    setSubtitlesEnabled(!subtitlesEnabled);
  };

  return {
    handleSubtitleChange,
    toggleSubtitles,
  };
};

export default useSubtitleLogic;
