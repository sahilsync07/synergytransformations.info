/* ========================================================
   CINEMATIC DOM ANIMATIONS (Apple-Style Scrollytelling)
   ======================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  
  // 1. KINETIC TYPOGRAPHY (Hero)
  const heroText = new SplitType('.split-text', { types: 'chars' });
  const heroTl = gsap.timeline({ delay: 0.2 });

  heroTl.fromTo(
    '.kicker[data-reveal]',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  );

  heroTl.fromTo(
    heroText.chars,
    { opacity: 0, yPercent: 100, rotateX: -90 },
    {
      opacity: 1,
      yPercent: 0,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.04,
      ease: 'back.out(1.5)',
      transformOrigin: '50% 100%'
    },
    "-=0.6"
  );
  
  heroTl.fromTo(
    '#scroll-cue',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
    "-=0.4"
  );

  // 2. HERO FADE & SCALE ON SCROLL
  gsap.to('.hero__container', {
    scrollTrigger: {
      trigger: '#sec-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    opacity: 0,
    scale: 0.9,
    y: 100
  });

  // 3. CINEMATIC VIDEO REVEAL
  // As user scrolls, the text splits and the video expands to full screen
  const videoSplit = new SplitType('.vr-split', { types: 'words, chars' });
  
  const videoTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#sec-video',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      pin: '.video-reveal__sticky'
    }
  });

  // Part the text outwards
  videoTl.to(videoSplit.chars, {
    y: -100,
    opacity: 0,
    stagger: { amount: 0.5, from: 'center' },
    ease: 'power2.inOut'
  }, 0);

  // Expand the video window
  // Initial clip-path in CSS: inset(45% 30% 45% 30% round 16px)
  // Target: inset(0% 0% 0% 0% round 0px)
  videoTl.to('#video-window', {
    clipPath: 'inset(0% 0% 0% 0% round 0px)',
    filter: 'grayscale(0%) contrast(1)',
    scale: 1,
    ease: 'none'
  }, 0);

  // 4. STACKING CARDS (Philosophy & CTA)
  // These sections slide up and cover the previous content.
  const stackCards = gsap.utils.toArray('.stack-card');
  stackCards.forEach((card, i) => {
    // Reveal animation for content inside the card
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
  });

  // 5. HORIZONTAL SCROLL (Pillars & Journey)
  const hTrack = document.getElementById('h-track');
  if (hTrack && window.innerWidth > 768) {
    const panels = gsap.utils.toArray('.h-panel');
    // Calculate total distance to scroll horizontally
    // (Total width of track - window width)
    
    // We use a functional end value so it recalculates on resize
    function getScrollAmount() {
      let trackWidth = hTrack.scrollWidth;
      return -(trackWidth - window.innerWidth);
    }

    gsap.to(panels, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: '#sec-horizontal',
        start: 'top top',
        end: () => `+=${getScrollAmount() * -1}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true
      }
    });
  }
}
