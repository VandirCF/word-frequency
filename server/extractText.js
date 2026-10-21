const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntity(match, entity) {
  if (entity[0] === '#') {
    const isHex = entity[1].toLowerCase() === 'x';
    const codePoint = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);

    return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
  }

  return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
}

export function extractText(html) {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template|svg|head)\b[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, decodeEntity);

  return text.replace(/\s+/g, ' ').trim();
}
