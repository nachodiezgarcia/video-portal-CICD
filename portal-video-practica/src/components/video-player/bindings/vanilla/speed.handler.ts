import type { PlayerForHandlers } from '../../video-player.types';

export const createSpeedHandler = (
  player: PlayerForHandlers,
  speedButton: Element,
  speedDropdown: Element,
  speedOptions: NodeListOf<Element>
) => {
  let isDropdownOpen = false;

  const handleSpeedButtonClick = (e: Event) => {
    e.stopPropagation();
    toggleDropdown();
  };

  const handleSpeedOptionClick = (e: Event) => {
    e.stopPropagation();
    const speed = parseFloat((e.target as HTMLElement).dataset.speed || '1');
    player.setPlaybackRate(speed);
    closeDropdown();
  };

  const handleDocumentClick = (e: Event) => {
    if (!speedButton.contains(e.target as Node) && !speedDropdown.contains(e.target as Node)) {
      closeDropdown();
    }
  };

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
    speedDropdown.classList.toggle('open', isDropdownOpen);
  };

  const closeDropdown = () => {
    isDropdownOpen = false;
    speedDropdown.classList.remove('open');
  };

  const setupEventListeners = () => {
    speedButton.addEventListener('click', handleSpeedButtonClick);
    speedOptions.forEach(option => {
      option.addEventListener('click', handleSpeedOptionClick);
    });
    document.addEventListener('click', handleDocumentClick);
  };

  const destroy = () => {
    speedButton.removeEventListener('click', handleSpeedButtonClick);
    speedOptions.forEach(option => {
      option.removeEventListener('click', handleSpeedOptionClick);
    });
    document.removeEventListener('click', handleDocumentClick);
  };

  setupEventListeners();

  return {
    destroy,
  };
};
