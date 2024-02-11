import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import useFetchAndSetupSources from "./hooks/useFetchAndSetupSources";
import useSubtitleLogic from "./hooks/useSubtitleLogic";
import VideoControls from "./Controls/VideoControls";
import pikachuLoader from "/src/assets/load-gif-Pikachu_Runnin.gif";
import useHLS from "./hooks/useHLS";
import useLocalStorage from "./hooks/useLocalStorage";
import { ring2 } from "ldrs";

ring2.register();

const VideoPlayerContainer = styled.div`
  background: var(--global-secondary-bg);
  padding-bottom: 2rem;
  border-radius: 0.2rem;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

const VideoBorderWrapper = styled.div`
  position: relative;
  border: 0.5rem solid var(--global-secondary-bg);
  border-radius: 0.2rem;
  border-top: none;
  border-bottom: none;
`;

const VideoPlayerWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
  height: 0;
  cursor: ${({ $isCursorIdle, $isLoading, $isVideoChanging }) =>
    $isLoading || $isVideoChanging
      ? "default"
      : $isCursorIdle
      ? "none"
      : "pointer"};
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &:fullscreen {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`;

const fadeIn = keyframes`
  from {
    visibility: hidden;
    opacity: 0;
  }
  to {
    visibility: visible;
    opacity: 1;
  }
`;

const LargePlayIcon = styled.div`
  position: absolute;
  border: 0.35rem solid #eeeeee;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  z-index: 2;
  background-size: cover; // Optional: if you want the image to cover the whole area
  background-position: center; // Optional: for centering the image
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  color: #eeeeee;
  top: 50%;
  left: 50%;
  padding: 0.12rem;
  transform: translate(-50%, -50%) scaleX(1.1);
  z-index: 2;
  opacity: ${({ isPlaying }) => (isPlaying ? "0" : "1")};
  visibility: ${({ isPlaying }) => (isPlaying ? "hidden" : "visible")};
  ${({ isPlaying }) =>
    !isPlaying &&
    css`
      animation: ${fadeIn} 1s;
    `}
  cursor: pointer;
  transition: border 0.15s ease-in-out, color 0.15s ease-in-out,
    transform 0.15s ease-in-out;

  &:hover {
    border: 0.3rem solid #ffffff;
    color: #ffffff;
    transform: translate(-50%, -50%) scaleX(1.1) scale(1.1);
  }
`;

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;

  .pikachuLoader {
    width: 7rem;
    height: 5rem;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

const PlayPauseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${({ $bannerImage }) => $bannerImage});
  background-size: cover; // Adjust this as needed
  background-position: center;
  z-index: 1; // Make sure this is below the play button but above the video
