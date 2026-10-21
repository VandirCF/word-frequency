import { describe, expect, it } from 'vitest';
import { removeStopwords } from '../src/stopwords.js';

describe('removeStopwords', () => {
  it('removes common English words', () => {
    const counts = new Map([
      ['the', 4],
      ['cat', 2],
      ['and', 1],
    ]);

    expect(removeStopwords(counts)).toEqual(new Map([['cat', 2]]));
  });

  it('keeps every word when none is a stopword', () => {
    const counts = new Map([['cat', 2]]);

    expect(removeStopwords(counts)).toEqual(new Map([['cat', 2]]));
  });

  it('does not change the original map', () => {
    const counts = new Map([['the', 1]]);

    removeStopwords(counts);

    expect(counts.size).toBe(1);
  });
});
