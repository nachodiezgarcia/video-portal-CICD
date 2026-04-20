import { createVideoPlayer } from '../../factory/video-player.factory';
import { DEFAULT_VIDEO_PLAYER_STATE } from '../../video-player.constants';
import { checkVideoCors, getCorsSolutions, isSameOrigin } from '../../video-player.helpers';
import type { SetVideoPlayerState, UIElements, VanillaVideoPlayer, VideoPlayerState } from '../../video-player.types';
import { createUIController } from './ui-controller';

export const createVanillaVideoPlayer = (video: HTMLVideoElement, container: HTMLElement): VanillaVideoPlayer => {
  let currentState: VideoPlayerState = { ...DEFAULT_VIDEO_PLAYER_STATE };
  let stateChangeCallbacks: ((state: VideoPlayerState) => void)[] = [];

  const setState: SetVideoPlayerState = newState => {
    if (typeof newState === 'function') {
      currentState = newState(currentState);
    } else {
      currentState = { ...currentState, ...newState };
    }

    stateChangeCallbacks.forEach(callback => callback(currentState));
  };

  const getState = () => currentState;

  const factory = createVideoPlayer(video, container, getState, setState);
  const { actions, eventHandlers } = factory;

  const setupVideoEventListeners = () => {
    video.addEventListener('loadedmetadata', eventHandlers.onLoadedMetadata);
    video.addEventListener('play', eventHandlers.onPlay);
    video.addEventListener('pause', eventHandlers.onPause);
    video.addEventListener('timeupdate', eventHandlers.onTimeUpdate);
    video.addEventListener('volumechange', eventHandlers.onVolumeChange);
    video.addEventListener('waiting', eventHandlers.onWaiting);
    video.addEventListener('canplay', eventHandlers.onCanPlay);
    video.addEventListener('error', eventHandlers.onError);
    video.addEventListener('ratechange', eventHandlers.onRateChange);

    document.addEventListener('fullscreenchange', eventHandlers.onFullscreenChange);
    document.addEventListener('keydown', eventHandlers.onKeyDown);
  };

  setupVideoEventListeners();

  let uiController: ReturnType<typeof createUIController> | null = null;

  const setupUI = (elements: UIElements) => {
    if (video.src && !isSameOrigin(video.src)) {
      checkVideoCors(video.src).then(corsSupported => {
        if (!corsSupported) {
          console.error('CORS preflight check failed. Video may not load properly.');
          console.log('Suggested solutions:', getCorsSolutions(video.src));
        } else {
          console.log('CORS appears to be properly configured.');
        }
      });
    }

    uiController = createUIController(
      {
        getState,
        setPlaybackRate: actions.setPlaybackRate,
        togglePlay: actions.togglePlay,
        seek: actions.seek,
        setVolume: actions.setVolume,
        toggleMute: actions.toggleMute,
        toggleFullscreen: actions.toggleFullscreen,
        calculateSeekPercentage: actions.calculateSeekPercentage,
        startProgressDrag: actions.startProgressDrag,
        updateProgressDrag: actions.updateProgressDrag,
        endProgressDrag: actions.endProgressDrag,
        onKeyDown: eventHandlers.onKeyDown,
        showGestureFeedback: actions.showGestureFeedback,
        onTapZone: eventHandlers.onTapZone,
        onTouchStart: eventHandlers.onTouchStart,
        onTouchMove: eventHandlers.onTouchMove,
        onTouchEnd: eventHandlers.onTouchEnd,
        onStateChange: (callback: (state: VideoPlayerState) => void) => {
          stateChangeCallbacks.push(callback);
          return () => {
            stateChangeCallbacks = stateChangeCallbacks.filter(cb => cb !== callback);
          };
        },
      },
      container,
      video,
      elements
    );

    if (video.src) {
      video.load();
    }
  };

  let srcObserver: MutationObserver | null = null;

  const setupSrcObserver = () => {
    srcObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          const newSrc = video.getAttribute('src');
          if (newSrc) {
            actions.resetStateForNewSource();

            if (!isSameOrigin(newSrc)) {
              checkVideoCors(newSrc).then(corsSupported => {
                if (!corsSupported) {
                  console.error('CORS preflight check failed for new video source.');
                  console.log('Suggested solutions:', getCorsSolutions(newSrc));
                } else {
                  console.log('CORS appears to be properly configured for new video source.');
                }
              });
            }

            video.load();
          } else {
            actions.resetToInitialState();
          }
        }
      });
    });

    srcObserver.observe(video, {
      attributes: true,
      attributeFilter: ['src'],
    });
  };

  setupSrcObserver();

  const destroy = () => {
    if (srcObserver) {
      srcObserver.disconnect();
      srcObserver = null;
    }

    if (uiController) {
      uiController.destroy();
      uiController = null;
    }

    video.removeEventListener('loadedmetadata', eventHandlers.onLoadedMetadata);
    video.removeEventListener('play', eventHandlers.onPlay);
    video.removeEventListener('pause', eventHandlers.onPause);
    video.removeEventListener('timeupdate', eventHandlers.onTimeUpdate);
    video.removeEventListener('volumechange', eventHandlers.onVolumeChange);
    video.removeEventListener('waiting', eventHandlers.onWaiting);
    video.removeEventListener('canplay', eventHandlers.onCanPlay);
    video.removeEventListener('error', eventHandlers.onError);
    video.removeEventListener('ratechange', eventHandlers.onRateChange);

    document.removeEventListener('fullscreenchange', eventHandlers.onFullscreenChange);
    document.removeEventListener('keydown', eventHandlers.onKeyDown);

    stateChangeCallbacks = [];
  };

  return {
    setupUI,
    destroy,
  };
};
