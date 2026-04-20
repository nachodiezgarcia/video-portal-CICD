import type { SetVideoPlayerState, VideoPlayerFactory, VideoPlayerState } from '../video-player.types';
import {
  createFullscreenActions,
  createKeyboardActions,
  createMobileActions,
  createPlaybackActions,
  createProgressActions,
  createVolumeActions,
} from './actions';
import {
  createDocumentEventHandlers,
  createErrorEventHandlers,
  createMobileEventHandlers,
  createVideoEventHandlers,
} from './events';
import { createStateManager } from './state.manager';

export const createVideoPlayer = (
  video: HTMLVideoElement,
  container: HTMLElement,
  getState: () => VideoPlayerState,
  setState: SetVideoPlayerState
): VideoPlayerFactory => {
  const { updateState, resetStateForNewSource, resetToInitialState } = createStateManager(setState);

  const playbackActions = createPlaybackActions(video, getState, updateState);
  const volumeActions = createVolumeActions(video, updateState);
  const fullscreenActions = createFullscreenActions(container, getState);

  const progressActions = createProgressActions(
    video,
    getState,
    updateState,
    playbackActions.play,
    playbackActions.pause
  );

  const keyboardActions = createKeyboardActions(container, getState, {
    togglePlay: playbackActions.togglePlay,
    seek: playbackActions.seek,
    setVolume: volumeActions.setVolume,
    toggleMute: volumeActions.toggleMute,
    toggleFullscreen: fullscreenActions.toggleFullscreen,
    setPlaybackRate: playbackActions.setPlaybackRate,
  });

  const mobileActions = createMobileActions();

  const videoEventHandlers = createVideoEventHandlers(video, getState, updateState);
  const documentEventHandlers = createDocumentEventHandlers(updateState);
  const errorEventHandlers = createErrorEventHandlers(video);
  const mobileEventHandlers = createMobileEventHandlers(video, container);

  return {
    actions: {
      ...playbackActions,
      ...volumeActions,
      ...fullscreenActions,
      ...progressActions,
      ...mobileActions,
      // State management actions
      resetStateForNewSource,
      resetToInitialState,
    },
    eventHandlers: {
      ...videoEventHandlers,
      ...documentEventHandlers,
      ...errorEventHandlers,
      ...mobileEventHandlers,
      onKeyDown: (e: KeyboardEvent) => keyboardActions.handleKeyDown(e),
    },
  };
};
