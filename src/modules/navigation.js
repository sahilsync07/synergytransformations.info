/* ========================================================
   Navigation — Sticky nav, progress bar, section dots,
   mobile burger menu, scroll-to-section
   ======================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initNavigation(lenis) {
  const nav = document.getElementById('main-nav');
  const progressBar = document.getElementById('nav-progress');
  const dots = document.querySelectorAll('.section-dots__dot');
  const sections = document.querySelectorAll('.section');
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');

  // ---- Sticky Nav Background on Scroll ----
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate: (self) => {
      if (self.direction === 1 && self.scroll() > 80) {
        nav.classList.add('is-scrolled');
      } else if (self.scroll() <= 80) {
        nav.classList.remove('is-scrolled');
      }
    },
  });

  // ---- Global Progress Bar ----
  ScrollTrigger.create({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (progressBar) {
        progressBar.style.width = `${self.progress * 100}%`;
      }
    },
  });

  // ---- Section Dots — Active State ----
  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveDot(index),
      onEnterBack: () => setActiveDot(index),
    });
  });

  function setActiveDot(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
  }

  // ---- Dot Click → Scroll to Section ----
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index, 10);
      const targetSection = sections[index];
      if (targetSection && lenis) {
        lenis.scrollTo(targetSection, {
          offset: 0,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    });
  });

  // ---- Nav Link Click → Scroll to Section ----
  document.querySelectorAll('.nav__link[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target && lenis) {
        lenis.scrollTo(target, {
          offset: -80, // Account for nav height
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
      // Close mobile menu
      closeMobileMenu();
    });
  });

  // ---- Logo Click → Scroll to Top ----
  const logo = document.getElementById('nav-logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      }
    });
  }

  // ---- Mobile Burger Menu ----
  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
      // Prevent scroll when menu is open
      if (navLinks.classList.contains('is-open')) {
        lenis && lenis.stop();
      } else {
        lenis && lenis.start();
      }
    });
  }

  function closeMobileMenu() {
    if (burger && navLinks) {
      burger.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      lenis && lenis.start();
    }
  }

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}
