import type { VideoPlayerState } from './video-player.types';

export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
export const MIN_RATE = Math.min(...PLAYBACK_RATES);
export const MAX_RATE = Math.max(...PLAYBACK_RATES);
export const DEFAULT_PLAYBACK_RATE = 1;

export const DEFAULT_VIDEO_PLAYER_STATE: VideoPlayerState = {
  isPlaying: false,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  percentage: 0,
  isFullscreen: false,
  isDragging: false,
  isVolumeChanging: false,
  isReady: false,
  isBuffering: false,
  playbackRate: DEFAULT_PLAYBACK_RATE,
};
