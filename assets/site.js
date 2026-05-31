/* =====================================================================
   VALCRENO — Site JS
   Header glass condense, scroll reveals, hero video safe-loop
   (Rolex frame at the tail of 147.mp4 is trimmed by looping early).
   ===================================================================== */

(function () {
  /* ----- Header condense on scroll & dark mode when over hero video ----- */
  const header = document.querySelector('.site-header');
  const heroNode = document.querySelector('[data-hero-dark]');
  function onScroll() {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle('is-condensed', y > 80);
    if (heroNode) {
      const h = heroNode.offsetHeight - 80;
      header.classList.toggle('is-dark', y < h);
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Hero video safe-loop (trim Rolex tail) ----- */
  // Loop the video back to start a configurable amount before the natural end
  // so the Rolex frame never appears. Default trim = 1.4s from the end.
  document.querySelectorAll('video[data-safe-loop]').forEach((v) => {
    const trim = parseFloat(v.dataset.safeLoop) || 1.4;
    v.addEventListener('timeupdate', () => {
      if (v.duration && v.duration - v.currentTime <= trim) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    });
    // some browsers fire 'ended' before timeupdate threshold; restart anyway
    v.addEventListener('ended', () => { v.currentTime = 0; v.play().catch(() => {}); });
  });

  /* ----- Reveal-on-scroll ----- */
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll('.reveal').forEach((el) => { if (io) io.observe(el); else el.classList.add('is-in'); });

  /* ----- Newsletter forms ----- */
  document.querySelectorAll('form[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input || !input.value) return;
      btn && (btn.textContent = 'Merci ✓');
      input.value = '';
      setTimeout(() => { btn && (btn.textContent = btn.dataset.label || "S'inscrire"); }, 2400);
    });
  });
})();
