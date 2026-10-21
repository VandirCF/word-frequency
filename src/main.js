import './styles/main.css';
import { countWords, isBlank, sortByFrequency, summarize, truncateText } from './wordFrequency.js';
import { removeStopwords } from './stopwords.js';
import { toCsv } from './csv.js';
import { fetchPageText } from './fetchPage.js';
import { renderMessage, renderTable } from './ui/table.js';
import { clearError, showError } from './ui/errors.js';
import { updateCounter } from './ui/counter.js';
import { clearChart, renderChart } from './ui/chart.js';
import { downloadCsv } from './ui/download.js';

const form = document.querySelector('#word-form');
const textInput = document.querySelector('#text-input');
const charCounter = document.querySelector('#char-counter');
const errorMessage = document.querySelector('#error-message');
const ignoreStopwords = document.querySelector('#ignore-stopwords');
const clearButton = document.querySelector('#clear-button');
const exportButton = document.querySelector('#export-button');
const summary = document.querySelector('#summary');
const frequencyBody = document.querySelector('#frequency-body');
const chartSection = document.querySelector('#chart-section');
const chartCanvas = document.querySelector('#frequency-chart');
const urlForm = document.querySelector('#url-form');
const urlInput = document.querySelector('#url-input');
const urlButton = document.querySelector('#url-button');
const urlError = document.querySelector('#url-error');
const urlNotice = document.querySelector('#url-notice');

let currentRows = [];
let urlController = null;

function showEmptyResults(message) {
  currentRows = [];
  renderMessage(frequencyBody, message);
  clearChart();
  chartSection.hidden = true;
  summary.hidden = true;
  exportButton.disabled = true;
}

updateCounter(charCounter, textInput.value.length, textInput.maxLength);

textInput.addEventListener('input', () => {
  updateCounter(charCounter, textInput.value.length, textInput.maxLength);
  clearError(errorMessage);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (isBlank(textInput.value)) {
    showError(errorMessage, 'Please enter some text to analyze.');
    showEmptyResults('No analysis yet.');
    return;
  }

  let counts = countWords(textInput.value);

  if (ignoreStopwords.checked) {
    counts = removeStopwords(counts);
  }

  const rows = sortByFrequency(counts);

  if (rows.length === 0) {
    showEmptyResults('No words found.');
    return;
  }

  currentRows = rows;
  renderTable(frequencyBody, rows);
  renderChart(chartCanvas, rows);

  const { total, unique } = summarize(rows);

  summary.textContent = `Total words: ${total} · Unique words: ${unique}`;
  summary.hidden = false;
  chartSection.hidden = false;
  exportButton.disabled = false;
});

ignoreStopwords.addEventListener('change', () => {
  if (!isBlank(textInput.value)) {
    form.requestSubmit();
  }
});

clearButton.addEventListener('click', () => {
  textInput.value = '';
  updateCounter(charCounter, 0, textInput.maxLength);
  clearError(errorMessage);
  urlInput.value = '';
  clearError(urlError);
  urlNotice.hidden = true;
  urlController?.abort();
  showEmptyResults('No analysis yet.');
  textInput.focus();
});

exportButton.addEventListener('click', () => {
  if (currentRows.length > 0) {
    downloadCsv('word-frequency.csv', toCsv(currentRows));
  }
});

urlInput.addEventListener('input', () => {
  clearError(urlError);
});

urlForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = urlInput.value.trim();

  if (!url) {
    showError(urlError, 'Please enter a URL.');
    return;
  }

  urlController?.abort();

  const controller = new AbortController();

  urlController = controller;
  clearError(urlError);
  urlNotice.hidden = true;
  urlButton.disabled = true;
  urlButton.textContent = 'Loading...';

  try {
    const text = await fetchPageText(url, controller.signal);
    const limit = textInput.maxLength;

    textInput.value = truncateText(text, limit);
    updateCounter(charCounter, textInput.value.length, limit);
    clearError(errorMessage);

    if (text.length > limit) {
      urlNotice.textContent = `The page has more than ${limit} characters. Only the first ${limit} were analyzed.`;
      urlNotice.hidden = false;
    }

    form.requestSubmit();
  } catch (error) {
    if (error.name !== 'AbortError') {
      showError(urlError, error.message);
    }
  } finally {
    if (urlController === controller) {
      urlController = null;
      urlButton.disabled = false;
      urlButton.textContent = 'Analyze URL';
    }
  }
});
