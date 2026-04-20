import { describe, it, expect } from 'vitest';
import { mapCssPropsToVars } from './video-player.mapper';

describe('mapCssPropsToVars', () => {
  it('should return an empty object when no props are provided', () => {
    expect(mapCssPropsToVars({})).toEqual({});
  });

  it('should map primaryColor to --video-player-primary', () => {
    expect(mapCssPropsToVars({ primaryColor: '#ffcc00' })).toEqual({
      '--video-player-primary': '#ffcc00',
    });
  });

  it('should map backgroundColor to --video-player-background', () => {
    expect(mapCssPropsToVars({ backgroundColor: 'rgba(0,0,0,0.9)' })).toEqual({
      '--video-player-background': 'rgba(0,0,0,0.9)',
    });
  });

  it('should map textColor to --video-player-text', () => {
    expect(mapCssPropsToVars({ textColor: '#fafafa' })).toEqual({
      '--video-player-text': '#fafafa',
    });
  });

  it('should map borderRadius to --video-player-border-radius', () => {
    expect(mapCssPropsToVars({ borderRadius: '12px' })).toEqual({
      '--video-player-border-radius': '12px',
    });
  });

  it('should map multiple props at once', () => {
    const result = mapCssPropsToVars({
      primaryColor: '#ffcc00',
      backgroundColor: '#000',
      textColor: '#fff',
      borderRadius: '8px',
    });

    expect(result).toEqual({
      '--video-player-primary': '#ffcc00',
      '--video-player-background': '#000',
      '--video-player-text': '#fff',
      '--video-player-border-radius': '8px',
    });
  });

  it('should omit undefined props', () => {
    const result = mapCssPropsToVars({
      primaryColor: '#ffcc00',
      backgroundColor: undefined,
      textColor: undefined,
    });

    expect(result).toEqual({
      '--video-player-primary': '#ffcc00',
    });
  });

  it('should not map props with explicit undefined values', () => {
    const result = mapCssPropsToVars({
      primaryColor: undefined,
      backgroundColor: undefined,
      textColor: undefined,
      borderRadius: undefined,
    });

    expect(result).toEqual({});
  });
});
