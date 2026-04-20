import type { PlayerForHandlers } from '../../video-player.types';

export const createFullscreenHandler = (player: PlayerForHandlers, container: HTMLElement, controls?: HTMLElement) => {
  let controlsHideTimeout: ReturnType<typeof setTimeout> | null = null;

  const hideControls = () => {
    if (controls && player.getState().isFullscreen) {
      controls.classList.add('auto-hide');
    }
  };

  const showControls = () => {
    if (controls) {
      controls.classList.remove('auto-hide');
    }

    clearHideTimeout();

    if (player.getState().isFullscreen) {
      controlsHideTimeout = setTimeout(() => {
        hideControls();
      }, 3000);
    }
  };

  const clearHideTimeout = () => {
    if (controlsHideTimeout) {
      clearTimeout(controlsHideTimeout);
      controlsHideTimeout = null;
    }
  };

  const onMouseLeave = () => {
    if (player.getState().isFullscreen) {
      clearHideTimeout();
      hideControls();
    }
  };

  const onClick = (e: Event) => {
    const clickedElement = e.target as Element;
    const isControlsClick = controls && controls.contains(clickedElement);

    if (!isControlsClick) {
      container.focus();
    }
    showControls();
  };

  const setupEventListeners = () => {
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mousemove', showControls);
    container.addEventListener('touchstart', showControls);
    container.addEventListener('click', onClick);
    container.addEventListener('mouseenter', showControls);
    container.addEventListener('touchmove', showControls);
    container.setAttribute('tabindex', '0');
  };

  let previousIsFullscreen = player.getState().isFullscreen;
  const onFullscreenChange = (isFullscreen: boolean) => {
    if (previousIsFullscreen === isFullscreen) {
      return;
    }
    previousIsFullscreen = isFullscreen;
    if (isFullscreen) {
      showControls();
    } else {
      clearHideTimeout();
    }
  };

  const destroy = () => {
    clearHideTimeout();
    container.removeEventListener('mouseleave', onMouseLeave);
    container.removeEventListener('mousemove', showControls);
    container.removeEventListener('touchstart', showControls);
    container.removeEventListener('click', onClick);
    container.removeEventListener('mouseenter', showControls);
    container.removeEventListener('touchmove', showControls);
  };

  setupEventListeners();

  return {
    onFullscreenChange,
    destroy,
  };
};
