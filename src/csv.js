export function toCsv(rows) {
  const lines = ['word,count', ...rows.map(({ word, count }) => `${word},${count}`)];

  return `${lines.join('\n')}\n`;
}
