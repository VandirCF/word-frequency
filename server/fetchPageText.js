import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { extractText } from './extractText.js';
import { isPrivateAddress } from './isPrivateAddress.js';

const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 5000;
const MAX_BYTES = 2 * 1024 * 1024;
const REDIRECT_STATUSES = [301, 302, 303, 307, 308];
const FORBIDDEN_MESSAGE = 'This address cannot be analyzed.';

export class PageError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'PageError';
    this.status = status;
  }
}

export function parsePageUrl(rawUrl) {
  if (!rawUrl) {
    throw new PageError(400, 'Please enter a URL.');
  }

  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new PageError(400, 'Invalid URL.');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new PageError(400, 'Only http and https URLs are allowed.');
  }

  if (url.username || url.password) {
    throw new PageError(400, 'URLs with credentials are not allowed.');
  }

  return url;
}

async function assertPublicHost(url) {
  const hostname = url.hostname.replace(/^\[|\]$/g, '');

  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    throw new PageError(403, FORBIDDEN_MESSAGE);
  }

  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) {
      throw new PageError(403, FORBIDDEN_MESSAGE);
    }

    return;
  }

  let addresses;

  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new PageError(502, 'Could not load the page.');
  }

  if (addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new PageError(403, FORBIDDEN_MESSAGE);
  }
}

function toPageError(error) {
  if (error instanceof PageError) {
    return error;
  }

  if (error.name === 'TimeoutError' || error.name === 'AbortError') {
    return new PageError(504, 'The page took too long to respond.');
  }

  return new PageError(502, 'Could not load the page.');
}

async function readBody(response) {
  if (!response.body) {
    return '';
  }

  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;

  while (size < MAX_BYTES) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    size += value.byteLength;
  }

  await reader.cancel();

  return Buffer.concat(chunks).subarray(0, MAX_BYTES).toString('utf8');
}

export async function fetchPageText(rawUrl) {
  let url = parsePageUrl(rawUrl);

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    await assertPublicHost(url);

    let response;

    try {
      response = await fetch(url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { Accept: 'text/html,text/plain' },
      });
    } catch (error) {
      throw toPageError(error);
    }

    if (REDIRECT_STATUSES.includes(response.status)) {
      await response.body?.cancel();

      const location = response.headers.get('location');

      if (!location) {
        throw new PageError(502, 'Could not load the page.');
      }

      url = parsePageUrl(new URL(location, url).href);
      continue;
    }

    if (!response.ok) {
      throw new PageError(502, `The page answered with status ${response.status}.`);
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      throw new PageError(422, 'The URL does not point to a text page.');
    }

    let html;

    try {
      html = await readBody(response);
    } catch (error) {
      throw toPageError(error);
    }

    const text = extractText(html);

    if (!text) {
      throw new PageError(422, 'The page has no readable text.');
    }

    return text;
  }

  throw new PageError(502, 'Too many redirects.');
}
