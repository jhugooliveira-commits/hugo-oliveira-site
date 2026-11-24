const share = document.querySelector('.publication-share');
const native = share.querySelector('[data-share]');
const copy = share.querySelector('[data-copy-link]');
const status = share.querySelector('[data-share-status]');
const field = share.querySelector('[data-share-url]');
const url = field.value;

share.hidden = false;
if (navigator.share) {
  native.hidden = false;
  native.addEventListener('click', async () => {
    status.textContent = '';
    try {
      await navigator.share({ title: document.querySelector('h1').textContent, url });
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = 'Use “Copiar link” para compartilhar.';
    }
  });
}

copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(url);
    field.hidden = true;
    status.textContent = 'Link copiado.';
  } catch {
    field.hidden = false;
    field.focus();
    field.select();
    status.textContent = 'Selecione e copie o link.';
  }
});
