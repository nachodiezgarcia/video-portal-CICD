import { MAX_RATE, MIN_RATE } from '../../video-player.constants';
import { clamp, isVideoReady } from '../../video-player.helpers';
import type { VideoPlayerState } from '../../video-player.types';

export const createPlaybackActions = (
  video: HTMLVideoElement,
  getState: () => VideoPlayerState,
  updateState: (updates: Partial<VideoPlayerState>) => void
) => {
  const play = async () => {
    const currentState = getState();
    if (!currentState.isReady) {
      return;
    }
    try {
      await video.play();
    } catch (error) {
      console.error('Error playing video:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorName = error instanceof Error ? error.name : '';

      if (errorName === 'NotAllowedError') {
        console.error('Video play was blocked. This might be due to autoplay policy or CORS issues.');
      } else if (errorMessage.includes('CORS') || errorMessage.includes('ORB') || errorMessage.includes('blocked')) {
        console.error('CORS/ORB error detected. The video source might not allow cross-origin access.');
      }

      if (errorName === 'NetworkError' || errorMessage.includes('network') || errorMessage.includes('Failed to load')) {
        console.log('Network error detected, attempting to reload video...');
        try {
          video.load();
        } catch (reloadError) {
          console.error('Failed to reload video:', reloadError);
        }
      }
    }
  };

  const pause = () => {
    const currentState = getState();
    if (!currentState.isReady) {
      return;
    }
    video.pause();
  };

  const togglePlay = async () => {
    const currentState = getState();
    if (currentState.isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const seek = (time: number) => {
    const currentState = getState();
    if (!currentState.isReady || !isVideoReady(video)) {
      return;
    }
    try {
      const clampedTime = clamp(time, 0, video.duration);
      video.currentTime = clampedTime;
      updateState({ currentTime: clampedTime });
    } catch (error) {
      console.error('Error seeking video:', error);
    }
  };

  const setPlaybackRate = (rate: number) => {
    const clampedRate = clamp(rate, MIN_RATE, MAX_RATE);
    video.playbackRate = clampedRate;
    updateState({ playbackRate: clampedRate });
  };

  return {
    play,
    pause,
    togglePlay,
    seek,
    setPlaybackRate,
  };
};
