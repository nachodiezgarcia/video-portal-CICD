import { formatTime } from '../../video-player.helpers';
import type { PlayerForHandlers, UIElements, VideoPlayerState } from '../../video-player.types';
import { createDesktopHandler } from './desktop.handler';
import { createFullscreenHandler } from './fullscreen.handler';
import { createMobileHandler } from './mobile.handler';
import { createProgressDragHandler } from './progress-drag.handler';
import { createSpeedHandler } from './speed.handler';

export const createUIController = (
  player: PlayerForHandlers,
  container: HTMLElement,
  video: HTMLVideoElement,
  elements: UIElements
) => {
  let progressDragHandler: ReturnType<typeof createProgressDragHandler> | null = null;
  let speedControlHandler: ReturnType<typeof createSpeedHandler> | null = null;
  let fullscreenControlsHandler: ReturnType<typeof createFullscreenHandler> | null = null;
  let mobileHandler: ReturnType<typeof createMobileHandler> | null = null;
  let desktopHandler: ReturnType<typeof createDesktopHandler> | null = null;

  const handlePlayPauseClick = async () => {
    await player.togglePlay();
  };

  const handleProgressBarClick = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    const clickedElement = mouseEvent.target as Element;

    if (!elements.progressThumb.contains(clickedElement) && clickedElement !== elements.progressThumb) {
      const rect = elements.progressBar.getBoundingClientRect();
      const percentage = player.calculateSeekPercentage(mouseEvent.clientX, rect);
      const duration = player.getState().duration;
      if (duration > 0) {
        const seekTime = (percentage / 100) * duration;
        player.seek(seekTime);
      }
    }
  };

  const handleMuteClick = () => {
    player.toggleMute();
  };

  const handleVolumeSliderInput = (e: Event) => {
    const volume = parseFloat((e.target as HTMLInputElement).value);
    player.setVolume(volume);
  };

  const handleVolumeTrackClick = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    const clickedElement = mouseEvent.target as Element;

    if (!elements.volumeThumb.contains(clickedElement) && clickedElement !== elements.volumeThumb) {
      const rect = elements.volumeTrack.getBoundingClientRect();
      const clickX = mouseEvent.clientX - rect.left;
      const volume = Math.max(0, Math.min(1, clickX / rect.width));
      player.setVolume(volume);
    }
  };

  const handleFullscreenClick = async () => {
    await player.toggleFullscreen();
  };

  const updateBufferProgress = () => {
    if (video.buffered.length > 0 && video.duration && elements.progressBuffer) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const percentage = (bufferedEnd / video.duration) * 100;
      elements.progressBuffer.style.width = `${percentage}%`;
    }
  };

  const updateUI = (state: VideoPlayerState) => {
    elements.playIcon.classList.toggle('hidden', state.isPlaying);
    elements.pauseIcon.classList.toggle('hidden', !state.isPlaying);

    elements.currentTime.textContent = formatTime(state.currentTime);
    elements.duration.textContent = formatTime(state.duration);

    if (state.duration > 0 && !state.isDragging) {
      elements.progressFilled.style.width = `${state.percentage}%`;
      elements.progressThumb.style.left = `${state.percentage}%`;
    }

    elements.volumeIcon.classList.toggle('hidden', state.isMuted);
    elements.muteIcon.classList.toggle('hidden', !state.isMuted);
    elements.volumeSlider.value = state.volume.toString();

    const volumePercentage = state.isMuted ? 0 : state.volume * 100;
    elements.volumeFilled.style.width = `${volumePercentage}%`;
    elements.volumeThumb.style.right = `${100 - volumePercentage}%`;

    elements.speedText.textContent = `${state.playbackRate}x`;
    elements.speedOptions.forEach(option => {
      const speed = parseFloat((option as HTMLElement).dataset.speed || '1');
      option.classList.toggle('active', speed === state.playbackRate);
    });

    elements.fullscreenIcon.classList.toggle('hidden', state.isFullscreen);
    elements.exitFullscreenIcon.classList.toggle('hidden', !state.isFullscreen);
  };

  const setupEventListeners = () => {
    elements.playPauseButton.addEventListener('click', handlePlayPauseClick);
    elements.progressBar.addEventListener('click', handleProgressBarClick);
    elements.muteButton.addEventListener('click', handleMuteClick);
    elements.volumeSlider.addEventListener('input', handleVolumeSliderInput);
    elements.volumeTrack.addEventListener('click', handleVolumeTrackClick);
    elements.fullscreenButton.addEventListener('click', handleFullscreenClick);
    document.addEventListener('keydown', player.onKeyDown);
    video.addEventListener('progress', updateBufferProgress);
  };

  const setupHandlers = () => {
    progressDragHandler = createProgressDragHandler(
      player,
      elements.progressBar,
      elements.progressThumb,
      (percentage: number) => {
        elements.progressFilled.style.width = `${percentage}%`;
        elements.progressThumb.style.left = `${percentage}%`;
      }
    );

    speedControlHandler = createSpeedHandler(
      player,
      elements.speedButton,
      elements.speedDropdown,
      elements.speedOptions
    );

    fullscreenControlsHandler = createFullscreenHandler(player, container, elements.controls);

    mobileHandler = createMobileHandler(player, container, video, elements);
    desktopHandler = createDesktopHandler(player, video, elements);
  };

  const initializeUI = () => {
    const initialState = player.getState();
    updateUI(initialState);

    player.onStateChange((state: VideoPlayerState) => {
      updateUI(state);

      if (fullscreenControlsHandler) {
        fullscreenControlsHandler.onFullscreenChange(state.isFullscreen);
      }
    });
  };

  const destroy = () => {
    if (progressDragHandler) {
      progressDragHandler.destroy();
      progressDragHandler = null;
    }

    if (speedControlHandler) {
      speedControlHandler.destroy();
      speedControlHandler = null;
    }

    if (fullscreenControlsHandler) {
      fullscreenControlsHandler.destroy();
      fullscreenControlsHandler = null;
    }

    if (mobileHandler) {
      mobileHandler.destroy();
      mobileHandler = null;
    }

    if (desktopHandler) {
      desktopHandler.destroy();
      desktopHandler = null;
    }

    elements.playPauseButton.removeEventListener('click', handlePlayPauseClick);
    elements.progressBar.removeEventListener('click', handleProgressBarClick);
    elements.muteButton.removeEventListener('click', handleMuteClick);
    elements.volumeSlider.removeEventListener('input', handleVolumeSliderInput);
    elements.volumeTrack.removeEventListener('click', handleVolumeTrackClick);
    elements.fullscreenButton.removeEventListener('click', handleFullscreenClick);
    document.removeEventListener('keydown', player.onKeyDown);
    video.removeEventListener('progress', updateBufferProgress);
  };

  setupEventListeners();
  setupHandlers();
  initializeUI();

  return {
    destroy,
  };
};
