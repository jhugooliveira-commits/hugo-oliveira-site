const BOOKING_URL='https://calendar.app.google/Kig3jaQkufHSZWHf6';
const nav=document.querySelector('[data-nav]');
document.querySelectorAll('[data-menu]').forEach(b=>b.addEventListener('click',()=>nav?.classList.toggle('open')));
document.querySelectorAll('[data-nav] a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>window.open(BOOKING_URL,'_blank','noopener,noreferrer')));
document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>q.parentElement.classList.toggle('open')));
