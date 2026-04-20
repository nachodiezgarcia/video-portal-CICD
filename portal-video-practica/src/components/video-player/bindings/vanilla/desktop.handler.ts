import { getIsMobileDevice } from '../../video-player.helpers';
import type { PlayerForHandlers, UIElements } from '../../video-player.types';

export const createDesktopHandler = (player: PlayerForHandlers, video: HTMLVideoElement, elements: UIElements) => {
  const onClick = async (e: Event) => {
    const event = e as MouseEvent | TouchEvent;

    const isMobileDevice = getIsMobileDevice();

    if (isMobileDevice && elements.tapZones && elements.tapZones.length > 0) {
      const tapZonesVisible = Array.from(elements.tapZones).some(zone => {
        const style = getComputedStyle(zone);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      if (tapZonesVisible) {
        return;
      }

      return {
        destroy: () => {},
      };
    }

    if (event.type === 'touchend') {
      e.preventDefault();
      e.stopPropagation();
    }

    await player.togglePlay();
  };

  const setupEventListeners = () => {
    video.addEventListener('click', onClick);
    video.addEventListener('touchend', onClick, { passive: false });
  };

  const destroy = () => {
    video.removeEventListener('click', onClick);
    video.removeEventListener('touchend', onClick);
  };

  setupEventListeners();

  return {
    destroy,
  };
};
