/* Native sharing keeps AirDrop / Messages choices in the user's own share sheet. */
(() => {
  'use strict';
  const button = document.getElementById('share');
  const dialog = document.getElementById('share-dialog');
  const field = document.getElementById('share-url');
  const status = document.getElementById('share-status');
  function urlToShare() {
    const url = new URL('./', location.href);
    const name = new URL(location.href).searchParams.get('for');
    if (name) url.searchParams.set('for', name.slice(0, 60));
    return url.href;
  }
  function fallback() {
    field.value = urlToShare();
    status.textContent = '';
    dialog.showModal();
  }
  button.addEventListener('click', async () => {
    if (typeof navigator.share !== 'function') { fallback(); return; }
    button.disabled = true;
    try {
      await navigator.share({ title: 'JUICE Play — Clock', url: urlToShare() });
    } catch (error) {
      if (error.name !== 'AbortError') fallback();
    } finally { button.disabled = false; }
  });
  document.getElementById('copy-link').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(field.value);
      status.textContent = 'Link copied. Paste it into Messages.';
    } catch {
      field.focus(); field.select();
      status.textContent = 'Press and hold the selected link, then choose Copy.';
    }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
