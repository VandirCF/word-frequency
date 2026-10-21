import { BarController, BarElement, Chart, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const CHART_WORD_LIMIT = 15;

let chart = null;

export function renderChart(canvas, rows) {
  const topRows = rows.slice(0, CHART_WORD_LIMIT);

  chart?.destroy();
  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: topRows.map(({ word }) => word),
      datasets: [
        {
          label: 'Occurrences',
          data: topRows.map(({ count }) => count),
          backgroundColor: '#2357d6',
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    },
  });
}

export function clearChart() {
  chart?.destroy();
  chart = null;
}
