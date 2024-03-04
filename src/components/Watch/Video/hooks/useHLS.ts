import { useEffect, RefObject } from "react";
import Hls from "hls.js";

const useHLS = (videoRef: RefObject<HTMLVideoElement>, source: string) => {
  useEffect(() => {
    if (Hls.isSupported() && videoRef.current && source) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(videoRef.current);

      return () => hls.destroy();
    }
  }, [source, videoRef]);
};

export default useHLS;
