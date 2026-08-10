const BOOKING_URL = 'https://calendar.app.google/Kig3jaQkufHSZWHf6';
const nav = document.querySelector('[data-nav]');
const menuButton = document.querySelector('[data-menu]');

function closeMenu() {
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menu');
}

menuButton?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('[data-nav] a').forEach((link) => link.addEventListener('click', closeMenu));
document.querySelectorAll('[data-book]').forEach((button) => button.addEventListener('click', () => {
  window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
}));

document.querySelectorAll('.faq-q').forEach((button) => {
  button.addEventListener('click', () => {
    const answerId = button.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : null;
    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(willOpen));
    button.closest('.faq-item')?.classList.toggle('open', willOpen);
    if (answer) answer.hidden = !willOpen;
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.matchMedia('(min-width: 821px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
