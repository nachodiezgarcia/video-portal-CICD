import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createVanillaVideoPlayer } from '../vanilla';
import {
  PLAYBACK_RATES,
  DEFAULT_PLAYBACK_RATE,
} from '../../video-player.constants';
import '../../video-player.css';
import {
  mapCssPropsToVars,
  type VideoPlayerCssProps,
} from './video-player.mapper';

export interface VideoPlayerHandle {
  play: () => Promise<void>;
  pause: () => void;
  seek: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

export interface VideoPlayerProps extends VideoPlayerCssProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  startTime?: number;
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onError?: (error: MediaError | null) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  (
    {
      src,
      poster,
      autoPlay,
      muted,
      startTime,
      primaryColor,
      backgroundColor,
      textColor,
      borderRadius,
      className,
      style,
      fallback = null,
      onReady,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onError,
    },
    ref,
  ) => {
    const [mounted, setMounted] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const controlsRef = useRef<HTMLDivElement>(null);
    const playPauseButtonRef = useRef<HTMLButtonElement>(null);
    const playIconRef = useRef<SVGSVGElement>(null);
    const pauseIconRef = useRef<SVGSVGElement>(null);
    const currentTimeRef = useRef<HTMLSpanElement>(null);
    const durationRef = useRef<HTMLSpanElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressFilledRef = useRef<HTMLDivElement>(null);
    const progressThumbRef = useRef<HTMLDivElement>(null);
    const progressBufferRef = useRef<HTMLDivElement>(null);
    const muteButtonRef = useRef<HTMLButtonElement>(null);
    const volumeIconRef = useRef<SVGSVGElement>(null);
    const muteIconRef = useRef<SVGSVGElement>(null);
    const volumeSliderRef = useRef<HTMLInputElement>(null);
    const volumeTrackRef = useRef<HTMLDivElement>(null);
    const volumeFilledRef = useRef<HTMLDivElement>(null);
    const volumeThumbRef = useRef<HTMLDivElement>(null);
    const speedButtonRef = useRef<HTMLButtonElement>(null);
    const speedTextRef = useRef<HTMLSpanElement>(null);
    const speedDropdownRef = useRef<HTMLDivElement>(null);
    const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
    const fullscreenIconRef = useRef<SVGSVGElement>(null);
    const exitFullscreenIconRef = useRef<SVGSVGElement>(null);

    const gestureOverlayRef = useRef<HTMLDivElement>(null);
    const gestureFeedbackRef = useRef<HTMLDivElement>(null);
    const gestureIconRef = useRef<HTMLDivElement>(null);
    const gestureTextRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        play: async () => {
          await videoRef.current?.play();
        },
        pause: () => {
          videoRef.current?.pause();
        },
        seek: (seconds: number) => {
          if (videoRef.current) {
            videoRef.current.currentTime = seconds;
          }
        },
        getCurrentTime: () => videoRef.current?.currentTime ?? 0,
        getDuration: () => videoRef.current?.duration ?? 0,
      }),
      [],
    );

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!mounted) return;

      const video = videoRef.current;
      const container = containerRef.current;
      if (!video || !container) return;

      const controls = controlsRef.current;
      const playPauseButton = playPauseButtonRef.current;
      const playIcon = playIconRef.current;
      const pauseIcon = pauseIconRef.current;
      const currentTime = currentTimeRef.current;
      const duration = durationRef.current;
      const progressBar = progressBarRef.current;
      const progressFilled = progressFilledRef.current;
      const progressThumb = progressThumbRef.current;
      const progressBuffer = progressBufferRef.current;
      const muteButton = muteButtonRef.current;
      const volumeIcon = volumeIconRef.current;
      const muteIcon = muteIconRef.current;
      const volumeSlider = volumeSliderRef.current;
      const volumeTrack = volumeTrackRef.current;
      const volumeFilled = volumeFilledRef.current;
      const volumeThumb = volumeThumbRef.current;
      const speedButton = speedButtonRef.current;
      const speedText = speedTextRef.current;
      const speedDropdown = speedDropdownRef.current;
      const fullscreenButton = fullscreenButtonRef.current;
      const fullscreenIcon = fullscreenIconRef.current;
      const exitFullscreenIcon = exitFullscreenIconRef.current;

      if (
        !controls ||
        !playPauseButton ||
        !playIcon ||
        !pauseIcon ||
        !currentTime ||
        !duration ||
        !progressBar ||
        !progressFilled ||
        !progressThumb ||
        !progressBuffer ||
        !muteButton ||
        !volumeIcon ||
        !muteIcon ||
        !volumeSlider ||
        !volumeTrack ||
        !volumeFilled ||
        !volumeThumb ||
        !speedButton ||
        !speedText ||
        !speedDropdown ||
        !fullscreenButton ||
        !fullscreenIcon ||
        !exitFullscreenIcon ||
        !gestureOverlayRef.current ||
        !gestureFeedbackRef.current ||
        !gestureIconRef.current ||
        !gestureTextRef.current
      ) {
        return;
      }

      const speedOptions = speedDropdown.querySelectorAll(
        '.video-player__speed-option',
      );
      const tapZones = container.querySelectorAll('.video-player__tap-zone');

      const player = createVanillaVideoPlayer(video, container);

      player.setupUI({
        controls,
        playPauseButton,
        playIcon: playIcon as unknown as HTMLElement,
        pauseIcon: pauseIcon as unknown as HTMLElement,
        currentTime,
        duration,
        progressBar,
        progressFilled,
        progressThumb,
        progressBuffer,
        muteButton,
        volumeIcon: volumeIcon as unknown as HTMLElement,
        muteIcon: muteIcon as unknown as HTMLElement,
        volumeSlider,
        volumeTrack,
        volumeFilled,
        volumeThumb,
        speedButton,
        speedText,
        speedDropdown,
        speedOptions,
        fullscreenButton,
        fullscreenIcon: fullscreenIcon as unknown as HTMLElement,
        exitFullscreenIcon: exitFullscreenIcon as unknown as HTMLElement,
        gestureOverlay: gestureOverlayRef.current,
        gestureFeedback: gestureFeedbackRef.current,
        gestureIcon: gestureIconRef.current,
        gestureText: gestureTextRef.current,
        tapZones,
      });

      if (startTime !== undefined && startTime > 0) {
        const applyStartTime = () => {
          video.currentTime = startTime;
        };
        if (video.readyState >= 1) {
          applyStartTime();
        } else {
          video.addEventListener('loadedmetadata', applyStartTime, {
            once: true,
          });
        }
      }

      const handleLoadedMetadata = () => onReady?.();
      const handlePlay = () => onPlay?.();
      const handlePause = () => onPause?.();
      const handleEnded = () => onEnded?.();
      const handleTimeUpdate = () => {
        onTimeUpdate?.(video.currentTime, video.duration);
      };
      const handleError = () => onError?.(video.error);

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('error', handleError);
        player.destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    if (!mounted) {
      return <>{fallback}</>;
    }

    const cssVars = mapCssPropsToVars({
      primaryColor,
      backgroundColor,
      textColor,
      borderRadius,
    });

    const mergedStyle: CSSProperties = { ...cssVars, ...style };

    const containerClassName = className
      ? `video-player-container ${className}`
      : 'video-player-container';

    return (
      <div ref={containerRef} className={containerClassName} style={mergedStyle}>
        <video
          ref={videoRef}
          className="video-player"
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          controls={false}
          preload="metadata"
          playsInline
        />

        <div ref={gestureOverlayRef} className="video-player__gesture-overlay">
          <div
            ref={gestureFeedbackRef}
            className="video-player__gesture-feedback"
          >
            <div ref={gestureIconRef} className="video-player__gesture-icon" />
            <div ref={gestureTextRef} className="video-player__gesture-text" />
          </div>
        </div>

        <div className="video-player__tap-zones">
          <div
            className="video-player__tap-zone video-player__tap-zone--left"
            data-action="rewind"
          />
          <div
            className="video-player__tap-zone video-player__tap-zone--center"
            data-action="play-pause"
          />
          <div
            className="video-player__tap-zone video-player__tap-zone--right"
            data-action="forward"
          />
        </div>

        <div ref={controlsRef} className="video-player__controls">
          <button
            ref={playPauseButtonRef}
            type="button"
            className="video-player__play-pause"
            aria-label="Play/Pause"
          >
            <svg
              ref={playIconRef}
              className="video-player__icon-play"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg
              ref={pauseIconRef}
              className="video-player__icon-pause"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>

          <div className="video-player__time">
            <span ref={currentTimeRef} className="video-player__current-time">
              00:00
            </span>
            {' / '}
            <span ref={durationRef} className="video-player__duration">
              00:00
            </span>
          </div>

          <div className="video-player__progress-container">
            <div ref={progressBarRef} className="video-player__progress-bar">
              <div
                ref={progressFilledRef}
                className="video-player__progress-filled"
              />
              <div
                ref={progressThumbRef}
                className="video-player__progress-thumb"
              />
              <div
                ref={progressBufferRef}
                className="video-player__progress-buffer"
              />
            </div>
          </div>

          <button
            ref={muteButtonRef}
            type="button"
            className="video-player__mute"
            aria-label="Mute/Unmute"
          >
            <svg
              ref={volumeIconRef}
              className="video-player__icon-volume"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <svg
              ref={muteIconRef}
              className="video-player__icon-mute"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          </button>

          <div className="video-player__volume-container">
            <div className="video-player__volume-slider-container">
              <div ref={volumeTrackRef} className="video-player__volume-track">
                <div
                  ref={volumeFilledRef}
                  className="video-player__volume-filled"
                />
                <div
                  ref={volumeThumbRef}
                  className="video-player__volume-thumb"
                />
              </div>
              <input
                ref={volumeSliderRef}
                type="range"
                className="video-player__volume-slider"
                min="0"
                max="1"
                step="0.01"
                defaultValue="1"
                aria-label="Volume"
              />
            </div>
          </div>

          <div className="video-player__speed-container">
            <button
              ref={speedButtonRef}
              type="button"
              className="video-player__speed-button"
              aria-label="Playback Speed"
            >
              <span ref={speedTextRef} className="video-player__speed-text">
                {DEFAULT_PLAYBACK_RATE}x
              </span>
            </button>
            <div
              ref={speedDropdownRef}
              className="video-player__speed-dropdown"
            >
              {PLAYBACK_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  className="video-player__speed-option"
                  data-speed={rate}
                  data-default={
                    rate === DEFAULT_PLAYBACK_RATE ? 'true' : undefined
                  }
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <button
            ref={fullscreenButtonRef}
            type="button"
            className="video-player__fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <svg
              ref={fullscreenIconRef}
              className="video-player__icon-fullscreen"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
            <svg
              ref={exitFullscreenIconRef}
              className="video-player__icon-exit-fullscreen"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          </button>
        </div>
      </div>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';
