export async function fetchPageText(url) {
  const response = await fetch(`/api/fetch-url?url=${encodeURIComponent(url)}`);
  let body;

  try {
    body = await response.json();
  } catch {
    throw new Error('Could not analyze the URL.');
  }

  if (!response.ok) {
    throw new Error(body.error ?? 'Could not analyze the URL.');
  }

  return body.text;
}
