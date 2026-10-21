import { fetchPageText, PageError } from '../server/fetchPageText.js';

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const rawUrl = new URL(req.url, 'http://localhost').searchParams.get('url');

  try {
    const text = await fetchPageText(rawUrl);

    sendJson(res, 200, { text });
  } catch (error) {
    if (error instanceof PageError) {
      sendJson(res, error.status, { error: error.message });
      return;
    }

    console.error(error);
    sendJson(res, 500, { error: 'Unexpected error.' });
  }
}
