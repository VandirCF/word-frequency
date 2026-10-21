import { describe, expect, it } from 'vitest';
import { fetchPageText, parsePageUrl, PageError } from '../server/fetchPageText.js';

describe('parsePageUrl', () => {
  it('accepts http and https URLs', () => {
    expect(parsePageUrl('https://example.com/page').hostname).toBe('example.com');
    expect(parsePageUrl('http://example.com').protocol).toBe('http:');
  });

  it.each([
    [undefined, 'Please enter a URL.'],
    ['', 'Please enter a URL.'],
    ['not a url', 'Invalid URL.'],
    ['ftp://example.com/file', 'Only http and https URLs are allowed.'],
    ['file:///etc/passwd', 'Only http and https URLs are allowed.'],
    ['https://user:pass@example.com', 'URLs with credentials are not allowed.'],
  ])('rejects %s', (rawUrl, message) => {
    expect(() => parsePageUrl(rawUrl)).toThrow(PageError);
    expect(() => parsePageUrl(rawUrl)).toThrow(message);
  });
});

describe('fetchPageText', () => {
  it.each(['http://localhost:3000', 'http://127.0.0.1/admin', 'http://169.254.169.254/latest/meta-data'])(
    'blocks internal address %s before making any request',
    async (rawUrl) => {
      await expect(fetchPageText(rawUrl)).rejects.toMatchObject({ status: 403 });
    },
  );
});
