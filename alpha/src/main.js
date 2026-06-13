/* ════════════════════════════════════════════════════════════════════════════
   THE SYNERGY PROGRAM — ALPHA INTERACTIVE ENGINE
   Lenis smooth scroll · Typewriter system · Reveal observers · Contact modal
   ════════════════════════════════════════════════════════════════════════════ */

import './style.css';
import Lenis from 'lenis';

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  // RAF loop for Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Scroll Progress Bar & Ambient Glow Controller
  const progressBar = document.getElementById('progress-bar');
  const glowOverlay = document.getElementById('glow-overlay');
  
  if (progressBar || glowOverlay) {
    let scrollTimeout;
    
    lenis.on('scroll', (e) => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const scrollPercentage = scrollY / (documentHeight - windowHeight);
      
      // Update reading progress bar
      if (progressBar) {
        progressBar.style.width = `${scrollPercentage * 100}%`;
      }
      
      // Trigger subtle ambient light glow
      if (glowOverlay) {
        const velocity = Math.abs(e.velocity || 0);
        const intensity = Math.min(0.1 + (velocity * 0.015), 0.35);
        glowOverlay.style.opacity = intensity.toString();
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          glowOverlay.style.opacity = '0';
        }, 800);
      }
    });
  }

  // 3. Modular Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Typewriter Headline Loop
  const typewriterText = document.getElementById('typewriter-text');
  
  if (typewriterText) {
    const sequence = [
      { text: 'not motivation.', color: '#ff4d4d' },
      { text: 'structure.', color: '#ffffff' },
      { text: 'discipline.', color: '#ffffff' },
      { text: 'follow through.', color: '#ffffff' }
    ];
    
    let sequenceIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
      const current = sequence[sequenceIndex];
      typewriterText.style.color = current.color;
      
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }
      
      typewriterText.textContent = current.text.substring(0, charIndex);
      
      let speed = isDeleting ? 30 : 60;
      
      if (!isDeleting && charIndex === current.text.length) {
        // Pause when word is completely typed
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Reset when word is completely deleted, proceed to next word
        isDeleting = false;
        sequenceIndex = (sequenceIndex + 1) % sequence.length;
        speed = 400; // Brief pause before typing next word
      }
      
      setTimeout(type, speed);
    }
    
    // Begin typing sequence after 800ms
    setTimeout(type, 800);
  }

  // 5. Contact / Booking Slide-up Modal Controls
  const contactModal = document.getElementById('contact-modal');
  const openModalTriggers = document.querySelectorAll('.open-modal-trigger');
  const closeModalBtn = document.getElementById('close-modal-btn');
  
  if (contactModal) {
    const openModal = (e) => {
      e.preventDefault();
      contactModal.classList.add('active');
      contactModal.setAttribute('aria-hidden', 'false');
      lenis.stop(); // Stop page scrolling when modal is open
    };
    
    const closeModal = () => {
      contactModal.classList.remove('active');
      contactModal.setAttribute('aria-hidden', 'true');
      lenis.start(); // Resume page scrolling
    };
    
    openModalTriggers.forEach(trigger => {
      trigger.addEventListener('click', openModal);
    });
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close on clicking overlay backdrop (outside the main modal card)
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeModal();
      }
    });
    
    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Smooth scroll to anchors (excluding modal links)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#apply' || this.classList.contains('open-modal-trigger')) {
        return;
      }
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement);
      }
    });
  });

});
