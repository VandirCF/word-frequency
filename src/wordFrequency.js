const WORD_PATTERN = /[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu;

export function normalize(text) {
  return text.toLocaleLowerCase().replaceAll('’', "'");
}

export function isBlank(text) {
  return text.trim() === '';
}

export function countWords(text) {
  const counts = new Map();

  for (const word of normalize(text).match(WORD_PATTERN) ?? []) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return counts;
}

export function sortByFrequency(counts) {
  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}

export function summarize(rows) {
  const total = rows.reduce((sum, { count }) => sum + count, 0);

  return { total, unique: rows.length };
}

// Cuts text to at most `limit` UTF-16 units (the unit used by maxlength and
// .length) without splitting a character made of two units, such as an emoji.
export function truncateText(text, limit) {
  let result = '';

  for (const char of text) {
    if (result.length + char.length > limit) {
      break;
    }

    result += char;
  }

  return result;
}
