import { clamp } from '../../video-player.helpers';
import type { VideoPlayerState } from '../../video-player.types';

export const createVolumeActions = (
  video: HTMLVideoElement,
  updateState: (updates: Partial<VideoPlayerState>) => void
) => {
  const setVolume = (volume: number) => {
    const clampedVolume = clamp(volume, 0, 1);
    video.volume = clampedVolume;
    updateState({ volume: clampedVolume });
  };

  const setVolumeChanging = (isVolumeChanging: boolean) => {
    updateState({ isVolumeChanging });
  };

  const toggleMute = () => {
    video.muted = !video.muted;
    updateState({ isMuted: video.muted });
  };

  return {
    setVolume,
    setVolumeChanging,
    toggleMute,
  };
};
