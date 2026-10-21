export function updateCounter(element, length, max) {
  const limitReached = length >= max;

  element.textContent = `${length} / ${max}${limitReached ? ' (limit reached)' : ''}`;
  element.classList.toggle('limit-reached', limitReached);
}
