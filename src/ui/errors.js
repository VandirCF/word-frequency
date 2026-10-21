export function showError(element, message) {
  element.textContent = message;
  element.hidden = false;
}

export function clearError(element) {
  element.textContent = '';
  element.hidden = true;
}
