import { describe, it, expect } from 'vitest';
import { sumTotalTime } from './time.utils';

describe('sumTotalTime', () => {
  it('returns 0:00 for an empty array', () => {
    expect(sumTotalTime([])).toBe('0:00');
  });

  it('returns the same value for a single MM:SS entry', () => {
    expect(sumTotalTime(['1:30'])).toBe('1:30');
  });

  it('sums multiple MM:SS entries without overflow to hours', () => {
    expect(sumTotalTime(['1:30', '0:45'])).toBe('2:15');
  });

  it('overflows to HH:MM:SS when total exceeds 59 minutes', () => {
    expect(sumTotalTime(['45:00', '30:00'])).toBe('1:15:00');
  });

  it('mixes MM:SS and HH:MM:SS formats correctly', () => {
    expect(sumTotalTime(['1:30', '1:00:00'])).toBe('1:01:30');
  });

  it('sums multiple HH:MM:SS entries', () => {
    expect(sumTotalTime(['1:30:00', '0:45:30'])).toBe('2:15:30');
  });

  it('returns 0:00 for a malformed single-part string (documents current contract)', () => {
    expect(sumTotalTime(['90'])).toBe('0:00');
  });
});
