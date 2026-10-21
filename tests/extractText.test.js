import { describe, expect, it } from 'vitest';
import { extractText } from '../server/extractText.js';

describe('extractText', () => {
  it('returns the visible text of a page', () => {
    expect(extractText('<html><body><p>Hello <b>world</b></p></body></html>')).toBe(
      'Hello world',
    );
  });

  it('removes scripts, styles and comments', () => {
    const html = `
      <style>p { color: red }</style>
      <script>var secret = 'nope';</script>
      <!-- hidden comment -->
      <p>Visible</p>
    `;

    expect(extractText(html)).toBe('Visible');
  });

  it('decodes named and numeric entities', () => {
    expect(extractText('<p>Tom &amp; Jerry &#39;s &#x41;&nbsp;&lt;3</p>')).toBe(
      "Tom & Jerry 's A <3",
    );
  });

  it('does not turn escaped tags into markup', () => {
    expect(extractText('<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>')).toBe(
      '<script>alert(1)</script>',
    );
  });

  it('returns an empty string when there is no text', () => {
    expect(extractText('<html><body>   </body></html>')).toBe('');
  });
});
