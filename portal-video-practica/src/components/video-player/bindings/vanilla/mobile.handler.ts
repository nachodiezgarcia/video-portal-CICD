import { getIsMobileDevice } from '../../video-player.helpers';
import type { PlayerForHandlers, TapZoneHandler, UIElements } from '../../video-player.types';

export const createMobileHandler = (
  player: PlayerForHandlers,
  container: HTMLElement,
  video: HTMLVideoElement,
  elements: UIElements
) => {
  if (!getIsMobileDevice()) {
    return { destroy: () => {} };
  }

  const { tapZones, controls, gestureOverlay, gestureIcon, gestureText } = elements;

  let hideControlsTimeout: ReturnType<typeof setTimeout>;

  const showGestureFeedback = (icon: string, text: string) => {
    if (gestureIcon && gestureText && gestureOverlay && player.showGestureFeedback) {
      player.showGestureFeedback(icon, text, gestureOverlay, gestureIcon, gestureText);
    }
  };

  const hideControls = () => {
    if (controls) {
      controls.classList.add('auto-hide');
      controls.style.opacity = '0';
      controls.style.transform = 'translateY(100%)';
      controls.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
  };

  const hideControlsAfterDelay = () => {
    clearTimeout(hideControlsTimeout);
    hideControlsTimeout = setTimeout(() => {
      hideControls();
    }, 3000);
  };

  const showControls = () => {
    if (controls) {
      controls.classList.remove('auto-hide');
      controls.style.opacity = '1';
      controls.style.transform = 'translateY(0)';
      controls.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      hideControlsAfterDelay();
    }
  };

  const toggleShowControls = () => {
    if (controls) {
      const isHidden =
        controls.classList.contains('auto-hide') ||
        controls.style.opacity === '0' ||
        controls.style.transform === 'translateY(100%)';

      if (isHidden) {
        showControls();
      } else {
        hideControls();
      }
    }
  };

  const togglePlay = async () => {
    const wasPaused = video.paused;
    await player.togglePlay();
    showGestureFeedback(wasPaused ? '▶️' : '⏸️', wasPaused ? 'Play' : 'Pause');
  };

  const updateSeekGesture = (seconds: number) => {
    const direction = seconds > 0 ? '+' : '-';
    showGestureFeedback(seconds > 0 ? '⏩' : '⏪', `${direction}${Math.abs(seconds)}s`);
  };

  const seek = (seconds: number) => {
    const currentTime = player.getState().currentTime;
    player.seek(currentTime + seconds);
    updateSeekGesture(seconds);
  };

  const tapZoneHandler: TapZoneHandler = (action, tapCount) => {
    switch (action) {
      case 'play-pause':
        if (tapCount === 1) {
          togglePlay();
          showControls();
        }
        break;
      case 'rewind':
        if (tapCount >= 2) {
          seek(-5);
        } else {
          toggleShowControls();
        }
        break;
      case 'forward':
        if (tapCount >= 2) {
          seek(5);
        } else {
          toggleShowControls();
        }
        break;
    }
  };

  const onTapZone = (event: Event) => player.onTapZone(tapZoneHandler)(event as TouchEvent);
  const onTouchStart = (event: TouchEvent) => {
    player.onTouchStart(event);
  };

  const setVolume = (volume: number) => {
    player.setVolume(volume);
    showGestureFeedback('🔊', `Volume: ${Math.round(volume * 100)}%`);
  };
  const onTouchMove = (event: TouchEvent) => {
    showControls();
    player.onTouchMove(setVolume, updateSeekGesture)(event);
  };
  const onTouchEnd = (event: TouchEvent) => {
    player.onTouchEnd(seek)(event);
  };

  const setupEventListeners = () => {
    tapZones.forEach(zone => {
      zone.addEventListener('touchstart', onTapZone, { passive: false });
    });
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: false });
  };

  const destroy = () => {
    clearTimeout(hideControlsTimeout);

    if (controls) {
      controls.classList.remove('auto-hide');
      controls.style.opacity = '';
      controls.style.transform = '';
      controls.style.transition = '';
    }

    tapZones.forEach(zone => {
      zone.removeEventListener('touchstart', onTapZone);
    });
    container.removeEventListener('touchstart', onTouchStart);
    container.removeEventListener('touchmove', onTouchMove);
    container.removeEventListener('touchend', onTouchEnd);
  };

  setupEventListeners();
  hideControlsAfterDelay();

  return {
    destroy,
  };
};
