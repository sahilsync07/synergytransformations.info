/* ════════════════════════════════════════════════════════════════════════════
   SYNERGY BETA — INTERACTIVE ENGINE
   Scroll reveals · Morph text · Particle system · Stat counters · Clipboard
   ════════════════════════════════════════════════════════════════════════════ */

import './beta-style.css';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Scroll Reveal (Intersection Observer) ──────────────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');
  let revealDelay = 0;

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger items that enter at the same time
        const el = entry.target;
        const delay = el.dataset.revealDelay || 0;
        setTimeout(() => el.classList.add('revealed'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    // Auto-stagger siblings in the same parent grid
    const parent = el.parentElement;
    const siblings = parent ? parent.querySelectorAll('[data-reveal]') : [];
    if (siblings.length > 1) {
      const idx = Array.from(siblings).indexOf(el);
      el.dataset.revealDelay = idx * 100;
    }
    revealObserver.observe(el);
  });

  // ── 2. Morph Text — Hero Accent Word Cycle ────────────────────────────
  const morphText = document.getElementById('morph-text');
  if (morphText) {
    const words = ['Transformed.', 'Disciplined.', 'Unstoppable.', 'Permanent.'];
    let wordIdx = 0;

    setInterval(() => {
      morphText.style.opacity = '0';
      morphText.style.transform = 'translateY(12px)';
      morphText.style.transition = 'all 0.4s ease';

      setTimeout(() => {
        wordIdx = (wordIdx + 1) % words.length;
        morphText.textContent = words[wordIdx];
        morphText.style.opacity = '1';
        morphText.style.transform = 'translateY(0)';
      }, 400);
    }, 3000);
  }

  // ── 3. Particle System around Morph Visual ────────────────────────────
  const particleContainer = document.getElementById('morph-particles');
  if (particleContainer) {
    const PARTICLE_COUNT = 18;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'morph-particle';

      // Random position around the circle
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const radius = 100 + Math.random() * 60;
      const x = 170 + Math.cos(angle) * radius;
      const y = 170 + Math.sin(angle) * radius;

      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.animationDelay = `${Math.random() * 3}s`;
      p.style.animationDuration = `${2 + Math.random() * 2}s`;
      p.style.width = `${3 + Math.random() * 4}px`;
      p.style.height = p.style.width;

      particleContainer.appendChild(p);
    }
  }

  // ── 4. Animated Stat Counters ─────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-item__num[data-count]');

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
          // Ease out cubic
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

  // ── 5. Smooth Scroll for Anchor Links ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 6. Nav Background on Scroll ───────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.style.background = 'rgba(12, 14, 26, 0.85)';
      } else {
        nav.style.background = 'rgba(12, 14, 26, 0.5)';
      }
    }, { passive: true });
  }

  // ── 7. Instagram DM — Clipboard Copy + Toast ──────────────────────────
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
        // Fallback
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
