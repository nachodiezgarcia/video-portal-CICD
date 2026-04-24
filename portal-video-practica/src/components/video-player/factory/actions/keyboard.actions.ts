import { DEFAULT_PLAYBACK_RATE, PLAYBACK_RATES } from '../../video-player.constants';
import type { VideoPlayerState } from '../../video-player.types';

export const createKeyboardActions = (
  container: HTMLElement,
  getState: () => VideoPlayerState,
  actions: {
    togglePlay: () => Promise<void>;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    toggleFullscreen: () => Promise<void>;
    setPlaybackRate: (rate: number) => void;
  }
) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isInputFocused =
      document.activeElement &&
      (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.tagName === 'SELECT' ||
        (document.activeElement as HTMLElement).contentEditable === 'true');

    const isVideoFocused = document.activeElement === container || container.contains(document.activeElement as Node);

    if (isVideoFocused || !isInputFocused) {
      const currentState = getState();

      switch (e.key) {
        case ' ':
          e.preventDefault();
          actions.togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          actions.seek(currentState.currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          actions.seek(currentState.currentTime + 5);
          break;
        case 'ArrowUp': {
          e.preventDefault();
          const currentVol = currentState.volume;
          actions.setVolume(Math.min(1, currentVol + 0.1));
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const currentVolDown = currentState.volume;
          actions.setVolume(Math.max(0, currentVolDown - 0.1));
          break;
        }
        case 'k':
        case 'K':
          e.preventDefault();
          actions.togglePlay();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          actions.toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          actions.toggleFullscreen();
          break;
        case 'Escape':
          if (currentState.isFullscreen) {
            e.preventDefault();
            actions.toggleFullscreen();
          }
          break;
        case ',': {
          e.preventDefault();
          const currentSpeedDown = currentState.playbackRate;
          const currentIndexDown = PLAYBACK_RATES.indexOf(currentSpeedDown);
          const newIndexDown = Math.max(0, currentIndexDown - 1);
          actions.setPlaybackRate(PLAYBACK_RATES[newIndexDown] ?? DEFAULT_PLAYBACK_RATE);
          break;
        }
        case '.': {
          e.preventDefault();
          const currentSpeedUp = currentState.playbackRate;
          const currentIndexUp = PLAYBACK_RATES.indexOf(currentSpeedUp);
          const newIndexUp = Math.min(PLAYBACK_RATES.length - 1, currentIndexUp + 1);
          actions.setPlaybackRate(PLAYBACK_RATES[newIndexUp] ?? DEFAULT_PLAYBACK_RATE);
          break;
        }
      }
    }
  };

  return {
    handleKeyDown,
  };
};
