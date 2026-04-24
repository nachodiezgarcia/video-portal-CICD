import { describe, it, expect } from 'vitest';
import { formatTime } from './video-player.helpers';

describe('formatTime', () => {
  it('returns 00:00 for falsy or non-finite inputs', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(NaN)).toBe('00:00');
    expect(formatTime(Infinity)).toBe('00:00');
    expect(formatTime(-Infinity)).toBe('00:00');
  });

  it('formats seconds under one minute as MM:SS', () => {
    expect(formatTime(5)).toBe('00:05');
  });

  it('formats seconds over one minute as MM:SS', () => {
    expect(formatTime(65)).toBe('01:05');
  });

  it('stays in MM:SS format just below one hour', () => {
    expect(formatTime(3599)).toBe('59:59');
  });

  it('switches to HH:MM:SS at exactly one hour', () => {
    expect(formatTime(3600)).toBe('01:00:00');
  });

  it('formats hours + minutes + seconds correctly', () => {
    expect(formatTime(3665)).toBe('01:01:05');
  });

  it('handles double-digit hours', () => {
    expect(formatTime(36000)).toBe('10:00:00');
  });

  it('truncates decimals with Math.floor', () => {
    expect(formatTime(65.9)).toBe('01:05');
  });
});
