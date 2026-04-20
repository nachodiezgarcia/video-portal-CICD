import type { VideoPlayerState } from '../../video-player.types';

export const createFullscreenActions = (container: HTMLElement, getState: () => VideoPlayerState) => {
  const toggleFullscreen = async () => {
    const currentState = getState();
    try {
      if (currentState.isFullscreen) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } else {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return {
    toggleFullscreen,
  };
};
