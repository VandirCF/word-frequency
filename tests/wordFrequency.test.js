import { describe, expect, it } from 'vitest';
import {
  countWords,
  isBlank,
  normalize,
  sortByFrequency,
  summarize,
  truncateText,
} from '../src/wordFrequency.js';

describe('isBlank', () => {
  it('is true for an empty string', () => {
    expect(isBlank('')).toBe(true);
  });

  it('is true for whitespace only', () => {
    expect(isBlank(' \n\t ')).toBe(true);
  });

  it('is false when there is visible text', () => {
    expect(isBlank('  a ')).toBe(false);
  });

  it('is false for punctuation only, since that is still text', () => {
    expect(isBlank('!!!')).toBe(false);
  });
});

describe('normalize', () => {
  it('converts text to lowercase', () => {
    expect(normalize('The QUICK Fox')).toBe('the quick fox');
  });

  it('turns curly apostrophes into straight ones', () => {
    expect(normalize('don’t')).toBe("don't");
  });
});

describe('countWords', () => {
  it('returns an empty map for empty text', () => {
    expect(countWords('')).toEqual(new Map());
  });

  it('returns an empty map for whitespace only', () => {
    expect(countWords(' \n\t  ')).toEqual(new Map());
  });

  it('ignores punctuation', () => {
    expect(countWords('Hello, world! Hello.')).toEqual(
      new Map([
        ['hello', 2],
        ['world', 1],
      ]),
    );
  });

  it('ignores case', () => {
    expect(countWords('The the THE')).toEqual(new Map([['the', 3]]));
  });

  it('keeps accented letters inside words', () => {
    expect(countWords('Ação, ação e você')).toEqual(
      new Map([
        ['ação', 2],
        ['e', 1],
        ['você', 1],
      ]),
    );
  });

  it('keeps apostrophes inside words', () => {
    expect(countWords("don't don’t")).toEqual(new Map([["don't", 2]]));
  });

  it('keeps hyphens inside words', () => {
    expect(countWords('guarda-chuva')).toEqual(new Map([['guarda-chuva', 1]]));
  });

  it('does not keep leading or trailing apostrophes and hyphens', () => {
    expect(countWords("'quoted' -dash- end-")).toEqual(
      new Map([
        ['quoted', 1],
        ['dash', 1],
        ['end', 1],
      ]),
    );
  });

  it('counts standalone numbers as words', () => {
    expect(countWords('2024 2024 abc')).toEqual(
      new Map([
        ['2024', 2],
        ['abc', 1],
      ]),
    );
  });
});

describe('sortByFrequency', () => {
  it('returns an empty array for an empty map', () => {
    expect(sortByFrequency(new Map())).toEqual([]);
  });

  it('sorts by count in descending order', () => {
    const counts = new Map([
      ['cat', 1],
      ['dog', 3],
      ['bird', 2],
    ]);

    expect(sortByFrequency(counts)).toEqual([
      { word: 'dog', count: 3 },
      { word: 'bird', count: 2 },
      { word: 'cat', count: 1 },
    ]);
  });

  it('sorts words with the same count alphabetically', () => {
    const counts = new Map([
      ['zebra', 2],
      ['apple', 2],
      ['mango', 2],
    ]);

    expect(sortByFrequency(counts).map((entry) => entry.word)).toEqual([
      'apple',
      'mango',
      'zebra',
    ]);
  });

  it('works with the output of countWords', () => {
    const result = sortByFrequency(countWords('b a b c b a'));

    expect(result).toEqual([
      { word: 'b', count: 3 },
      { word: 'a', count: 2 },
      { word: 'c', count: 1 },
    ]);
  });
});

describe('summarize', () => {
  it('returns zeros for no rows', () => {
    expect(summarize([])).toEqual({ total: 0, unique: 0 });
  });

  it('sums all counts as total and counts rows as unique', () => {
    const rows = [
      { word: 'b', count: 3 },
      { word: 'a', count: 2 },
      { word: 'c', count: 1 },
    ];

    expect(summarize(rows)).toEqual({ total: 6, unique: 3 });
  });
});

describe('truncateText', () => {
  it('returns the text unchanged when it fits the limit', () => {
    expect(truncateText('abc', 3)).toBe('abc');
  });

  it('cuts plain text at the limit', () => {
    expect(truncateText('abcdef', 4)).toBe('abcd');
  });

  it('does not split a surrogate pair', () => {
    // '😀' takes 2 UTF-16 units, so a limit of 3 keeps only one emoji and the 'a'.
    expect(truncateText('😀😀a', 3)).toBe('😀');
  });

  it('keeps a surrogate pair that ends exactly at the limit', () => {
    expect(truncateText('a😀b', 3)).toBe('a😀');
  });

  it('returns an empty string for a zero limit', () => {
    expect(truncateText('abc', 0)).toBe('');
  });
});
