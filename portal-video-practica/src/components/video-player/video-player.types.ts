export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  percentage: number;
  isFullscreen: boolean;
  isDragging: boolean;
  isVolumeChanging: boolean;
  isReady: boolean;
  isBuffering: boolean;
  playbackRate: number;
}

export type SetVideoPlayerState = (newState: VideoPlayerState | ((prev: VideoPlayerState) => VideoPlayerState)) => void;

export interface UIElements {
  controls: HTMLElement;
  playPauseButton: HTMLElement;
  playIcon: HTMLElement;
  pauseIcon: HTMLElement;
  currentTime: HTMLElement;
  duration: HTMLElement;
  progressBar: HTMLElement;
  progressFilled: HTMLElement;
  progressThumb: HTMLElement;
  progressBuffer: HTMLElement;
  muteButton: HTMLElement;
  volumeIcon: HTMLElement;
  muteIcon: HTMLElement;
  volumeSlider: HTMLInputElement;
  volumeTrack: HTMLElement;
  volumeFilled: HTMLElement;
  volumeThumb: HTMLElement;
  speedButton: HTMLElement;
  speedText: HTMLElement;
  speedDropdown: HTMLElement;
  speedOptions: NodeListOf<Element>;
  fullscreenButton: HTMLElement;
  fullscreenIcon: HTMLElement;
  exitFullscreenIcon: HTMLElement;
  // Mobile elements
  gestureOverlay: HTMLElement;
  gestureFeedback: HTMLElement;
  gestureIcon: HTMLElement;
  gestureText: HTMLElement;
  tapZones: NodeListOf<Element>;
}

export type TapZoneHandler = (action: string | undefined, tapCount: number) => void;
export type OnTapZone = (tapZoneHandler: TapZoneHandler) => (event: TouchEvent) => void;
export type OnTouchStart = (event: TouchEvent) => void;
export type OnTouchMove = (
  setVolume: (volume: number) => void,
  seek: (seconds: number) => void
) => (event: TouchEvent) => void;
export type OnTouchEnd = (seek: (seconds: number) => void) => (event: TouchEvent) => void;

export interface VideoPlayerFactory {
  actions: {
    play: () => Promise<void>;
    pause: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    setPlaybackRate: (rate: number) => void;
    toggleMute: () => void;
    toggleFullscreen: () => Promise<void>;
    setDragging: (isDragging: boolean) => void;
    setVolumeChanging: (isVolumeChanging: boolean) => void;
    startProgressDrag: (wasPlaying: boolean) => void;
    updateProgressDrag: (percentage: number) => void;
    endProgressDrag: (wasPlaying: boolean) => void;
    calculateSeekPercentage: (clientX: number, progressBarRect: DOMRect) => number;
    togglePlay: () => Promise<void>;
    showGestureFeedback: (
      icon: string,
      text: string,
      gestureOverlay: HTMLElement | null,
      gestureIcon: HTMLElement | null,
      gestureText: HTMLElement | null
    ) => void;
    resetStateForNewSource: () => void;
    resetToInitialState: () => void;
  };
  eventHandlers: {
    onLoadedMetadata: () => void;
    onTimeUpdate: () => void;
    onPlay: () => void;
    onPause: () => void;
    onVolumeChange: () => void;
    onWaiting: () => void;
    onCanPlay: () => void;
    onError: (event: Event) => void;
    onFullscreenChange: () => void;
    onRateChange: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onTapZone: OnTapZone;
    onTouchStart: OnTouchStart;
    onTouchMove: OnTouchMove;
    onTouchEnd: OnTouchEnd;
  };
}

export interface VanillaVideoPlayer {
  setupUI: (elements: UIElements) => void;
  destroy: () => void;
}

export interface PlayerForHandlers {
  getState: () => VideoPlayerState;
  setPlaybackRate: (rate: number) => void;
  togglePlay: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => Promise<void>;
  calculateSeekPercentage: (clientX: number, progressBarRect: DOMRect) => number;
  startProgressDrag: (wasPlaying: boolean) => void;
  updateProgressDrag: (percentage: number) => void;
  endProgressDrag: (wasPlaying: boolean) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  onStateChange: (callback: (state: VideoPlayerState) => void) => () => void;
  showGestureFeedback?: (
    icon: string,
    text: string,
    gestureOverlay: HTMLElement | null,
    gestureIcon: HTMLElement | null,
    gestureText: HTMLElement | null
  ) => void;
  onTapZone: OnTapZone;
  onTouchStart: OnTouchStart;
  onTouchMove: OnTouchMove;
  onTouchEnd: OnTouchEnd;
}
