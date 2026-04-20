import type { VideoPlayerState } from '../../video-player.types';

export const createDocumentEventHandlers = (updateState: (updates: Partial<VideoPlayerState>) => void) => {
  const onFullscreenChange = () => {
    updateState({ isFullscreen: !!document.fullscreenElement });
  };

  return {
    onFullscreenChange,
  };
};
