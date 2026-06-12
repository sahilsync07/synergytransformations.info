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
  const typewriterSub = document.getElementById('typewriter-sub');
  if (typewriterText && typewriterSub) {
    const sequence = [
      { text: 'not motivation.', color: '#ff4444' },
      { text: 'a structure.', color: '#44ff44' },
      { text: 'discipline.', color: '#44ff44' },
      { text: 'follow-through.', color: '#44ff44' }
    ];
    let seqIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let isFinished = false;

    function type() {
      if (isFinished) return;
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
        if (seqIdx === sequence.length - 1) {
          isFinished = true;
          setTimeout(() => {
            typewriterSub.style.opacity = '1';
          }, 500);
          return;
        }
        typeSpeed = 1500; // Pause at the end of word before deleting
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        seqIdx++;
        typeSpeed = 400; // Pause before typing next word
      }
      
      setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000); // Initial delay
  }
});
