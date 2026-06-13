/* ════════════════════════════════════════════════════════════════════════════
   CHARLIE — INTERACTIVE ENGINE
   Scroll reveals · Stat counters · Clipboard copy · Nav scroll
   ════════════════════════════════════════════════════════════════════════════ */

import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Scroll Reveal ──────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.revealDelay || 0;
        setTimeout(() => el.classList.add('revealed'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Auto-stagger siblings
  revealEls.forEach(el => {
    const parent = el.parentElement;
    const siblings = parent ? Array.from(parent.children).filter(c => c.hasAttribute('data-reveal')) : [];
    if (siblings.length > 1) {
      el.dataset.revealDelay = siblings.indexOf(el) * 80;
    }
    revealObserver.observe(el);
  });

  // ── 2. Nav scroll effect ──────────────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 60
        ? 'rgba(6,6,6,0.9)'
        : 'rgba(6,6,6,0.6)';
    }, { passive: true });
  }

  // ── 3. Animated Stat Counters ─────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat__num[data-count]');

  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => countObserver.observe(el));

  // ── 4. Smooth Scroll ──────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── 5. Instagram DM — Clipboard + Toast ───────────────────────────────
  const toast = document.createElement('div');
  toast.className = 'dm-toast';
  toast.innerHTML = '✓ &nbsp;"TRANSFORM" copied — paste it in the DM!';
  document.body.appendChild(toast);

  let toastTimeout;
  function showToast() {
    clearTimeout(toastTimeout);
    toast.classList.add('show');
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  document.querySelectorAll('.ig-dm-link').forEach(link => {
    link.addEventListener('click', () => {
      navigator.clipboard.writeText('TRANSFORM').then(showToast).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = 'TRANSFORM';
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast();
      });
    });
  });

});
