import { DEFAULT_VIDEO_PLAYER_STATE } from '../video-player.constants';
import { calculatePercentage } from '../video-player.helpers';
import type { SetVideoPlayerState, VideoPlayerState } from '../video-player.types';

export const createStateManager = (setState: SetVideoPlayerState) => {
  const updateState = (updates: Partial<VideoPlayerState>) => {
    setState((prev: VideoPlayerState) => {
      const newState = { ...prev, ...updates };

      if (updates.currentTime !== undefined || updates.duration !== undefined) {
        newState.percentage = calculatePercentage(newState.currentTime, newState.duration);
      }

      return newState;
    });
  };

  const resetStateForNewSource = () => {
    setState(prev => ({
      ...prev,
      currentTime: 0,
      duration: 0,
      percentage: 0,
      isReady: false,
      isBuffering: true,
      isDragging: false,
      isVolumeChanging: false,
    }));
  };

  const resetToInitialState = () => {
    setState({ ...DEFAULT_VIDEO_PLAYER_STATE });
  };

  return {
    updateState,
    resetStateForNewSource,
    resetToInitialState,
  };
};
