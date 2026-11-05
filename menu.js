// Бургер-меню для мобільної версії
(function () {
  const header = document.querySelector('.header');
  const burger = header && header.querySelector('.burger');
  if (!burger) return;

  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
  };

  burger.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  // Закрити після вибору пункту, по Esc або кліку поза меню
  header.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', (e) => { if (!header.contains(e.target)) setOpen(false); });
})();
