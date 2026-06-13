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

  // 2. Viewport Glow Effect & Custom Scrollbar
  const glowOverlay = document.getElementById('viewport-glow');
  const customScrollbar = document.getElementById('custom-scrollbar');
  
  if (glowOverlay || customScrollbar) {
    let scrollTimeout;
    lenis.on('scroll', (e) => {
      const velocity = Math.abs(e.velocity || 0);
      
      // Glow
      if (glowOverlay) {
        const intensity = Math.min(0.2 + (velocity * 0.025), 0.5);
        glowOverlay.style.opacity = intensity.toString();
      }
      
      // Custom Scrollbar
      if (customScrollbar) {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        
        const scrollPercentage = scrollY / (documentHeight - windowHeight);
        const scrollbarHeight = Math.max(windowHeight * (windowHeight / documentHeight), 40);
        const scrollbarY = scrollPercentage * (windowHeight - scrollbarHeight);
        
        customScrollbar.style.height = `${scrollbarHeight}px`;
        customScrollbar.style.transform = `translateY(${scrollbarY}px)`;
        customScrollbar.style.opacity = '1';
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (glowOverlay) glowOverlay.style.opacity = '0';
        if (customScrollbar) customScrollbar.style.opacity = '0';
      }, 800);
    });
  }

  // 3. Animations
  initAnimations();

  // 4. Navigation
  initNavigation(lenis);

  // 4.5. Hero Snap Scrolling
  let isSnapping = false;
  
  function handleSnapScroll(deltaY, e) {
    if (isSnapping) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }

    const targetSec = document.getElementById('sec-about');
    if (!targetSec) return;
    
    const targetTop = targetSec.offsetTop;
    
    // Snap from Hero down to About
    if (window.scrollY < 50 && deltaY > 0) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      isSnapping = true;
      lenis.scrollTo('#sec-about', { duration: 1.5 });
      setTimeout(() => { isSnapping = false; }, 1500);
    } 
    // Snap from About up to Hero
    else if (window.scrollY > 50 && window.scrollY <= targetTop + 50 && deltaY < 0) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      isSnapping = true;
      lenis.scrollTo('#sec-hero', { duration: 1.5 });
      setTimeout(() => { isSnapping = false; }, 1500);
    }
  }

  window.addEventListener('wheel', (e) => {
    handleSnapScroll(e.deltaY, e);
  }, { passive: false, capture: true });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    const touchEndY = e.changedTouches[0].screenY;
    const deltaY = touchStartY - touchEndY;
    // Only intercept if it's a significant swipe
    if (Math.abs(deltaY) > 30) {
      handleSnapScroll(deltaY, e);
    }
  }, { passive: false, capture: true });

  // 5. Typewriter Effect
  const typewriterText = document.getElementById('typewriter-text');
  const typewriterSubContainer = document.getElementById('typewriter-sub-container');
  const typewriterSubText = document.getElementById('typewriter-sub-text');
  const typewriterSubCursor = document.getElementById('typewriter-sub-cursor');
  
  if (typewriterText && typewriterSubContainer && typewriterSubText && typewriterSubCursor) {
    const sequence = [
      { text: 'not Motivation.', color: '#ff4444' },
      { text: 'a Structure.', color: '#44ff44' },
      { text: 'Discipline.', color: '#44ff44' },
      { text: 'a follow through.', color: '#44ff44' }
    ];
    const subTextStr = "Synergy is not a program you finish; it is the framework for your lifelong evolution. Every pillar of your life body, mind, energy, and purpose becomes our shared mission.";
    
    let seqIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let subCharIdx = 0;

    // 6. Begin Transformation Button Logic
    const btnBegin = document.getElementById('btn-begin');
    if (btnBegin) {
      btnBegin.style.transition = 'opacity 2s ease';
      
      btnBegin.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo('#sec-about');
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

    function typeSub() {
      if (subCharIdx < subTextStr.length) {
        typewriterSubText.textContent += subTextStr.charAt(subCharIdx);
        subCharIdx++;
        setTimeout(typeSub, 30);
      } else {
        // Subtitle finished typing, reveal button and scroll indicator
        if (typewriterSubCursor) {
          typewriterSubCursor.style.display = 'none';
        }
        if (btnBegin) {
          btnBegin.style.pointerEvents = 'auto';
          btnBegin.style.opacity = '1';
        }

      }
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
      
      if (!isDeleting && charIdx === currentWord.length) {
        // End of word reached
        typeSpeed = 1500; // Pause at the end of word before deleting
        isDeleting = true;

        // Trigger subtitle once when the first word finishes
        if (seqIdx === 0 && !window.subtitleTriggered) {
          window.subtitleTriggered = true;
          setTimeout(() => {
            typewriterSubContainer.style.opacity = '1';
            typewriterSubCursor.style.opacity = '1';
            setTimeout(typeSub, 300);
          }, 500);
        }
      } else if (isDeleting && charIdx === 0) {
        // Finished deleting, move to next word
        isDeleting = false;
        seqIdx++;
        if (seqIdx >= sequence.length) {
          seqIdx = 0; // Loop back to the beginning
        }
        typeSpeed = 400; // Pause before typing next word
      }
      
      setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000); // Initial delay
  }
});
