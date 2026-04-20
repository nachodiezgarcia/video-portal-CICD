import { clamp } from '../../video-player.helpers';
import type { OnTapZone, OnTouchEnd, OnTouchMove, OnTouchStart } from '../../video-player.types';

export const createMobileEventHandlers = (video: HTMLVideoElement, container: HTMLElement) => {
  let lastTapTime = 0;
  let tapCount = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isSeeking = false;
  let isVolumeChanging = false;
  let startVolume = 0;

  const onTapZone: OnTapZone = tapZoneHandler => event => {
    event.preventDefault();
    const action = (event.currentTarget as HTMLElement).dataset.action;
    const currentTime = Date.now();

    if (currentTime - lastTapTime < 300) {
      tapCount++;
    } else {
      tapCount = 1;
    }
    lastTapTime = currentTime;

    setTimeout(() => {
      if (!isSeeking && !isVolumeChanging) {
        tapZoneHandler(action, tapCount);
      }
      tapCount = 0;
    }, 300);
  };

  const onTouchStart: OnTouchStart = event => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    startVolume = video.volume;
  };

  const handleSeek = (deltaX: number, containerRect: DOMRect, seek: (time: number) => void) => {
    const seekAmount = (deltaX / containerRect.width) * 60;
    seek(Math.round(seekAmount));
  };

  const onTouchMove: OnTouchMove = (setVolume, seek) => event => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const timeDelta = Date.now() - touchStartTime;

    // Only handle if touch has moved significantly and enough time has passed
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10 || timeDelta > 200) {
      event.preventDefault();

      const containerRect = container.getBoundingClientRect();

      // Horizontal swipe - seeking
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (!isSeeking) {
          isSeeking = true;
        }
        handleSeek(deltaX, containerRect, seek);
      }
      // Vertical swipe - volume (right side)
      else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
        if (!isVolumeChanging) {
          isVolumeChanging = true;
        }
        const volumeChange = -deltaY / containerRect.height;
        const newVolume = clamp(startVolume + volumeChange, 0, 1);
        setVolume(newVolume);
      }
    }
  };

  const onTouchEnd: OnTouchEnd = seek => event => {
    if (isSeeking) {
      const touch = event.changedTouches[0];
      isSeeking = false;
      if (touch) {
        const deltaX = touch.clientX - touchStartX;
        const containerRect = container.getBoundingClientRect();
        handleSeek(deltaX, containerRect, seek);
      }
    }

    if (isVolumeChanging) {
      isVolumeChanging = false;
    }

    touchStartX = 0;
    touchStartY = 0;
    touchStartTime = 0;
  };

  return {
    onTapZone,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
