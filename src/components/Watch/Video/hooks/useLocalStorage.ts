import { useEffect } from "react";

const useLocalStorage = (videoRef, watchId) => {
  useEffect(() => {
    const handlePause = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        localStorage.setItem(`savedTime-${watchId}`, currentTime);
      }
    };

    const addPauseListener = () => {
      if (videoRef.current) {
        videoRef.current.addEventListener("pause", handlePause);
      }
    };

    const removePauseListener = () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("pause", handlePause);
        if (!videoRef.current.paused) {
          const currentTime = videoRef.current.currentTime;
          localStorage.setItem(`savedTime-${watchId}`, currentTime);
        }
      }
    };

    addPauseListener();

    return removePauseListener;
  }, [watchId, videoRef]);
};

export default useLocalStorage;
