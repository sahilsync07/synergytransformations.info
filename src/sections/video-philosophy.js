/* ==========================================================================
   ANIMATION DOCUMENTATION: VIDEO REVEAL & PHILOSOPHY
   File: src/sections/video-philosophy.js
   ==========================================================================
   This file documents the recommended GSAP and ScrollTrigger updates for
   src/modules/animations.js. Update the corresponding blocks in that file
   to achieve the full cinematic, responsive scrollytelling experience.
*/

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

/**
 * Proposed code to replace the "3. CINEMATIC VIDEO REVEAL" and
 * "4. STACKING CARDS" sections in src/modules/animations.js
 */
export function updateAnimations() {

  // ==========================================================================
  // 3. CINEMATIC VIDEO REVEAL (REPLACING OLD BLOCK)
  // ==========================================================================
  const videoSection = document.getElementById('sec-video');
  
  if (videoSection) {
    const videoTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#sec-video',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        // Sync active state class to toggle iframe pointer-events & fade overlays
        onUpdate: (self) => {
          if (self.progress > 0.95) {
            videoSection.classList.add('video-reveal--interactive');
          } else {
            videoSection.classList.remove('video-reveal--interactive');
          }
        }
      }
    });

    // A. Part the text overlay outwards
    videoTl.to('#vr-word-top', { 
      y: -180, 
      opacity: 0, 
      duration: 0.5, 
      ease: 'power2.inOut' 
    }, 0);
    
    videoTl.to('#vr-word-bottom', { 
      y: 180, 
      opacity: 0, 
      duration: 0.5, 
      ease: 'power2.inOut' 
    }, 0);

    // B. Fade out scroll reveal indicator quickly
    videoTl.to('#vr-indicator', {
      y: 30,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, 0);

    // C. Expand the video window slit to full viewport
    videoTl.to('#video-window', {
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      filter: 'grayscale(0%) contrast(1) brightness(1)',
      scale: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.15);

    // D. Adapt the golden frame inside the window
    // Matches the roundness decrease and fades out just as video goes full-bleed
    videoTl.to('.video-reveal__frame', {
      borderRadius: '0px',
      opacity: 0,
      duration: 0.95,
      ease: 'power2.inOut'
    }, 0.15);

    // E. Lighten the vignette filter to make video clear
    videoTl.to('.video-reveal__vignette', {
      opacity: 0.25,
      duration: 1.0,
      ease: 'power2.inOut'
    }, 0.15);
  }


  // ==========================================================================
  // 4. STACKING CARDS & PHILOSOPHY QUOTE (REPLACING OLD BLOCK)
  // ==========================================================================
  const stackCards = gsap.utils.toArray('.stack-card');
  
  stackCards.forEach((card, i) => {
    // Specialize animations if the card is the Philosophy Quote Section
    if (card.id === 'sec-philosophy') {
      
      // A. Animate Emblem (◆ ◆ ◆) in from top
      gsap.fromTo('.philosophy__emblem',
        { opacity: 0, scale: 0.8, y: -30 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            scrub: true
          },
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'power2.out'
        }
      );

      // B. Animate Split Words of the Mega-Quote
      const quoteLines = card.querySelectorAll('.mq-line');
      if (quoteLines.length > 0) {
        // Split Type divides the text into individual words
        const qSplit = new SplitType(quoteLines, { types: 'words' });
        
        gsap.fromTo(qSplit.words,
          { opacity: 0, y: 60, rotate: 2 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'center 40%',
              scrub: 1
            },
            opacity: 1,
            y: 0,
            rotate: 0,
            stagger: 0.08,
            ease: 'power3.out'
          }
        );
      }

      // C. Animate Citation (THE SYNERGY TRANSFORMATION CODE) in from bottom
      gsap.fromTo('.philosophy__cite',
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 50%',
            end: 'center 30%',
            scrub: true
          },
          opacity: 1,
          y: 0,
          ease: 'power2.out'
        }
      );

    } else {
      // Default fallback stacking card reveal logic (e.g. for CTA section)
      const quoteLines = card.querySelectorAll('.mq-line');
      if (quoteLines.length > 0) {
        const qSplit = new SplitType(quoteLines, { types: 'words' });
        gsap.fromTo(qSplit.words,
          { opacity: 0, y: 50 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
              end: 'center center',
              scrub: 1
            },
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: 'power2.out'
          }
        );
      }
    }
  });
}
