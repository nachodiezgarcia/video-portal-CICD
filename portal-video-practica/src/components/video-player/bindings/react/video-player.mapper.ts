import type { CSSProperties } from 'react';

export interface VideoPlayerCssProps {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
}

export const mapCssPropsToVars = (
  props: VideoPlayerCssProps,
): CSSProperties => {
  const vars: Record<string, string> = {};

  if (props.primaryColor !== undefined) {
    vars['--video-player-primary'] = props.primaryColor;
  }
  if (props.backgroundColor !== undefined) {
    vars['--video-player-background'] = props.backgroundColor;
  }
  if (props.textColor !== undefined) {
    vars['--video-player-text'] = props.textColor;
  }
  if (props.borderRadius !== undefined) {
    vars['--video-player-border-radius'] = props.borderRadius;
  }

  return vars as CSSProperties;
};
