export const createMobileActions = () => {
  let gestureTimeout: ReturnType<typeof setTimeout>;

  const showGestureFeedback = (
    icon: string,
    text: string,
    gestureOverlay: HTMLElement | null,
    gestureIcon: HTMLElement | null,
    gestureText: HTMLElement | null
  ) => {
    if (gestureIcon && gestureText && gestureOverlay) {
      gestureIcon.innerHTML = icon;
      gestureText.textContent = text;
      gestureOverlay.classList.add('active');

      clearTimeout(gestureTimeout);
      gestureTimeout = setTimeout(() => {
        gestureOverlay?.classList.remove('active');
      }, 1500);
    }
  };

  return {
    showGestureFeedback,
  };
};
