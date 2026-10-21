export function renderTable(tbody, rows) {
  const cells = rows.map(({ word, count }) => {
    const row = document.createElement('tr');
    const wordCell = document.createElement('td');
    const countCell = document.createElement('td');

    wordCell.textContent = word;
    countCell.textContent = count;
    countCell.classList.add('numeric');
    row.append(wordCell, countCell);

    return row;
  });

  tbody.replaceChildren(...cells);
}

export function renderMessage(tbody, message) {
  const row = document.createElement('tr');
  const cell = document.createElement('td');

  cell.colSpan = 2;
  cell.textContent = message;
  row.append(cell);

  tbody.replaceChildren(row);
}
