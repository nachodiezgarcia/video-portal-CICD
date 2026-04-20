import { clamp } from '../../video-player.helpers';
import type { VideoPlayerState } from '../../video-player.types';

export const createProgressActions = (
  video: HTMLVideoElement,
  getState: () => VideoPlayerState,
  updateState: (updates: Partial<VideoPlayerState>) => void,
  playAction: () => Promise<void>,
  pauseAction: () => void
) => {
  const setDragging = (isDragging: boolean) => {
    updateState({ isDragging });
  };

  const startProgressDrag = (wasPlaying: boolean) => {
    updateState({ isDragging: true });
    if (wasPlaying) {
      pauseAction();
    }
  };

  const updateProgressDrag = (percentage: number) => {
    const currentState = getState();
    if (currentState.isDragging && currentState.duration > 0 && video.readyState >= 2) {
      try {
        const seekTime = (percentage / 100) * currentState.duration;
        const clampedTime = clamp(seekTime, 0, currentState.duration);
        video.currentTime = clampedTime;
        updateState({ currentTime: clampedTime });
      } catch (error) {
        console.error('Error updating progress during drag:', error);
      }
    }
  };

  const endProgressDrag = (wasPlaying: boolean) => {
    updateState({ isDragging: false });
    if (wasPlaying) {
      playAction();
    }
  };

  const calculateSeekPercentage = (clientX: number, progressBarRect: DOMRect) => {
    const normalizedPercentage = Math.max(0, Math.min(1, (clientX - progressBarRect.left) / progressBarRect.width));
    return normalizedPercentage * 100;
  };

  return {
    setDragging,
    startProgressDrag,
    updateProgressDrag,
    endProgressDrag,
    calculateSeekPercentage,
  };
};
