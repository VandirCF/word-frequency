import { describe, expect, it } from 'vitest';
import { toCsv } from '../src/csv.js';

describe('toCsv', () => {
  it('writes only the header for no rows', () => {
    expect(toCsv([])).toBe('word,count\n');
  });

  it('writes one line per row after the header', () => {
    const rows = [
      { word: 'dog', count: 3 },
      { word: 'cat', count: 1 },
    ];

    expect(toCsv(rows)).toBe('word,count\ndog,3\ncat,1\n');
  });
});
