import type { PlayerForHandlers } from '../../video-player.types';

export const createProgressDragHandler = (
  player: PlayerForHandlers,
  progressBar: Element,
  progressThumb: Element,
  onUIUpdate: (percentage: number) => void
) => {
  let wasPlayingBeforeDrag = false;

  const handleMouseDown = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    startDrag(mouseEvent.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    const state = player.getState();
    if (state.isDragging) {
      updateDrag(e.clientX);
      e.preventDefault();
    }
  };

  const handleTouchStart = (e: Event) => {
    const touchEvent = e as TouchEvent;
    const touch = touchEvent.touches[0];
    if (touchEvent.touches.length === 1 && touch) {
      startDrag(touch.clientX);
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: Event) => {
    const touchEvent = e as TouchEvent;
    const state = player.getState();
    const touch = touchEvent.touches[0];
    if (state.isDragging && touchEvent.touches.length === 1 && touch) {
      updateDrag(touch.clientX);
      e.preventDefault();
    }
  };

  const handleClick = (e: Event) => {
    const state = player.getState();
    if (!state.isDragging) {
      const mouseEvent = e as MouseEvent;
      const rect = progressBar.getBoundingClientRect();
      const percentage = player.calculateSeekPercentage(mouseEvent.clientX, rect);
      const seekTime = (percentage / 100) * state.duration;
      player.seek(seekTime);
      onUIUpdate(percentage);
    }
  };

  const startDrag = (clientX: number) => {
    wasPlayingBeforeDrag = player.getState().isPlaying;
    player.startProgressDrag(wasPlayingBeforeDrag);
    progressBar.classList.add('dragging');
    updateDrag(clientX);
  };

  const updateDrag = (clientX: number) => {
    const rect = progressBar.getBoundingClientRect();
    const percentage = player.calculateSeekPercentage(clientX, rect);
    player.updateProgressDrag(percentage);
    onUIUpdate(percentage);
  };

  const endDrag = () => {
    const state = player.getState();
    if (state.isDragging) {
      player.endProgressDrag(wasPlayingBeforeDrag);
      progressBar.classList.remove('dragging');
    }
  };

  const setupEventListeners = () => {
    progressBar.addEventListener('mousedown', handleMouseDown);
    progressThumb.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', endDrag);

    progressBar.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
    progressThumb.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
    document.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    document.addEventListener('touchend', endDrag);

    progressBar.addEventListener('click', handleClick);
  };

  const destroy = () => {
    progressBar.removeEventListener('mousedown', handleMouseDown);
    progressThumb.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', endDrag);

    progressBar.removeEventListener('touchstart', handleTouchStart as EventListener);
    progressThumb.removeEventListener('touchstart', handleTouchStart as EventListener);
    document.removeEventListener('touchmove', handleTouchMove as EventListener);
    document.removeEventListener('touchend', endDrag);

    progressBar.removeEventListener('click', handleClick);
  };

  setupEventListeners();

  return {
    destroy,
  };
};
