import type { VideoPlayerState } from '../../video-player.types';

export const createVideoEventHandlers = (
  video: HTMLVideoElement,
  getState: () => VideoPlayerState,
  updateState: (updates: Partial<VideoPlayerState>) => void
) => {
  const onLoadedMetadata = () => {
    const currentState = getState();
    video.playbackRate = currentState.playbackRate;
    video.volume = currentState.volume;
    if (currentState.isMuted) {
      video.muted = true;
    }
    if (currentState.isPlaying) {
      video.play();
    }

    updateState({
      isReady: true,
      duration: video.duration,
      isMuted: video.muted,
      currentTime: video.currentTime, // This will auto-calculate percentage
    });
  };

  const onTimeUpdate = () => {
    updateState({ currentTime: video.currentTime });
  };

  const onPlay = () => {
    updateState({ isPlaying: true });
  };

  const onPause = () => {
    updateState({ isPlaying: false });
  };

  const onVolumeChange = () => {
    updateState({
      volume: video.volume,
      isMuted: video.muted,
    });
  };

  const onWaiting = () => {
    updateState({ isBuffering: true });
  };

  const onCanPlay = () => {
    updateState({ isBuffering: false });
  };

  const onRateChange = () => {
    updateState({ playbackRate: video.playbackRate });
  };

  return {
    onLoadedMetadata,
    onTimeUpdate,
    onPlay,
    onPause,
    onVolumeChange,
    onWaiting,
    onCanPlay,
    onRateChange,
  };
};
