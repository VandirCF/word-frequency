const STOPWORDS = new Set([
  'a', 'about', 'am', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by',
  'did', 'do', 'does', 'for', 'from', 'had', 'has', 'have', 'he', 'her', 'his',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me', 'my', 'no', 'not', 'of', 'on',
  'or', 'our', 'out', 'over', 'she', 'so', 'than', 'that', 'the', 'their', 'them',
  'then', 'there', 'these', 'they', 'this', 'those', 'to', 'up', 'us', 'was', 'we',
  'were', 'what', 'when', 'which', 'who', 'will', 'with', 'you', 'your',
]);

export function removeStopwords(counts) {
  return new Map([...counts].filter(([word]) => !STOPWORDS.has(word)));
}