`;

const isMobileDevice = () => {
  const userAgent =
    typeof window.navigator === "undefined" ? "" : navigator.userAgent;
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent) || window.innerWidth <= 768;
};

const VideoPlayer = ({
  id,
  watchId,
  shouldPreload = false,
  provider,
  episodeNumber,
  bannerImage,
}) => {
  const [videoSources, setVideoSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [videoQualityOptions, setVideoQualityOptions] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [audioTracks, setAudioTracks] = useState([]);
  const [intro, setIntro] = useState(null);
  const [outro, setOutro] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVideoChanging, setIsVideoChanging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isCursorIdle, setIsCursorIdle] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  const videoRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const videoPlayerWrapperRef = useRef(null);
  const videoControlsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFetchAndSetupSources(
    watchId,
    shouldPreload,
    id,
    provider,
    episodeNumber,
    isLoading,
    setIsLoading,
    videoSources,
    setVideoSources,
    videoQualityOptions,
    setVideoQualityOptions,
    selectedSource,
    setSelectedSource,
    subtitleTracks,
    setSubtitleTracks,
    error,
    setError,
    currentTime,
    setCurrentTime,
    videoRef
  );

  const { handleSubtitleChange } = useSubtitleLogic(
    videoRef,
    subtitleTracks,
    subtitlesEnabled,
    setSubtitlesEnabled
  );

  useHLS(videoRef, selectedSource);

  useEffect(() => {
    setIsVideoChanging(true);
    const handleCanPlay = () => {
      setIsVideoChanging(false);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("canplay", handleCanPlay);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, [selectedSource]);

  useEffect(() => {
    setSelectedSource(
      videoSources.find((s) => s.quality === selectedQuality)?.url ||
        videoSources[0]?.url
    );
    setIsPlaying(false);
    setHasPlayed(false);
  }, [videoSources, selectedQuality]);

  const handleQualityChange = () => {
    setSelectedSource(
      videoSources.find((s) => s.quality === selectedQuality)?.url ||
        videoSources[0]?.url
    );
  };

  useEffect(() => {
    handleQualityChange();
    setIsPlaying(false);
    setHasPlayed(false);

    const savedTime = localStorage.getItem(`savedTime-${watchId}`);
    if (savedTime) {
      setCurrentTime(parseFloat(savedTime));
      if (videoRef.current) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
    }
  }, [videoSources, selectedQuality, watchId]);

  useLocalStorage(videoRef, watchId);

  useEffect(() => {
    setShowControls(true);
    resetIdleState();

    if (!isPlaying) {
      setShowControls(true);
      resetIdleState();
    }
  }, [isPlaying, volume]);

  useEffect(() => {
    let timeoutId;

    const handleIdleStateReset = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
          setIsCursorIdle(true);
        }
      }, 1000);
    };

    handleIdleStateReset();

    const playerWrapper = playerWrapperRef.current;
    playerWrapper.addEventListener("mousemove", handleIdleStateReset);
    playerWrapper.addEventListener("mouseenter", () => setShowControls(true));

    return () => {
      playerWrapper.removeEventListener("mousemove", handleIdleStateReset);
      playerWrapper.removeEventListener("mouseenter", () =>
        setShowControls(true)
      );
      clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  useEffect(() => {
    let cursorIdleTimeout;

    const handleIdleStateReset = () => {
      setIsCursorIdle(false);
      clearTimeout(cursorIdleTimeout);

      if (isPlaying) {
        cursorIdleTimeout = setTimeout(() => setIsCursorIdle(true), 1000);
      }
    };

    handleIdleStateReset();

    const playerWrapper = playerWrapperRef.current;
    playerWrapper.addEventListener("mousemove", handleIdleStateReset);

    return () => {
      clearTimeout(cursorIdleTimeout);
      playerWrapper.removeEventListener("mousemove", handleIdleStateReset);
    };
  }, [isPlaying]);

  useEffect(() => {
    const videoPlayerWrapper = videoPlayerWrapperRef.current;
    if (videoPlayerWrapper) {
      videoPlayerWrapper.addEventListener("dblclick", handleDoubleClick);

      return () => {
        videoPlayerWrapper.removeEventListener("dblclick", handleDoubleClick);
      };
    }
  }, []);

  const changeQuality = (newQuality) => {
    const currentTime = videoRef.current.currentTime;
    setSelectedQuality(newQuality);

    const handleCanPlay = () => {
      videoRef.current.currentTime = currentTime;
      videoRef.current.removeEventListener("canplay", handleCanPlay);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("canplay", handleCanPlay);
    }
  };

  const resetIdleState = () => {
    setIsCursorIdle(false);
    setShowControls(true);

    clearTimeout(timeoutIdRef.current);

    if (isPlaying) {
      timeoutIdRef.current = setTimeout(() => {
        setShowControls(false);
        setIsCursorIdle(true);
      }, 1000);
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement;
    const requestFullscreen =
      videoContainer.requestFullscreen ||
      videoContainer.mozRequestFullScreen ||
      videoContainer.webkitRequestFullscreen ||
      videoContainer.msRequestFullscreen;
    const exitFullscreen =
      document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;

    if (!document.fullscreenElement && requestFullscreen) {
      requestFullscreen.call(videoContainer);
    } else if (document.fullscreenElement && exitFullscreen) {
      exitFullscreen.call(document);
    }

    resetIdleState();
  };

  const handleDoubleClick = (event) => {
    if (
      videoControlsRef.current &&
      videoControlsRef.current.contains(event.target)
    ) {
      return;
    }
    toggleFullscreen();
  };

  const togglePlayPause = () => {
    if (videoRef.current && !isLoading) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsCursorIdle(false);
        setShowControls(true);
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setHasPlayed(true);
    }
  };

  const handlePlay = () => {
    if (videoRef.current && !isPlaying && !hasPlayed) {
      togglePlayPause();
    }
  };

  return (
    <VideoPlayerContainer id="video-player-wrapper" ref={playerWrapperRef}>
      <VideoBorderWrapper>
        <VideoPlayerWrapper
          $isCursorIdle={isCursorIdle}
          $isLoading={isLoading}
          $isVideoChanging={isVideoChanging}
          ref={videoPlayerWrapperRef}
        >
          {isLoading && !isVideoChanging ? (
            <Loader>
              <l-ring-2
                size="60"
                speed="0.8"
                stroke="2"
                color="white"
              ></l-ring-2>
            </Loader>
          ) : (
            <>
              {isVideoChanging && (
                <Loader>
                  <img className="pikachuLoader" src={pikachuLoader} />
                </Loader>
              )}
              {!isMobile && hasPlayed && (
                <PlayPauseOverlay
                  onClick={() => {
                    togglePlayPause();
                    handlePlay();
                  }}
                />
              )}
              {!isPlaying && !hasPlayed && !isVideoChanging && (
                <LargePlayIcon $isPlaying={isPlaying} onClick={handlePlay}>
                  <i className="material-icons" style={{ fontSize: "4rem" }}>
                    play_arrow
                  </i>
                </LargePlayIcon>
              )}
              {!isPlaying && !hasPlayed && !isVideoChanging && (
                <BannerOverlay $bannerImage={bannerImage} />
              )}

              <StyledVideo ref={videoRef} controls={isMobile} />

              {!isMobile &&
                videoRef.current &&
                hasPlayed &&
                !isLoading &&
                !isVideoChanging && (
                  <VideoControls
                    ref={videoControlsRef}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    videoRef={videoRef}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    togglePlayPause={togglePlayPause}
                    toggleFullscreen={toggleFullscreen}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    hasPlayed={hasPlayed}
                    setHasPlayed={setHasPlayed}
                    showControls={showControls}
                    setShowControls={setShowControls}
                    qualityOptions={videoQualityOptions}
                    changeQuality={changeQuality}
                    selectedQuality={selectedQuality}
                    subtitlesEnabled={subtitlesEnabled}
                    onToggleSubtitles={() =>
                      setSubtitlesEnabled(!subtitlesEnabled)
                    }
                    subtitles={subtitles}
                    subtitleTracks={subtitleTracks}
                    setSubtitlesEnabled={setSubtitlesEnabled}
                    onSubtitleChange={handleSubtitleChange}
                    audioTracks={audioTracks}
                    intro={intro}
                    outro={outro}
                    volume={volume}
                    setVolume={setVolume}
                  />
                )}
            </>
          )}
        </VideoPlayerWrapper>
      </VideoBorderWrapper>
    </VideoPlayerContainer>
  );
};

export default VideoPlayer;
