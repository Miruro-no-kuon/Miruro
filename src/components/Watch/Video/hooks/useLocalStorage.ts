import { useEffect, RefObject } from 'react';

const useLocalStorage = (
  videoRef: RefObject<HTMLVideoElement>,
  episodeId: string,
) => {
  useEffect(() => {
    const handlePause = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        localStorage.setItem(`savedTime-${episodeId}`, currentTime.toString());
      }
    };

    const addPauseListener = () => {
      if (videoRef.current) {
        videoRef.current.addEventListener('pause', handlePause);
      }
    };

    const removePauseListener = () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('pause', handlePause);
        if (!videoRef.current.paused) {
          const currentTime = videoRef.current.currentTime;
          localStorage.setItem(
            `savedTime-${episodeId}`,
            currentTime.toString(),
          );
        }
      }
    };

    addPauseListener();

    return removePauseListener;
  }, [episodeId, videoRef]);
};

export default useLocalStorage;
