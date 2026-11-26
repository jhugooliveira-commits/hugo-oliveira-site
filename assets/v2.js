const BOOKING_URL = 'https://calendar.app.google/Kig3jaQkufHSZWHf6';
const nav = document.querySelector('[data-nav]');
const menuButton = document.querySelector('[data-menu]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
  const answer = document.getElementById(button.getAttribute('aria-controls'));
  if (!answer) return;

  let animation;
  button.addEventListener('click', () => {
    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    const fromHeight = answer.hidden ? 0 : answer.getBoundingClientRect().height;
    const fromOpacity = answer.hidden ? 0 : getComputedStyle(answer).opacity;
    animation?.cancel();
    button.setAttribute('aria-expanded', String(willOpen));
    button.closest('.faq-item')?.classList.toggle('open', willOpen);
    answer.inert = !willOpen;

    function settle() {
      answer.hidden = !willOpen;
      answer.classList.remove('faq-animating');
      animation = undefined;
    }

    if (reducedMotion.matches || !answer.animate) {
      settle();
      return;
    }

    answer.hidden = false;
    const toHeight = willOpen ? answer.getBoundingClientRect().height : 0;
    answer.classList.add('faq-animating');
    animation = answer.animate([
      { height: fromHeight + 'px', opacity: fromOpacity },
      { height: toHeight + 'px', opacity: willOpen ? 1 : 0 },
    ], { duration: 260, easing: 'ease-out' });
    animation.onfinish = settle;
  });

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) animation?.finish();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.matchMedia('(min-width: 821px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const targets = [
    ['.info .about-photo', 'from-left'],
    ['.info .about-copy', 'from-right'],
    ['.areas .section-title, .why .section-title, .faq .section-title'],
    ['.area-topic, .why-inner > p, .faq-grid, .home-publications .publication-main, .final-cta-inner'],
  ];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!reducedMotion.matches) entry.target.classList.add('section-entered');
    }
  }, { threshold: 0.12 });

  for (const [selector, direction] of targets) {
    for (const target of document.querySelectorAll(selector)) {
      if (direction) target.classList.add(direction);
      observer.observe(target);
    }
  }
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) observer.disconnect();
  }, { once: true });
}
