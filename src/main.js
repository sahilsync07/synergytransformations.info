/* ════════════════════════════════════════════════════════════════════════════
   SYNERGY — Main Entry Point
   Lenis smooth scroll · GSAP ScrollTrigger · Reveal animations
   ════════════════════════════════════════════════════════════════════════════ */
import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initAnimations } from './modules/animations';
import { initNavigation } from './modules/navigation';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. Viewport Glow Effect
  const glowOverlay = document.getElementById('viewport-glow');
  if (glowOverlay) {
    let scrollTimeout;
    lenis.on('scroll', (e) => {
      const velocity = Math.abs(e.velocity || 0);
      const intensity = Math.min(0.2 + (velocity * 0.025), 0.5);
      glowOverlay.style.opacity = intensity.toString();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        glowOverlay.style.opacity = '0';
      }, 150);
    });
  }

  // 3. Animations
  initAnimations();

  // 4. Navigation
  initNavigation(lenis);

  // 5. Typewriter Effect
  const typewriterText = document.getElementById('typewriter-text');
  
  if (typewriterText) {
    const sequence = [
      { text: 'not motivation.', color: '#ff4444' },
      { text: 'structure,', color: '#44ff44' },
      { text: 'discipline,', color: '#44ff44' },
      { text: 'and follow-through. We tackle every issue or roadblock you may face during this change and provide instant solutions.', color: '#44ff44' }
    ];
    
    let seqIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    // 6. Begin Transformation Button Logic
    const btnBegin = document.getElementById('btn-begin');
    if (btnBegin) {
      btnBegin.style.transition = 'opacity 0.3s ease';
      
      btnBegin.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo('#sec-philosophy');
        btnBegin.style.opacity = '0';
        setTimeout(() => btnBegin.style.display = 'none', 300);
      });

      let hasScrolledHero = false;
      lenis.on('scroll', (e) => {
        if (!hasScrolledHero && window.scrollY > 50) {
          hasScrolledHero = true;
          btnBegin.style.opacity = '0';
          setTimeout(() => btnBegin.style.display = 'none', 300);
        }
      });
    }

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
      if (!isDeleting && seqIdx === sequence.length - 1) {
        // Type faster for the long sentence so it doesn't take forever
        typeSpeed = 40;
      }
      
      if (!isDeleting && charIdx === currentWord.length) {
        // End of word reached
        if (seqIdx === sequence.length - 1) {
          // Last word of the main text typed, stop and show button
          if (btnBegin) {
            btnBegin.style.pointerEvents = 'auto';
            btnBegin.style.opacity = '1';
          }
          return; // Stop the main loop here!
        }
        typeSpeed = 1000; // Pause at the end of word before deleting
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        // Finished deleting, move to next word
        isDeleting = false;
        seqIdx++;
        typeSpeed = 400; // Pause before typing next word
      }
      
      setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000); // Initial delay
  }
});
