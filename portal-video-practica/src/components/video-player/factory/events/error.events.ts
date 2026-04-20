import { getCorsSolutions, getVideoErrorDescription } from '../../video-player.helpers';

export const createErrorEventHandlers = (video: HTMLVideoElement) => {
  const onError = (event: Event) => {
    console.error('Video playback error:', event);

    if (video.error) {
      const errorCode = video.error.code;
      const errorMessage = video.error.message;
      const errorDescription = getVideoErrorDescription(video.error);

      console.error('Video error details:', {
        code: errorCode,
        message: errorMessage,
        description: errorDescription,
        currentSrc: video.currentSrc,
        readyState: video.readyState,
        networkState: video.networkState,
      });

      if (errorCode === MediaError.MEDIA_ERR_NETWORK || errorCode === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        console.log('Possible solutions:');
        const solutions = getCorsSolutions(video.currentSrc || video.src);
        solutions.forEach((solution, index) => {
          console.log(`${index + 1}. ${solution}`);
        });
      }
    }
  };

  return {
    onError,
  };
};
