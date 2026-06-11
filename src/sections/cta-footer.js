/* ==========================================================================
   SECTION: CTA & FOOTER ANIMATIONS DOCUMENTATION (GSAP ScrollTrigger)
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes entrance animations for the Call-to-Action section.
 * This should be imported and called inside `src/modules/animations.js` (e.g. within initAnimations()).
 */
export function initCtaAnimations() {
  const ctaSection = document.querySelector('#sec-cta');
  if (!ctaSection) return;

  // Create a scroll-triggered timeline
  const ctaTl = gsap.timeline({
    scrollTrigger: {
      trigger: ctaSection,
      // Since #sec-cta is a .stack-card sliding up over horizontal content,
      // triggering when it is 75% into the viewport works well for both desktop & mobile.
      start: 'top 75%',
      // Play animation when entering, reverse/reset when scrolling back up
      toggleActions: 'play none none reverse',
      // markers: false // Set to true for local debugging
    }
  });

  // 1. STATS ITEM REVEAL
  // Staggered rise and fade in of numbers and labels
  ctaTl.fromTo(
    ctaSection.querySelectorAll('.stat-item'),
    { 
      opacity: 0, 
      y: 45, 
      scale: 0.95 
    },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      duration: 0.8, 
      stagger: 0.15, 
      ease: 'power3.out' 
    }
  );

  // 2. POWER TITLE REVEAL (Masked Slide Up)
  // Inside cta-footer.html, we wrapped the text in .cta-line-inner inside .cta-line.
  // .cta-line has overflow: hidden, acting as a window mask.
  ctaTl.fromTo(
    ctaSection.querySelectorAll('.cta-line-inner'),
    { 
      yPercent: 105 
    },
    { 
      yPercent: 0, 
      duration: 1.1, 
      stagger: 0.18, 
      ease: 'power4.out' 
    },
    '-=0.55' // Clean overlap with stats animation for fluid choreography
  );

  // 3. SUBTEXT, CONVERSION BUTTON, AND TRUST NOTE REVEAL
  // Elegant fade & lift to finalize the layout assembly
  ctaTl.fromTo(
    [
      ctaSection.querySelector('.cta-sub'),
      ctaSection.querySelector('.cta-btn-wrapper'),
      ctaSection.querySelector('.cta-note')
    ],
    { 
      opacity: 0, 
      y: 25 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.12, 
      ease: 'power3.out' 
    },
    '-=0.65' // Start animating before the title completely finishes rising
  );
}

/* ==========================================================================
   INTEGRATION INSTRUCTIONS:
   
   To add this to the master project animation registry:
   
   1. Open `src/modules/animations.js`.
   2. Import this function:
      `import { initCtaAnimations } from './cta-footer.js';`
      (or simply copy the code block inside `initAnimations()`).
   3. Invoke `initCtaAnimations()` at the end of `initAnimations()`.
   ========================================================================== */
