export const formatTime = (time: number): string => {
  if (!time || isNaN(time) || !isFinite(time)) {
    return '00:00';
  }

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const isVideoReady = (video: HTMLVideoElement): boolean => {
  return !!(video && video.duration && isFinite(video.duration) && !isNaN(video.duration));
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const calculatePercentage = (currentTime: number, duration: number): number => {
  if (!duration || duration === 0 || !isFinite(duration) || isNaN(duration)) {
    return 0;
  }

  if (!currentTime || !isFinite(currentTime) || isNaN(currentTime)) {
    return 0;
  }

  return clamp((currentTime / duration) * 100, 0, 100);
};

// Check if a video URL might have CORS issues
export const checkVideoCors = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
    });
    return response.ok;
  } catch (error) {
    console.warn('CORS preflight check failed for video URL:', url, error);
    return false;
  }
};

// Get video error description
export const getVideoErrorDescription = (error: MediaError | null): string => {
  if (!error) return 'Unknown error';

  switch (error.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      return 'Video loading was aborted by the user';
    case MediaError.MEDIA_ERR_NETWORK:
      return 'Network error occurred while loading video (possible CORS/ORB issue)';
    case MediaError.MEDIA_ERR_DECODE:
      return 'Error occurred while decoding the video';
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return 'Video format not supported or source blocked by security policy';
    default:
      return `Unknown error (code: ${error.code})`;
  }
};

// Check if URL is same origin
export const isSameOrigin = (url: string): boolean => {
  try {
    const videoUrl = new URL(url, window.location.href);
    return videoUrl.origin === window.location.origin;
  } catch {
    return false;
  }
};

// Suggest CORS solutions
export const getCorsSolutions = (videoUrl: string): string[] => {
  const solutions = [
    'Serve the video from the same origin as your website',
    'Configure proper CORS headers (Access-Control-Allow-Origin) on the video server',
    'Use a video CDN that supports CORS',
    'Consider using a video proxy service',
  ];

  if (!isSameOrigin(videoUrl)) {
    solutions.unshift('⚠️  Video is served from a different origin');
  }

  return solutions;
};

export const getIsMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  window.matchMedia('(pointer: coarse)').matches;
