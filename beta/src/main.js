/* ════════════════════════════════════════════════════════════════════════════
   THE SYNERGY PROGRAM — BETA INTERACTIVE ENGINE
   Lenis smooth scroll · Typewriter system · Reveal observers · Nav scroll
   ════════════════════════════════════════════════════════════════════════════ */

import './beta-style.css';
import Lenis from 'lenis';

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Scroll Progress Bar & Viewport Glow
  const progressBar = document.getElementById('progress-bar');
  const glowOverlay = document.getElementById('viewport-glow');
  const nav = document.getElementById('nav');

  if (progressBar || glowOverlay) {
    let scrollTimeout;

    lenis.on('scroll', () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const scrollPercentage = scrollY / (documentHeight - windowHeight);

      // Progress bar
      if (progressBar) {
        progressBar.style.width = `${scrollPercentage * 100}%`;
      }

      // Nav background on scroll
      if (nav) {
        if (scrollY > 50) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
      }

      // Glow effect
      if (glowOverlay) {
        const velocity = Math.abs(lenis.velocity || 0);
        const intensity = Math.min(0.1 + (velocity * 0.015), 0.35);
        glowOverlay.style.opacity = intensity.toString();

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          glowOverlay.style.opacity = '0';
        }, 800);
      }
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // 4. Typewriter Headline Loop
  const typewriterText = document.getElementById('typewriter-text');
  const heroSub = document.getElementById('hero-sub');

  if (typewriterText) {
    const sequence = [
      { text: 'not Motivation.', color: '#ff4444' },
      { text: 'a Structure.', color: '#44ff44' },
      { text: 'Discipline.', color: '#44ff44' },
      { text: 'a follow through.', color: '#44ff44' }
    ];

    let seqIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
      const currentObj = sequence[seqIdx];
      const currentWord = currentObj.text;

      typewriterText.style.color = currentObj.color;

      if (isDeleting) {
        charIdx--;
      } else {
        charIdx++;
      }

      typewriterText.textContent = currentWord.substring(0, charIdx);

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentWord.length) {
        typeSpeed = 1500;
        isDeleting = true;

        // Reveal subtitle after first word finishes
        if (seqIdx === 0 && heroSub && heroSub.style.opacity === '0') {
          setTimeout(() => {
            heroSub.style.opacity = '1';
          }, 500);
        }
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        seqIdx = (seqIdx + 1) % sequence.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
  }

  // 5. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement, { offset: -80 });
      }
    });
  });

  // 6. Instagram DM — Copy "TRANSFORM" to clipboard on click + toast
  // Inject toast styles
  const toastStyle = document.createElement('style');
  toastStyle.textContent = `
    .dm-toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #fff;
      color: #000;
      padding: 1rem 1.75rem;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }
    .dm-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .dm-toast__check {
      color: #22c55e;
      font-size: 18px;
    }
  `;
  document.head.appendChild(toastStyle);

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'dm-toast';
  toast.innerHTML = '<span class="dm-toast__check">✓</span> "TRANSFORM" copied — paste it in the DM!';
  document.body.appendChild(toast);

  let toastTimeout;
  function showToast() {
    clearTimeout(toastTimeout);
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Attach to all Instagram DM links
  document.querySelectorAll('a[href*="ig.me/m/"]').forEach(link => {
    link.addEventListener('click', () => {
      navigator.clipboard.writeText('TRANSFORM').then(() => {
        showToast();
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = 'TRANSFORM';
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast();
      });
    });
  });

});
