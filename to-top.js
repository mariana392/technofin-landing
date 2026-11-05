// Кнопка «Вгору»: з'являється, коли користувач прокрутив сторінку до середини
(function () {
  const btn = document.createElement('button');
  btn.className = 'to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Повернутися вгору');
  btn.innerHTML = '<img src="assets/arrow-down.svg" alt="">';
  document.body.appendChild(btn);

  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    btn.classList.toggle('is-visible', maxScroll > 0 && window.scrollY >= maxScroll / 2);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  btn.addEventListener('click', () => window.scrollTo({ top: 0 }));
})();
