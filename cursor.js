// Кастомний курсор: крапка + кільце з затримкою + бейдж для [data-cursor-label].
// Вмикається лише на пристроях з мишею; на тачскрінах лишається системна поведінка.
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  const make = (cls, inner) => {
    const el = document.createElement('div');
    el.className = cls; el.setAttribute('aria-hidden', 'true'); el.innerHTML = inner;
    document.body.appendChild(el); return el;
  };
  const dot = make('cursor', '<span class="cursor__dot"></span>');
  const ring = make('cursor-ring', '<span class="cursor-ring__in"></span>');
  const badge = make('cursor-badge', '<span class="cursor-badge__in"><span class="label"></span><span class="icon"></span></span>');
  const label = badge.querySelector('.label');
  const icon = badge.querySelector('.icon');
  root.classList.add('has-cursor');

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...mouse }, badgePos = { ...mouse };
  let seen = false;

  addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (!seen) { ringPos.x = badgePos.x = mouse.x; ringPos.y = badgePos.y = mouse.y; seen = true; }
    root.classList.add('is-visible');
  }, { passive: true });
  document.addEventListener('mouseleave', () => root.classList.remove('is-visible'));
  addEventListener('blur', () => root.classList.remove('is-visible', 'state-press'));
  addEventListener('mousedown', () => root.classList.add('state-press'));
  addEventListener('mouseup', () => root.classList.remove('state-press'));

  // Що під курсором
  document.addEventListener('mouseover', (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const text = t.closest('input, textarea, select, [contenteditable="true"]');
    const badgeEl = text ? null : t.closest('[data-cursor-label]');
    const link = text ? null : t.closest('a, button, [role="button"], label, summary');
    root.classList.toggle('state-text', !!text);
    root.classList.toggle('state-badge', !!badgeEl);
    root.classList.toggle('state-hover', !!link && !badgeEl);
    if (badgeEl) {
      label.textContent = badgeEl.dataset.cursorLabel;
      icon.textContent = badgeEl.dataset.cursorIcon || '';
    }
  });

  // Плавне доганяння: lerp у requestAnimationFrame
  const lerp = (a, b, n) => a + (b - a) * n;
  (function tick() {
    const kRing = reduce ? 1 : 0.18, kBadge = reduce ? 1 : 0.25;
    ringPos.x = lerp(ringPos.x, mouse.x, kRing); ringPos.y = lerp(ringPos.y, mouse.y, kRing);
    badgePos.x = lerp(badgePos.x, mouse.x, kBadge); badgePos.y = lerp(badgePos.y, mouse.y, kBadge);
    dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    badge.style.transform = `translate3d(${badgePos.x}px, ${badgePos.y}px, 0)`;
    requestAnimationFrame(tick);
  })();
})();
